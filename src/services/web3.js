import Web3 from "web3/dist/web3.min.js";
export default {
  hiweb3() {
    let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    return web3;
  },
};
