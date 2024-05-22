import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TokenSelect from "./TokenSelect";
import FunctionSelect from "./FunctionSelect";

import { Button, TextField, Grid, Box, InputLabel } from "@material-ui/core";

const config = require("../config/settings.json");

const useStyles = makeStyles((theme) => ({
  textField: {
    maxWidth: 90,
    maxHeight: 40,
    fontSize: 13,
  },
  inputLabel: {
    fontSize: 25,
  },
  box: {
    paddingTop: 50,
    paddingBottom: 50,
    borderRadius: 5,
    backgroundColor: "white",
  },
}));

const ParameterSetting = ({
  onTokenChange,
  onAmountChange,
  onFunctionChange,
  onSlippageChange,
  onGaspriceChange,
  onStart,
  onStop,
}) => {
  const classes = useStyles();

  const handleAmountChange = (e) => {
    onAmountChange(e.target.value);
  };

  const handleSlippageChange = (e) => {
    onSlippageChange(e.target.value);
  };

  const handleGaspriceChange = (e) => {
    onGaspriceChange(e.target.value);
  };

  return (
    <Box boxShadow={3} className={classes.box}>
      <Grid container direction="row" spacing={4} justifyContent="center">
        <Grid item xs={12}>
          <InputLabel
            id="demo-simple-select-outlined-label"
            className={classes.inputLabel}
          >
            Settings
          </InputLabel>
        </Grid>
        <Grid item xs={3}>
          <TokenSelect
            tokens={config.addresses}
            type="Token1"
            onTokenChange={onTokenChange}
          ></TokenSelect>
        </Grid>
        <Grid item xs={3}>
          <TokenSelect
            tokens={config.addresses}
            type="Token2"
            onTokenChange={onTokenChange}
          ></TokenSelect>
        </Grid>
      </Grid>
      <Grid container direction="row" spacing={4} justifyContent="center">
        <Grid item xs={3}>
          <TextField
            id="outlined-number"
            label="Amount"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            defaultValue="0"
            onChange={handleAmountChange}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            id="outlined-number"
            label="Slippage"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            defaultValue="0"
            onChange={handleSlippageChange}
            className={classes.textField}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            id="outlined-number"
            label="Gas Price"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            defaultValue="0"
            variant="outlined"
            onChange={handleGaspriceChange}
            className={classes.textField}
          />
        </Grid>
        <Grid item>
          <FunctionSelect
            functions={config.functions}
            onFunctionChange={onFunctionChange}
          ></FunctionSelect>
        </Grid>
      </Grid>
      <Grid container direction="row" spacing={4} justifyContent="center">
        <Grid item>
          <Button variant="contained" color="primary" onClick={onStart}>
            Start
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={onStop}>
            Stop
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ParameterSetting;
