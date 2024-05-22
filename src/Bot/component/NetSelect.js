import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 140,
  },
  selectEmpty: {
    marginTop: theme.spacing(1),
  },
  select: {
    // width: 90,
    height: 40,
    fontSize: 13,
  },
  inputLabel: {
    fontSize: 13,
  },
  menuItem: {
    fontSize: 13,
  },
}));

const NetSelect = ({ defaultValue, onNetChange }) => {
  const classes = useStyles();

  const handleNetChange = (e) => {
    onNetChange(e.target.value);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel
        id="demo-simple-select-label"
        className={classes.inputLabel}
      >
        Net
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        onChange={handleNetChange}
        value={defaultValue}
      >
        <MenuItem value="56">BSC</MenuItem>
        <MenuItem value="1">ETH</MenuItem>
        <MenuItem value="3">Ropsten</MenuItem>
        <MenuItem value="97">BSC Test</MenuItem>
      </Select>
    </FormControl>
  );
};

export default NetSelect;
