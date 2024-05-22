const connectDB = require('./db');
const routerABI = require('../src/Bot/config/swapRouterABI.json');
const factoryABI = require('../src/Bot/config/factoryABI.json');
const pairABI = require('../src/Bot/config/pairABI.json');
const Factory = require('./models/Factory');
const Web3 = require("web3");
var web3 = new Web3(new Web3.providers.WebsocketProvider('wss://bsc-ws-node.nariox.org:443'));

connectDB();

const syncFactory = async (router) => {
  try {
    var routerContract = new web3.eth.Contract(routerABI, router);

    var factoryAddress = await routerContract.methods.factory().call();

    var factoryContract = new web3.eth.Contract(factoryABI, factoryAddress);
    var pairLength = await factoryContract.methods.allPairsLength().call();
    console.log(pairLength);

    var lastindex = 0;
    last = await Factory.find().sort({"index":-1}).limit(1);
    if (last.length > 0) lastindex = last[0].index;

    console.log(lastindex);
    var pairAddressList = [];
    for (var i = lastindex+1; i < pairLength; i++) {
        var pairAddr = await factoryContract.methods.allPairs(i).call();

        var pairContract = new web3.eth.Contract(pairABI, pairAddr);
        var token0 = await pairContract.methods.token0().call();
        var token1 = await pairContract.methods.token1().call();
        const factory = new Factory({
          factory: factoryAddress,
          pairaddress: pairAddr,
          token0: token0,
          token1: token1,
          index: i
        });
        console.log(i + ":" + pairAddr);
        await factory.save();
    }
  }catch(err){
    console.log(err);
  }
  
}

syncFactory("0x10ed43c718714eb63d5aa57b78b54704e256024e");