import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField, Grid, FormControl, Input, InputLabel, Select, MenuItem } from "@material-ui/core";

import FunctionSelect from "./FunctionSelect";
import TokenSelect from "./TokenSelect";
import NetSelect from "./NetSelect";
const config = require("../config/settings.json");

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    marginTop: 20
  },
  dialogContent : {
    height: 430
  },
  textField: {
    // maxWidth: 150,
    maxHeight: 40,
    fontSize: 13,
  },
  inputLabel: {
    fontSize: 25,
  },
}));

export default function FormDialog(props) {
  const classes = useStyles();

  const { onSave, onClose } = props;

  const [functions, setFunctions] = React.useState(config.function0);
  const [open, setOpen] = React.useState(false);
  const [net, setNet] = React.useState(props.net);
  const [token1, setToken1] = React.useState(props.token1);
  const [token2, setToken2] = React.useState(props.token2);
  const [minAddLiquidity, setMinAddLiquidity] = React.useState(props.minAddLiquidity);
  const [amount, setAmount] = React.useState(props.amount);
  const [privateKey, setPrivateKey] = React.useState(props.privateKey);
  const [router, setRouter] = React.useState(props.router);
  const [swapFunc, setSwapFunc] = React.useState(props.swapFunc);
  const [bridge, setBridge] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNet(props.net);
    setToken1(props.token1);
    setToken2(props.token2);
    setMinAddLiquidity(props.minAddLiquidity);
    setAmount(props.amount);
    setRouter(props.router);
    setPrivateKey(props.privateKey);
    setSwapFunc(props.swapFunc);
  };
  
  const handleSave = () => {
    
    setOpen(false);
    onSave(net, token1, token2, minAddLiquidity, amount, router, privateKey, swapFunc);
  };

  const onNetChange = (value) => {
   
    setNet(value);
    setToken1(""); setToken2("");
  };

  const onTokenChange = (value, type) => {
   
    setFunctions(config.function0);
    if (type == "Base Token") {
      setToken1(value);
      if (value == "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") { // ETH
        setFunctions(config.function1);
      }
    } else if (type == "Purchase Token") {
      setToken2(value);
      
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleRouterChange = (e) => {
    setRouter(e.target.value);
  }

  const handleFunctionChange = (func) => {
    setSwapFunc(func);
  }

  const handlePrivateKeyChange = (e) => {
    setPrivateKey(e.target.value);
  }

  const handleMinAddLiquidityChange = (e) => {
    setMinAddLiquidity(e.target.value);
  }

  return (
    <div>
      <Button variant="outlined" color="secondary" onClick={handleClickOpen}>
        Settings
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>
          <Grid container direction="row" justifyContent="space-between">
            Parameter Settings
              <NetSelect
                defaultValue={net}
                onNetChange={onNetChange}
              ></NetSelect>
          </Grid>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Grid container direction="row" spacing={4} justifyContent="flex-start">
            <Grid item xs={6}>
              <TokenSelect
                net={net}
                tokens={config.addresses}
                type="Base Token"
                defaultValue={token1}
                onTokenChange={onTokenChange}
              ></TokenSelect>
            </Grid>
            <Grid item xs={6}>
              <TokenSelect
                net={net}
                tokens={config.addresses}
                type="Purchase Token"
                defaultValue={token2}
                onTokenChange={onTokenChange}
              ></TokenSelect>
            </Grid>
          </Grid>

          <Grid container direction="row" spacing={4} justifyContent="flex-start">
          <Grid item xs={6}>
              <TextField
                id="standard-helperText"
                label="Min-AddLiquidity"
                type="number"
                variant="standard"
                defaultValue={minAddLiquidity}
                onChange={handleMinAddLiquidityChange}
                className={classes.textField}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="standard-helperText"
                label="Amount"
                type="number"
                variant="standard"
                defaultValue={amount}
                onChange={handleAmountChange}
                className={classes.textField}
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={4}>
            <Grid item item xs={12}>
              <FormControl fullWidth className={classes.margin}>
                <InputLabel htmlFor="standard-factory">Router</InputLabel>
                <Input
                  id="standard-router"
                  value={router}
                  onChange={handleRouterChange}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={4}>
            <Grid item item xs={12}>
              <FormControl fullWidth className={classes.margin}>
                <InputLabel htmlFor="standard-privatekey">PrivateKey</InputLabel>
                <Input
                  id="standard-privateKey"
                  value={privateKey}
                  onChange={handlePrivateKeyChange}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container direction="row" spacing={4} justifyContent="flex-start">
            <Grid item>
              <FunctionSelect
                functions={functions}
                defaultValue={swapFunc}
                onFunctionChange={handleFunctionChange}
              ></FunctionSelect>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
