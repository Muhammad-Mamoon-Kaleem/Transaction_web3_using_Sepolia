import { configDotenv } from "dotenv";
import web3 from "../config/provider.js";

import crypto from "crypto";
import { connectPostgres } from "../config/postgresConfigration.js";

configDotenv();

const generateWallet = async (req, res) => {
  try {
    const account = web3.eth.accounts.create();
    const db = await connectPostgres();
    const secret = process.env.ENCRYPTION_SECRET;
    const balanceWei = await web3.eth.getBalance(account.address);
    const balanceEth = web3.utils.fromWei(balanceWei, "ether");

    //encryption of private key
    const secretKey = crypto.createHash("sha256").update(secret).digest();
    const iv = crypto.randomBytes(16);
    console.log("iv", iv);

    const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);
    console.log(cipher);

    let encrypted = cipher.update(account.privateKey, "utf-8", "hex");
    encrypted += cipher.final("hex");
    console.log("encrypted key ", encrypted);

    await db.query(
      `INSERT INTO wallets (address, encrypted_private_key,iv) VALUES ($1,$2,$3)`,
      [account.address, encrypted, iv.toString("hex")]
    );
    return res.status(200).json({
      address: account.address,
      encryptedPrivateKey: encrypted,
      iv: iv.toString("hex"),
      balance: balanceEth,
    });
  } catch (err) {
    console.error("Error generating wallet:", err);
    res.status(500).json({ error: "Failed to generate wallet" });
  }
};

const getAllWallets = async (req, res) => {
  try {
    const db = await connectPostgres();
    const result = await db.query(`SELECT * FROM wallets`);
    const wallets = result.rows;
    console.log("all wallet  accounts ", wallets);

    return res.status(200).json({ success: true, message: wallets });
  } catch (error) {
    console.log("error in getting wallet accounts..", error);
    return res.json({
      success: false,
      message: "error in getting wallet accounts..",
      error,
    });
  }
};

export { generateWallet, getAllWallets };
