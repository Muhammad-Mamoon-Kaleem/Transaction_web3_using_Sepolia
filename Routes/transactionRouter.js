import express from 'express';
import { generateWallet, getAllWallets } from '../controllers/generateWallet.js';
import { transferFunds } from '../controllers/transfer.js';
import { checkBalanceController } from '../controllers/checkBalance.js';

export const transactionRouter = express.Router();
transactionRouter.post('/createaccount',generateWallet);
transactionRouter.get('/allwalets',getAllWallets);
transactionRouter.post('/sendtransaction',transferFunds);
transactionRouter.get('/checkbalance',checkBalanceController)