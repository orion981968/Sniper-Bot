const Web3 = require("web3");
var web3 = new Web3(new Web3.providers.WebsocketProvider('wss://bsc-ws-node.nariox.org:443'));
// var web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/9b5a990f9b094a8ea13ef564debebe8d'));
const ethers = require('ethers');
var provider = new ethers.providers.WebSocketProvider("wss://bsc-ws-node.nariox.org:443");
// const provider = new ethers.providers.WebSocketProvider("wss://ropsten.infura.io/ws/v3/9b5a990f9b094a8ea13ef564debebe8d");

const routerABI = require('../config/swapRouterABI.json');
const factoryABI = require('../config/factoryABI.json');
const tokenABI = require('../config/tokenABI.json');
const pairABI = require('../config/pairABI.json');
const InputDataDecoder = require('ethereum-input-data-decoder');
const { createCallChain } = require("typescript");
const decoderRouter = new InputDataDecoder(routerABI);

const approve_abi = [
    'function approve(address spender, uint256 amount) external returns (bool)'
  ];

const pancake_route_abi = [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts)',
    
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
    'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
    
    'function swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    'function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
    'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable',
    
    'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',  
  ];

  let lastTimestamp = 0;
  let count = 0;
const checkCondition = (decodedParam, reserveInfo, params) => {
    
    // var poolAddress = await factoryContract.methods.getPair(decodedParam.tokenA, decodedParam.tokenB).call();
    // var pairContract = new web3.eth.Contract(pairABI, poolAddress);
    // var reserveInfo = await pairContract.methods.getReserves().call();
    

    if (params.token2 === decodedParam.tokenA) {
        //if (params.minAddLiquidity >= reserveInfo.reserve0) {
        if (params.minAddLiquidity >= decodedParam.amountADesired) {
            return false;
        }
    } else if (params.token2 === decodedParam.tokenB) {
        //if (params.minAddLiquidity >= reserveInfo.reserve1) {
        if (params.minAddLiquidity >= decodedParam.amountBDesired) {
            return false;
        }
    } else return false;

    if (Date.now() - lastTimestamp <= 3000) return false;
    if (count > 4) return;
    lastTimestamp = Date.now(); count++;
    console.log('check swap condition => true');
    return true;
}
const approveSwap = async (params, account) => {
    try {
        let ifacePool = new ethers.utils.Interface(approve_abi);
        var data = ifacePool.encodeFunctionData('approve', [params.router, ethers.BigNumber.from("115792089237316195423570985008687907853269984665640564039457584007913129639935")]);
        const txObj =
        {
            from: account.address,
            to: params.token1,
            value: 0,
            gasLimit: 144264, // 100000
            gasPrice: 6000000000,
            data: data
        }
    
        account.sendTransaction(txObj)
        .then(async (transaction) => 
        {
            try {
                console.log(transaction);
                console.log('====================== Approve Send finished! ================= ');
            }catch(err) {
                console.log('approve: ' + err);
            }
            
        })
    }catch(err) {

    }
}

const swapTrade = async (decodedParam, params, factoryContract, account, bridge, addSwapCallback) => {
    
    if (checkCondition(decodedParam, factoryContract, params)) 
    {
        try {
            // account.sendTransaction(txObj)
            // .then(async (transaction) => 
            {
            //     console.log(transaction);
            //   console.log('====================== Approve Send finished! ================= ');

              var tokenPair = [params.token1, params.token2];
              if (bridge == "0x") 
                return;
              else if(bridge != "")
                tokenPair = [params.token1, bridge, params.token2];

                console.log(bridge);

              let ifaceRouter = new ethers.utils.Interface(pancake_route_abi);
              const pancake_route_contract = new ethers.Contract(params.router, pancake_route_abi, provider);
              var amounts = 0;

              var amountIn = params.amount, amountOut = params.amount;
              var data = "";
              
              try {
                if (params.swapFunc == "swapTokensForExactTokens" || params.swapFunc == "swapTokensForExactETH") 
                {
                    amounts = await pancake_route_contract.getAmountsIn(params.amount, tokenPair);
                    var amountInMax = Math.floor(amounts[0] * 0.97); // 3%
                    amountIn = amountInMax;
                    data = ifaceRouter.encodeFunctionData(params.swapFunc, [amountOut.toString(), amountIn.toString(), tokenPair, account.address, Date.now() + 1000 * 60 * 5]);
                }
                else if (params.swapFunc == "swapExactTokensForTokens" || params.swapFunc == "swapExactTokensForTokensSupportingFeeOnTransferTokens" 
                        || params.swapFunc == "swapExactTokensForETH" || params.swapFunc == "swapExactTokensForETHSupportingFeeOnTransferTokens" ) 
                {
                    amounts = await pancake_route_contract.getAmountsOut(amountIn.toString(), tokenPair);
                    var amountOutMin = Math.floor(amounts[1] * 0.97); // 3%
                    amountOut = amountOutMin;
                    data = ifaceRouter.encodeFunctionData(params.swapFunc, [amountIn.toString(), amountOut.toString(), tokenPair, account.address, Date.now() + 1000 * 60 * 5]);
                } 
                else if (params.swapFunc == "swapExactETHForTokens" || params.swapFunc == "swapExactETHForTokensSupportingFeeOnTransferTokens") {
                    // data = ifaceRouter.encodeFunctionData(params.swapFunc, [amountOut, tokenPair, wallet.address, Date.now() + 1000 * 60 * 5]);
                    return;
                }
                else if (params.swapFunc == "swapETHForExactTokens") {
                    data = ifaceRouter.encodeFunctionData(params.swapFunc, [amountOut.toString(), tokenPair, account.address, Date.now() + 1000 * 60 * 5]);
                }
                else if (params.swapFunc == "")
                    return;
                }catch(err){
                    console.log('swap1: ' + err);
                }
                try{
                    const txObjs =
                    {
                        from: account.address,
                        to: params.router,
                        value: 0,
                        gasLimit: 144264, // 100000
                        gasPrice: 5000000000,
                        data: data,
                    }
                    console.log('swap => ');

                    account.sendTransaction(txObjs).then((transaction) => {
                        try {
                            console.dir(transaction);
                            var param = {
                                amountIn: amountIn,
                                amountOut: amountOut,
                                path: tokenPair,
                                to: '0x' + transaction.to,
                                blocknumber: transaction.blockNumber,
                                txHash: transaction.hash
                            }
    
                            addSwapCallback(param);
                            console.log('====================== Swap Send finished! ================= ');
                        }catch(err) {
                            console.log('swap send: ' + err);
                        }
                        
                      });
                }catch(err){
                    console.log('swap2: ' + err);
                }
                
            }
          } catch (error) {
            console.log(error);
          }
    }
}

const RunBot = async (addLiquidityCallback, addSwapCallback, newBlockCallback, alertCallback, params) => {

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
    

    var bridge = "";
    // fetch('/factory/' + params.token1 + '/' + params.token2, {
    //     method: 'GET',
    //   })
    //   .then(response => response.json())
    //   .then(data => {
    //       if (data.success) {
    //         bridge = data.token;
    //       } else {
    //         bridge = '0x';
    //       }
    //   })
    //   .catch((error) => {
    //       console.error('Error:', error);
    //   });

    
    const wallet = new ethers.Wallet(params.privateKey, provider);
    const account = await wallet.connect(provider); 

    approveSwap(params, account);
    var routerContract = new web3.eth.Contract(routerABI, params.router);
    try {
        var factoryAddress = await routerContract.methods.factory().call();
        alertCallback({msg: "Factory Address -> " + factoryAddress, varient: "success"});

        var factoryContract = new web3.eth.Contract(factoryABI, factoryAddress);
        var pairLength = await factoryContract.methods.allPairsLength().call();
        alertCallback({msg: "Token Pair Length -> " + pairLength, varient: "success"});

        web3.eth.subscribe('pendingTransactions', function(error, result){
            if (error) {
                console.log(error)
            }
        })
        .on("data", function(transaction){
            web3.eth.getTransaction(transaction)
            .then(async (tx) => {
                try {
                    if (tx !== null && tx.hasOwnProperty('input')) 
                    {
                        var decodeRouterResult = decoderRouter.decodeData(tx.input);
    
                        var param, swap_flag = 0;

                        if (decodeRouterResult.method === "addLiquidity") {

                            var tokenA = '0x' + decodeRouterResult.inputs[0];
                            var tokenB = '0x' + decodeRouterResult.inputs[1];

                            var decodedParam = {
                                tokenA: tokenA,
                                tokenB: tokenB,
                                amountADesired: decodeRouterResult.inputs[2],
                                amountBDesired: decodeRouterResult.inputs[3],
                                amountAMin: decodeRouterResult.inputs[4],
                                amountBMin: decodeRouterResult.inputs[5],
                                addressTo: '0x' + decodeRouterResult.inputs[6],
                                deadline: new Date(Number(decodeRouterResult.inputs[7].toString()) * 1000),
                                blocknumber: tx.blockNumber,
                                from: tx.from,
                                to: tx.to,
                                txHash: tx.hash
                            }
                            // console.log(tx)
                            //console.log(param);
                            addLiquidityCallback(decodedParam);

                            swapTrade(decodedParam, params, factoryContract, account, bridge, addSwapCallback);
                        } 

                        if (decodeRouterResult.method === null) return;

                        /*if (tx.from == account.address)
                        { // only show mine transaction
                            console.log(tx);
                            if (decodeRouterResult.method === "swapExactTokensForTokens" || decodeRouterResult.method === "swapExactTokensForTokensSupportingFeeOnTransferTokens"
                                || decodeRouterResult.method === "swapExactTokensForETH" || decodeRouterResult.method === "swapExactTokensForETHSupportingFeeOnTransferTokens") {
                                param = {
                                    amountIn: decodeRouterResult.inputs[0],
                                    amountOut: decodeRouterResult.inputs[1],
                                    path: decodeRouterResult.inputs[2],
                                    to: '0x' + decodeRouterResult.inputs[3],
                                    deadline: new Date(Number(decodeRouterResult.inputs[4].toString()) * 1000),
                                    blocknumber: tx.blockNumber,
                                    txHash: tx.hash
                                }
        
                                for (var i = 0; i < param.path.length; i++) {
                                    param.path[i] = '0x' + param.path[i];
                                }
                                
                                swap_flag = 1;
                            } 
                            else if (decodeRouterResult.method === "swapTokensForExactTokens" || decodeRouterResult.method === "swapTokensForExactETH") {
                                param = {
                                    amountOut: decodeRouterResult.inputs[0],
                                    amountIn: decodeRouterResult.inputs[1],
                                    path: decodeRouterResult.inputs[2],
                                    to: '0x' + decodeRouterResult.inputs[3],
                                    deadline: new Date(Number(decodeRouterResult.inputs[4].toString()) * 1000),
                                    blocknumber: tx.blockNumber,
                                    txHash: tx.hash
                                }
        
                                for (var i = 0; i < param.path.length; i++) {
                                    param.path[i] = '0x' + param.path[i];
                                }

                                swap_flag = 1;
                            } else if (decodeRouterResult.method === "swapExactETHForTokens" || decodeRouterResult.method === "swapExactETHForTokensSupportingFeeOnTransferTokens") {
                                param = {
                                    amountOut: decodeRouterResult.inputs[0],
                                    path: decodeRouterResult.inputs[1],
                                    to: '0x' + decodeRouterResult.inputs[2],
                                    deadline: new Date(Number(decodeRouterResult.inputs[3].toString()) * 1000),
                                    blocknumber: tx.blockNumber,
                                    txHash: tx.hash
                                }
        
                                for (var i = 0; i < param.path.length; i++) {
                                    param.path[i] = '0x' + param.path[i];
                                }

                                swap_flag = 1;
                            } else if (decodeRouterResult.method === "swapETHForExactTokens") {
                                param = {
                                    amountOut: decodeRouterResult.inputs[0],
                                    path: decodeRouterResult.inputs[1],
                                    to: '0x' + decodeRouterResult.inputs[2],
                                    deadline: new Date(Number(decodeRouterResult.inputs[3].toString()) * 1000),
                                    blocknumber: tx.blockNumber,
                                    txHash: tx.hash
                                }
        
                                for (var i = 0; i < param.path.length; i++) {
                                    param.path[i] = '0x' + param.path[i];
                                }

                                swap_flag = 1;
                            }
                            
                            if (swap_flag) {
                                addSwapCallback(param);
                            }
                        } */                  

                    }
                }
                catch (ex) {
                    console.log(tx);
                    console.log(ex);
                }
            });
        });

        web3.eth.subscribe('newBlockHeaders', function(error, result){
            if (error) {
                console.log(error)
            }
        })
        .on("connected", function(subscriptionId){
            console.log(subscriptionId);
        })
        .on("data", function(blockHeader){
            try {
                web3.eth.getBlock(blockHeader.number).then(block => {
                    try {
                        newBlockCallback(block.number, block.transactions);
                    }catch(err) {
                        console.log(err);
                    }
                });
            }catch(err) {
                console.log(err);
            }
        });
    } catch (ex) {
        alertCallback({msg: ex.toString(), varient: "error"});
    }
}

const StopBot = async (addLiquidityCallback, alertCallback) => {

    try {
        web3.eth.clearSubscriptions();
    } catch (ex) {
        alertCallback({msg: ex.toString(), varient: "error"});
    }
}

module.exports = {RunBot, StopBot};
