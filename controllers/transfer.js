import crypto from "crypto";
import web3 from "../config/provider.js";
import { configDotenv } from "dotenv";

configDotenv();

const decryptPrivateKey = (encrypted, ivHex) => {
  const secret = process.env.ENCRYPTION_SECRET;
  const secretKey = crypto.createHash('sha256').update(secret).digest();
  const iv = Buffer.from(ivHex,'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc',secretKey,iv);
  let decrypt = decipher.update(encrypted,'hex','utf-8');
  decrypt +=decipher.final('utf-8');
  return decrypt;
};

const transferFunds = async (req, res) => {
  try {
    const { fromEncryptedPrivateKey, iv, toAddress, amountEth } = req.body;

    if (!fromEncryptedPrivateKey || !iv || !toAddress || !amountEth) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Decrypt private key
    const privateKey = decryptPrivateKey(fromEncryptedPrivateKey, iv);
    console.log(privateKey);
    
    const sender = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(sender);

    // Get balances and gas estimates
    const balanceWei = BigInt(await web3.eth.getBalance(sender.address));
    const amountWei =  BigInt(web3.utils.toWei(amountEth,'ether'));
    const gasLimit = BigInt(21000);
    const gasPrice = BigInt(await web3.eth.getGasPrice());
    const totalCost = amountWei + gasLimit * gasPrice;

    // Check for sufficient balance
    if (balanceWei < totalCost) {
      return res.status(400).json({
        error: "Insufficient funds",
        balance: web3.utils.fromWei(balanceWei.toString(), "ether"),
        required: web3.utils.fromWei(totalCost.toString(), "ether"),
      });
    }

    // Send transaction
    const tx = {
      from: sender.address,
      to: toAddress,
      value: amountWei.toString(),
      gas: gasLimit.toString(),
      gasPrice: gasPrice.toString(),
    };

    const receipt = await web3.eth.sendTransaction(tx);

    return res.status(200).json({
      message: "Transfer Successful",
      transactionHash: receipt.transactionHash,
      from: sender.address,
      to: toAddress,
      amount: amountEth,
    });
  } catch (err) {
    console.error("Transfer failed:", err);
    return res.status(500).json({ error: "Transfer failed", err });
  }
};

export { transferFunds };
