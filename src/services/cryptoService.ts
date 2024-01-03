import { AxiosResponse } from 'axios';
import { coingeckoApi, currencyApi } from './api'
import { Crypto } from '../interfaces/Crypto';


export const fetchAllCurrencies = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<string[]> = await coingeckoApi.get('/simple/supported_vs_currencies');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching supported currencies');
  }
};

export const fetchCryptoList = async (): Promise<Crypto[]> => {
  try {
    const response: AxiosResponse<Crypto[]> = await currencyApi.get('/currencies/getall');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching crypto list. Please try again.');
  }
};
