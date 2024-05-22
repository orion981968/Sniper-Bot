import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  select: {
    width: 300,
    height: 40,
    fontSize: 13,
    borderColor: "#0f0",
  },
  inputLabel: {
    fontSize: 13,
  },
  menuItem: {
    fontSize: 13,
  },
}));

const FunctionSelect = ({ functions, defaultValue, onFunctionChange }) => {
  const classes = useStyles();

  const handleFunctionChange = (e) => {
    onFunctionChange(e.target.value);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel
        id="demo-simple-select-outlined-label"
        className={classes.inputLabel}
      >
        Functions
      </InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        label="Functions"
        onChange={handleFunctionChange}
        fullWidth={true}
        value={defaultValue}
        className={classes.select}
      >
        {functions.map((functionN, i) => (
          <MenuItem key={i} value={functionN} className={classes.menuItem}>
            {functionN}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FunctionSelect;
