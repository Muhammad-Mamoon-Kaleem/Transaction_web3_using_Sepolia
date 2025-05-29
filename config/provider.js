
import Web3 from "web3";

const web3 = new Web3(
  `https://sepolia.infura.io/v3/fb5437e6be3746bab0b5a1647334a534`
);

web3.eth.getBlockNumber().then((block)=>{
    console.log(`connected to block ${block}.`);
    
}).catch((error)=>{
    console.log('error in connecting with sepolia ',error);
    
})
export default web3;
