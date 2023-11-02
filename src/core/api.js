import {getAvaliableCurrenciesUrl, getExchangeAmountUrl, getMinExchangeAmountUrl} from "./config";
const  {REACT_APP_API_KEY} = process.env;

export async function getAvaliableCurrencies() {
  try {
    return await fetch(getAvaliableCurrenciesUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Response is not ok');
          }
          return response.json();
        })
        .catch(error => {
          console.error('Fetch error:', error);
        })
  } catch (error) {
    console.error('Fetch get available currencies error:', error);
    throw error;
  }
}

export async function getMinimalExchangeAmount(from, to) {
  try {
    return await fetch(`${getMinExchangeAmountUrl}${from}_${to}?api_key=${REACT_APP_API_KEY}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Response is not ok');
          }
          return response.json();
        })
        .catch(error => {
          console.error('Fetch error:', error);
        })
  } catch (error) {
    console.error('Fetch get minimal exchange amount error:', error);
    throw error;
  }
}

export async function getExchangeAmount(amount, from, to) {
  try {
    return await fetch(`${getExchangeAmountUrl}${amount}/${from}_${to}?api_key=${REACT_APP_API_KEY}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Response is not ok');
          }
          return response.json();
        })
        .catch(error => {
          console.error('Fetch error:', error);
        })
  } catch (error) {
    console.error('Fetch get exchange amount error:', error);
    throw error;
  }
}
