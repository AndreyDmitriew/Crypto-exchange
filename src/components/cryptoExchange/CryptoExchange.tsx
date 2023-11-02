import React, {useState, useEffect} from 'react';
import {Box, Typography, Button, FormControl, TextField} from '@mui/material';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import {toast} from 'react-toastify';

import CustomInput from "../сustomInput/CustomInput";

import {getAvaliableCurrencies, getExchangeAmount, getMinimalExchangeAmount} from "../../core/api";

import 'react-toastify/dist/ReactToastify.css';
import styles from './CryptoExchange.module.scss';

type State = {
  amount: number;
  currency: string | undefined;
};

function CryptoExchange() {
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const [valueFrom, setValueFrom] = useState<State | any>(null);
  const [valueTo, setValueTo] = useState<State | any>(null);
  const [minAmount, setMinAmount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const currencies = await getAvaliableCurrencies();
      setAvailableCurrencies(currencies);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (valueFrom && valueTo) {
      const fetchData = async () => {
        const minExchangeAmount = await getMinimalExchangeAmount(valueFrom.currency, valueTo.currency);
        if (!minExchangeAmount) {
          setError("This pair is disabled now")
          return
        }
        setMinAmount(minExchangeAmount.minAmount)
        setValueFrom((prevState: State | null) => ({
          ...prevState,
          amount: minExchangeAmount.minAmount,
          currency: prevState?.currency || undefined,
        }));
        setError("")
      };
      fetchData();
    }
  }, [valueFrom?.currency, valueTo?.currency]);


  const getExchange = async () => {
    if (valueFrom && valueFrom?.amount && valueFrom.currency && valueTo && valueTo.currency) {

      if (valueFrom.amount < minAmount) {
        setValueTo((prevState: State | null) => ({
          ...prevState,
          amount: '—',
          currency: prevState?.currency || undefined,
        }));
        setError("Less than minimum")
        return
      }

      try {
        const exchangeAmount = await getExchangeAmount(valueFrom.amount, valueFrom.currency, valueTo.currency);
        if (exchangeAmount === null) {
          setError("This pair is disabled now")
          return
        }
        if (exchangeAmount && exchangeAmount.estimatedAmount !== undefined) {
          setValueTo((prevState: State | null) => ({
            ...prevState,
            amount: exchangeAmount.estimatedAmount,
            currency: prevState?.currency || undefined,
          }));
          setError("")
        } else {
          toast.error('An error occurred. Please try again later.');
        }
      } catch (error) {
        console.error("Error fetching exchange amount:", error);
      }
    }
  };


  return (
    <FormControl className={styles.form}>
      <Box className={styles.formContainer}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Crypto Exchange</h1>
          <h3 className={styles.subTitle}>Exchange fast and easy</h3>
        </div>
        <div className={styles.inputsContainer}>
          <CustomInput availableCurrencies={availableCurrencies} setValue={setValueFrom} value={valueFrom} getExchange={getExchange}
                       />
          <Box className={styles.arrowsContainer}>
            <SyncAltIcon className={styles.arrows} color="primary" fontSize="small"/>
          </Box>
          <CustomInput availableCurrencies={availableCurrencies} setValue={setValueTo} value={valueTo} getExchange={getExchange} isAmountChangeDisabled
                       />
        </div>
        <div className={styles.addressContainer}>
          <p className={styles.addressTitle}>Your Ethereum address</p>
          <div className={styles.addressBtnContainer}>
            <TextField sx={{
              '& .MuiInputBase-root': {height: '50px'},
              '& fieldset': {
                border: '1px solid #E3EBEF',
              },
              '&.noBorderFieldset fieldset': {
                border: 'none',
              },
            }} className={styles.addressInput}
                       id="outlined-basic" variant="outlined"/>
            <Box>
              <Button onClick={getExchange} className={error ? styles.buttonExchangeError : styles.buttonExchange}
                      variant="contained"> EXCHANGE</Button>
              {error && <Typography className={styles.errorMessage}>{error}</Typography>}
            </Box>
          </div>
        </div>
      </Box>
    </FormControl>
  );
}

export { CryptoExchange };
