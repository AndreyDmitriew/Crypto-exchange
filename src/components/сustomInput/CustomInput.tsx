import React, { useState } from 'react';
import { Divider, Select, MenuItem, Paper, InputBase, FormControl, Box, Typography } from '@mui/material';
import { REGEX_NUMBER_AND_DASH } from "../../core/consts";

import styles from './CustomInput.module.scss';

type Currency = {
  ticker: string;
  image: string;
  name: string;
};

type CustomInputProps = {
  availableCurrencies: Currency[];
  setValue: (newValue: { amount: number; currency: string }) => void;
  value: { amount: number; currency: string };
  getExchange: () => void;
  isAmountChangeDisabled?: boolean;
};

function CustomInput({ availableCurrencies, setValue, value, getExchange, isAmountChangeDisabled }: CustomInputProps) {
  const [isListOpen, setIsListOpen] = useState(false);
  const handleChange = (newValue: { amount: number; currency: string }) => {
    setValue(newValue);
    getExchange();
  }

  return (
    <Paper variant="outlined" className={styles.customInputContainer}>
      <FormControl className={styles.inputContainer}>
        <InputBase
          style={{ fontSize: 17, marginLeft: '15px' }}
          value={value?.amount || ''}
          onChange={(e) => {
            if (REGEX_NUMBER_AND_DASH.test(e.target.value)) {
              handleChange({ ...value, amount: e.target.value as unknown as number });
            }
          }}
          type="number"
          disabled={isAmountChangeDisabled}
        />
      </FormControl>

      <Divider sx={{
        height: '35px',
        margin: '10px 0 10px 90px'
      }} orientation="vertical" />

      <Box>
        <Select
          sx={{
            "& fieldset": { border: 'none' },
            "& .MuiMenu-list": {
              maxHeight: '200px',
            },
          }}
          onOpen={() => setIsListOpen(true)}
          onClose={() => setIsListOpen(false)}
          value={value?.currency || ''}
          onChange={(e) => {
            handleChange({
              ...value,
              currency: e.target.value.toString(),
            });
          }}
          variant="outlined"
        >
          {availableCurrencies.map((el: Currency) => {
            return <MenuItem key={el.ticker} value={el.ticker}>
              <Box  style={{ display: 'flex' }}>
                <img src={el.image} className={styles.currencyDropdown} alt='Currency icon' />
                <Typography className={styles.currencyAbbreviation}>{el.ticker.toUpperCase()}</Typography>
                {isListOpen && <Typography className={styles.currencyFullName}>{el.name}</Typography>}
              </Box>
            </MenuItem>
          })}
        </Select>
      </Box>
    </Paper>
  );
}

export default CustomInput;

