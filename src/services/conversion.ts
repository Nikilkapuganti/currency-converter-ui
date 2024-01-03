import {currencyApi} from './api';
import { ConversionResult} from '../interfaces';

export const convertCurrency = async (payload: object): Promise<ConversionResult> => {
  try {
    const response = await currencyApi.post<ConversionResult>('/currency/convert', payload);
    return response.data;
  } catch (error) {
    throw new Error('Error occurred during conversion. Please try again.');
  }
};

