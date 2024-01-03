function ErrorComponent ({ error}: { error: string })  {
  return <div className="mt-4 text-red-700">{error}</div>;
};

export default ErrorComponent;

