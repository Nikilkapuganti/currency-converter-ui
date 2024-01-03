import { useState } from 'react';
import ConverterForm from './ConverterForm';
import ConverterResult from './ConverterResult';
import ErrorComponent from './ConverterError';

function Converter() {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const handleResult = (conversionResult: any) => {
    setResult(conversionResult.convertedAmount);
    setError('');
  };
  const handleError = (errorMessage: any) => {
    setError(errorMessage);
    setResult(''); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-6 text-center">Crypto Converter</h1>
        <ConverterForm onResult={handleResult} onError={handleError}/>
        <ConverterResult result={result} />
        {error && <ErrorComponent error={error} />}
      </div>
    </div>
  );
}

export default Converter;

