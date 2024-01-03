import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { convertCurrency } from '../services/conversion';
import { fetchAllCurrencies, fetchCryptoList } from '../services/cryptoService';
import { FormData, Crypto,ConverterFormProps} from '../interfaces';



const ConverterForm: React.FC<ConverterFormProps> = ({ onResult ,onError}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [cryptoList, setCryptoList] = useState<Crypto[]>([]);
  const [currencyList, setCurrencyList] = useState<string[]>(['usd']); // Provide default value or fetch from an API

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cryptoListData = await fetchCryptoList();
        const currencyListData = await fetchAllCurrencies();

        setCryptoList(cryptoListData);
        setCurrencyList(currencyListData);
      } catch (error:any) {
        console.error('Error fetching data:', error.message);
        
        if (onError) {
          onError('Error fetching data. Please try again.');
        }
      }
    };

    fetchData();
  }, [onError]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      const payload: object = {
        sourceCrypto: data.sourceCrypto,
        amount: data.amount,
        targetCurrency: data.targetCurrency,
      };

      const conversionResult = await convertCurrency(payload);
      setIsLoading(false);
      onResult(conversionResult);
    } catch (error) {
      console.error('Error occurred during conversion. Please try again.');
      if (onError) {
        onError('Error fetching data. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
    </div>
  );
};

export default ConverterForm;
