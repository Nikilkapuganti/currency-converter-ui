const ConverterResult = ({ result }: { result: string }) => {
  return (
    <div>{result && <div className="mt-4">
    <span className="text-gray-500 ">Converted Amount: </span>
   <span className="text-green-700 font-extrabold">{result}</span>
    </div>}</div>
  );
}

export default ConverterResult;
