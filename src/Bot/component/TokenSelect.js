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

const TokenSelect = ({ net, tokens, type, defaultValue, onTokenChange }) => {
  const classes = useStyles();

  const handleTokenChange = (e) => {
    onTokenChange(e.target.value, type);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel
        id="demo-simple-select-label"
        className={classes.inputLabel}
      >
        {type}
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label={type}
        onChange={handleTokenChange}
        value={defaultValue}
      >
        {tokens.map((token, i) => (
          token.token_address[net] == "" ? "":
          <MenuItem
            key={i}
            value={token.token_address[net]}
            className={classes.menuItem}
          >
            {token.token_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TokenSelect;
