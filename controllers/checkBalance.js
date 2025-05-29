import web3 from "../config/provider.js";

const checkBalanceController = async (req, res) => {
  try {
    const { address } = req.body;

    if (!web3.utils.isAddress(address)) {
      return res.status(400).json({ error: "Invalid Ethereum address" });
    }

    const balanceWei = await web3.eth.getBalance(address);
    const balanceEth = web3.utils.fromWei(balanceWei, "ether");

    return res.status(200).json({
      address,
      balance: balanceEth,
      network: "Sepolia",
    });
  } 
  catch (err) {
    console.error("Error fetching balance:", err);
    return res.status(500).json({ error: "Failed to fetch balance" });
  }
};

export { checkBalanceController };
