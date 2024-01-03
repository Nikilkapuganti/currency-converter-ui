import axios from 'axios';

const coingeckoApi = axios.create({
  baseURL: process.env.REACT_APP_COINGECKO_API,
});

const currencyApi = axios.create({
  baseURL: process.env.REACT_APP_CURRENCY_API,
});

export { coingeckoApi, currencyApi };
