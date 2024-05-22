const Web3 = require("web3");
// var web3 = new Web3(new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/9b5a990f9b094a8ea13ef564debebe8d"));
var web3 = new Web3(new Web3.providers.WebsocketProvider('wss://bsc-ws-node.nariox.org:443'));

const ethers = require('ethers');
// const provider = new ethers.providers.WebSocketProvider("wss://ropsten.infura.io/ws/v3/9b5a990f9b094a8ea13ef564debebe8d");
var provider = new ethers.providers.WebSocketProvider("wss://bsc-ws-node.nariox.org:443");

const config = require("../config/settings.json");

const abi = [
    // Read-Only Functions
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)",
    "function owner() view returns (address)",
    "function getUnlockTime() view returns (uint256)",
    "function paused() view returns (bool)",
    "function logicImplement() view returns (address)",
    "function totalSupply() view returns (uint256)",
    
    // Authenticated Functions
    "function transfer(address to, uint amount) returns (boolean)",

    // Events
    "event Transfer(address indexed from, address indexed to, uint amount)",
    "event TokenCreated(address indexed token)"
];

const getBalance = async(addBalanceCallback, params) => {
    
    if (params.net == "3") {
        web3 = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws/v3/9b5a990f9b094a8ea13ef564debebe8d'));
        provider = new ethers.providers.WebSocketProvider("wss://ropsten.infura.io/ws/v3/9b5a990f9b094a8ea13ef564debebe8d");
    } else if (params.net == "1") {
        web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/9b5a990f9b094a8ea13ef564debebe8d'));
        provider = new ethers.providers.WebSocketProvider("wss://mainnet.infura.io/ws/v3/9b5a990f9b094a8ea13ef564debebe8d");
    } else if (params.net == "97") {
        web3 = new Web3(new Web3.providers.WebsocketProvider('https://data-seed-prebsc-1-s2.binance.org:8545/'));
        provider = new ethers.providers.WebSocketProvider("https://data-seed-prebsc-1-s2.binance.org:8545/");
    }else if (params.net == "56") {
        web3 = new Web3(new Web3.providers.WebsocketProvider('wss://bsc-ws-node.nariox.org:443'));
        provider = new ethers.providers.WebSocketProvider("wss://bsc-ws-node.nariox.org:443");
    }
    
    const wallet = new ethers.Wallet(params.privateKey, provider);
    // const account = wallet.connect(provider);
    const walletAddress = wallet.address;
    const walletBalance = await provider.getBalance(walletAddress);
    
    var decodedParam = [];
    var param;
    param = {
        token: "BNB",
        balance: web3.utils.fromWei(walletBalance.toString(), 'ether'),
    }
    decodedParam = [        
        ...decodedParam,
        param
    ]

    var addrs = config.addresses;

    for(var i = 0; i < addrs.length; i++) {
        try{
            if (addrs[i].token_address[params.net] == "") continue;
            const bep20 = new ethers.Contract(addrs[i].token_address[params.net], abi, provider);
            var balanceBN = await bep20.balanceOf(walletAddress);
            var balance = parseInt(balanceBN);

            param = {
                token: addrs[i].token_name,
                balance: balance
            }
            decodedParam = [
                ...decodedParam,
                param
            ]
        }catch(err) {
            console.log('get balance error: ' + err);
        }
    }
    
    addBalanceCallback(decodedParam);
}


export default getBalance;