import React, { useState } from "react";
import { Button, Grid, Container } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import ResultTable from "./component/ResultTable";
import MempoolTable from "./component/MempoolTable";
import BalanceTable from "./component/BalancetTable";
import SettingDialog from "./component/SettingDialog";
import {RunBot, StopBot} from "./sniper/sniperlogic";
import getBalance from "./sniper/balancelogic";
import { Alert } from '@material-ui/lab';

import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import "./css/table.css";
import routers from "./config/routers";
const config = require("./config/settings.json");
const tokens = config.addresses;

const MempoolSniper = () => {
  let resultTemp = [];
  var liquidityTxs = [];
  var swapTxs = [];
  var balances = [];
  let timer = null;  
  const [stateLiquidityTxs, setStateLiquidityAddTxs] = React.useState([]);
  const [stateSwapTxs, setStateSwapTxs] = React.useState([]);
  const [alerts, setAlerts] = React.useState([]);
  const [net, setNet] = useState("56");
  const [token1, setToken1] = useState("");
  const [token2, setToken2] = useState("");
  const [minAddLiquidity, setMinAddLiquidity] = useState(0);
  const [swapFunc, setSwapFunc] = useState("");
  const [amount, setAmount] = useState(0);  
  const [router, setRouter] = useState("0x7a250d5630b4cf539739df2c5dacb4c659f2488d"); //eth
  const [privateKey, setPrivateKey] = useState("");
  // const [router, setRouter] = useState("0x10ED43C718714eb63d5aA57B78B54704E256024E");  //bsc
  // const [privateKey, setPrivateKey] = useState("55852f8ccc47dbcc755b27d7aa35f133de1b65960620f484c8e59fbfec3efbc3");
  const [startFlag, setStartFlag] = useState(0);
  const [stateBalance, setStateBalance] = React.useState([]);
  const [stateTimer, setStateTimer] = useState(0);

  const start = () => {
    console.log(token1, token2, minAddLiquidity, amount, router, privateKey, swapFunc);
    if(token1 === ''){
      NotificationManager.error('Base Token is empty');
      return;
    } 
    if(token2 === '') {
      NotificationManager.error("Purchase Token is empty");
      return;
    }
    if(minAddLiquidity <= 0) {
      NotificationManager.error("Min-AddLiquidity is invalid");
      return;
    } 
    if(amount <= 0) {
      NotificationManager.error("Amount is invalid");
      return;
    }
    if(router === '') {
      NotificationManager.error("Router is empty");
      return;
    }
    if(privateKey === '') {
      NotificationManager.error("PrivateKey is empty");
      return;
    }
    if(swapFunc === '') {
      NotificationManager.error("Function is empty");
      return;
    }
    
    if (!startFlag) {
      console.log("start");

      const params = {
        net, token1, token2, amount, minAddLiquidity, router, privateKey, swapFunc
      }
      RunBot(addLiquidityCallback, addSwapCallback, newBlockCallback, alertCallback, params);

      timer = setInterval(() => {
        getBalance(addBalanceCallback, params);
      }, 2000);

      setStateTimer(timer);
    } else {
      console.log("stop");
      StopBot(addBalanceCallback, alertCallback);
      
      clearInterval(stateTimer);
    }
    
    setStartFlag(startFlag === 0 ? 1 : 0);
  };

  const handleSave = (net_, token1_, token2_, minAddLiquidity_, amount_, router_, privateKey_, swapFunc_) => {
    setNet(net_);
    setToken1(token1_);
    setToken2(token2_);
    setMinAddLiquidity(minAddLiquidity_);
    setAmount(parseFloat(amount_));
    setRouter(router_);
    setPrivateKey(privateKey_);
    setSwapFunc(swapFunc_);
  }

  const handleClose = () => {
    console.log('Close Setting Dialog');
    console.log('Save Settings');
    console.log("Token1: " + token1);
    console.log("Token2: " + token2);
    console.log("Amount: " + amount);
    console.log("SwapFunc: " + swapFunc);
  }

  const alertCallback = (msg) => {
    alerts.push(msg);
    setAlerts(JSON.parse(JSON.stringify(alerts)));
  }

  const newBlockCallback = (blockNumber, txns) => {
    for (var i = 0; i < liquidityTxs.length; i++) {
      if (liquidityTxs[i].blockNumber == "" || liquidityTxs[i].blockNumber == undefined) {
        if (txns.includes(liquidityTxs[i].hash)) {
          liquidityTxs[i].blockNumber = blockNumber;
        }
      } else break;
    }
    setStateLiquidityAddTxs(JSON.parse(JSON.stringify(liquidityTxs)))

    for (var i = 0; i < swapTxs.length; i++) {
      if (swapTxs[i].blockNumber == "" || swapTxs[i].blockNumber == undefined) {
        if (txns.includes(swapTxs[i].hash)) {
          swapTxs[i].blockNumber = blockNumber;
        }
      } else break;
    }

    setStateSwapTxs(JSON.parse(JSON.stringify(swapTxs)))
  }
console.log('rrss');
  const addLiquidityCallback = (param) => {
    var tokenA = param.tokenA;
    var tokenB = param.tokenB;
    Object.keys(tokens).forEach(key => {
      if (tokens[key]["token_address"][net].toLowerCase() === param.tokenA.toLowerCase()) {
        tokenA = tokens[key]['token_name'];
      }

      if (tokens[key]["token_address"][net].toLowerCase() === param.tokenB.toLowerCase()) {
        tokenB = tokens[key]['token_name'];
      }
    })

    var routerAddress = param.to;
    Object.keys(routers).forEach(key => {
      if (routers[key]["address"][net].toLowerCase() === routerAddress.toLowerCase()) {
        routerAddress = key;
      }
    })

    var amountADesired = param.amountADesired;
    var amountBDesired = param.amountBDesired;
    var amountAMin = param.amountAMin;
    var amountBMin = param.amountBMin;
    var d = param.deadline;
    var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length===2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length===2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length===2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length===2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";
    
    var liquidityTx = {
      blockNumber: param.blockNumber,
      tokenA_B: tokenA + '\n' + tokenB,
      amountDesired_A_B: amountADesired + '\n' + amountBDesired,
      amountMin_A_B: amountAMin + '\n' + amountBMin,
      addressTo: param.addressTo,
      deadLine: date_format_str,
      from_to: param.from + '\n' + routerAddress,
      hash: param.txHash
    }

    if(liquidityTxs.length > 100) {
      liquidityTxs = liquidityTxs.slice(0, 100);
    }

    liquidityTxs = [
      liquidityTx,
      ...liquidityTxs
    ]
    setStateLiquidityAddTxs(JSON.parse(JSON.stringify(liquidityTxs)))
  }
  
  const addSwapCallback = (param) => {
    try {
      var token0 = param.path[0];
      var token1 = param.path[param.path.length - 1];

      Object.keys(tokens).forEach(key => {
        if (tokens[key]["token_address"][net].toLowerCase() === token0.toLowerCase()) {
          token0 = tokens[key]['token_name'];
        }
  
        if (tokens[key]["token_address"][net].toLowerCase() === token1.toLowerCase()) {
          token1 = tokens[key]['token_name'];
        }
      })

      var swapTx = {
        blockNumber: param.blockNumber,
        token0: token0,
        token1: token1,
        in: parseInt(param.amountIn),
        out: parseInt(param.amountOut),
        hash: param.txHash
      }


      if(swapTxs.length > 100) {
        swapTxs = swapTxs.slice(0, 100);
      }

      swapTxs = [
        swapTx,
        ...swapTxs
      ]

      setStateSwapTxs(JSON.parse(JSON.stringify(swapTxs)))
    }catch(err) {
      console.log(err);
    }
    
  }

  const addBalanceCallback = (param) => {
    balances = param;
    
    setStateBalance(JSON.parse(JSON.stringify(balances)))    
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      padding: 50
    },
    tbl_margin: {
      marginTop: 20
    },
    card_mempool: {
      backgroundColor: "#424242",
      minHeight: 300
    },
    card_result: {
      backgroundColor: "#424242",
      minHeight: 300
    },
    card_balance: {
      backgroundColor: "#424242",
      minHeight: 300
    }
  }));

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NotificationContainer/>
      <Grid container spacing={5} justifyContent="center">
        <Grid container item xs={8} direction="column" justifyContent="flex-start">
          {alerts.map((row, i) => {
            return (
              <Alert severity={row.varient} key={i}>{row.msg}</Alert>
            )
          })}
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" color={startFlag? 'secondary' : 'primary'} onClick={start}>
            {startFlag? "Stop" : "Start"}
          </Button>
        </Grid>
        <Grid item xs={1}>
          <SettingDialog
              onSave={handleSave}
              onClose={handleClose}
              net={net}
              token1={token1}
              token2={token2}
              minAddLiquidity={minAddLiquidity}
              amount={amount}
              router={router}
              privateKey={privateKey}
              swapFunc={swapFunc}
            />
        </Grid>
        
        <Grid item xs={12} className={classes.tbl_margin}>
          <Card className={classes.card_mempool}>
            <CardContent>
              <MempoolTable data={stateLiquidityTxs} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={7} className={classes.tbl_margin} >
          <Card className={classes.card_result}>
            <CardContent>
              <ResultTable data={stateSwapTxs} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={5} className={classes.tbl_margin} >
          <Card className={classes.card_balance}>
            <CardContent>
              <BalanceTable data={stateBalance} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default MempoolSniper;
