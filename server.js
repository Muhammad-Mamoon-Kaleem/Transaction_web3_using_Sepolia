import express from 'express';
import { connectPostgres } from './config/postgresConfigration.js';
import { transactionRouter } from './Routes/transactionRouter.js';

const app = new express();
app.use(express.json())
connectPostgres();
const port = 3000;
app.get('/',(req,res)=>{
    return res.json({success:false,message:'app is running on port ',port})
});
//api end points
app.use('/api/web3',transactionRouter)
app.listen(port,()=>console.log('server connected at port ',port))
