import Loading from "../Loading";

const LoadingErrorComponent = ({ loading, error, children }) => {
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return children;
};

export default LoadingErrorComponent;
