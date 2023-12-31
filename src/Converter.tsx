import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface Crypto {
  id: string;
  name: string;
}

interface ConversionResult {
  convertedAmount: number;
  exchangeRate: number;
}

interface FormData {
  sourceCrypto: string;
  amount: string;
  targetCurrency: string;
}
const COINGECKO_API = process.env.REACT_APP_COINGECKO_API;
const Currency_API = process.env.REACT_APP_CURRENCY_API;
function Converter() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [cryptoList, setCryptoList] = useState<Crypto[]>([]);
  const [currencyList, setcurrencyList] = useState<string[]>(['usd']);
  const [result, setResult] = useState<string>('');
  const [error, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Crypto-Converter'; 
    fetchCryptoList();
    fetchAllCurrencies()
  }, []);

  const fetchAllCurrencies = async () => {
    try {
      const response = await axios.get(`${COINGECKO_API}/simple/supported_vs_currencies`);
      setcurrencyList(response.data);
    } catch (error) {
      setErrorMsg('Error');
    }
  };
  const fetchCryptoList = async () => {
    try {
      const response = await axios.get<Crypto[]>(`${Currency_API}/currencies/getall`);
      setCryptoList(response.data);
    } catch (error) {
      setErrorMsg('Error fetching crypto list. Please try again.');
    }
  };

  const handleConvert = async (data: FormData) => {
    try {

      setIsLoading(true);
      let payload: object = {
        sourceCrypto: data.sourceCrypto,
        amount: data.amount,
        targetCurrency: data.targetCurrency
      }
      const response = await axios.post<ConversionResult>(
        `${Currency_API}/currency/convert`, payload
      );
      const responseData :any= response.data;
      setResult(responseData.convertedAmount);
      setIsLoading(false);
    } catch (error) {
      setErrorMsg('Error occurred during conversion. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-6 text-center">Crypto Converter</h1>

        <form onSubmit={handleSubmit(handleConvert)} className="space-y-4">
          <div>
            <label className="block mb-1">Source Cryptocurrency:</label>
            <select
              {...register('sourceCrypto', { required: 'Please select a source cryptocurrency.' })}
              className={`w-full p-2 border rounded ${errors.sourceCrypto ? 'border-red-500' : ''}`}
            >
              <option value="">Select Cryptocurrency</option>
              {cryptoList.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name}
                </option>
              ))}
            </select>
            {errors.sourceCrypto && <div className="text-red-500">{errors.sourceCrypto.message}</div>}
          </div>

          <div>
            <label className="block mb-1">Amount:</label>
            <input
              type="number"
              {...register('amount', {
                required: 'Please enter a valid amount.',
                pattern: { value: /^\d{1,7}$/, message: 'Invalid amount. Must be a number with up to 7 digits.' },
              })}
              className={`w-full p-2 border rounded ${errors.amount ? 'border-red-500' : ''}`}
            />
            {errors.amount && <div className="text-red-500">{errors.amount.message}</div>}
          </div>

          <div>
            <label className="block mb-1">Target Currency:</label>
            <select
              {...register('targetCurrency')}
              className="w-full p-2 border rounded"
            >
              {currencyList.map((currency: any) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className={`w-full p-2 rounded transition-colors ${(isLoading || Object.keys(errors).length > 0)
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-blue-500 hover:bg-blue-700 text-white'
              }`}
            disabled={isLoading || Object.keys(errors).length > 0}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 mr-3 border-t-2 border-blue-500 border-solid rounded-full"></div>
              </div>
            ) : (
              'Convert'
            )}
          </button>
        </form>

        {result && 
        <div className="mt-4">
        <span className="text-gray-500 ">Converted Amount: </span>
       <span className="text-green-700 font-extrabold">{result}</span>
        </div>
        }
        {error && <div className="mt-4 text-red-700">{error}</div>}
      </div>
    </div>
  );
};

export default Converter;
