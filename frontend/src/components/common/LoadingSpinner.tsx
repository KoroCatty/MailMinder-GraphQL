import ClipLoader from 'react-spinners/ClipLoader'

type LoadingSpinnerProps = {
  loading: boolean;
  center?: React.CSSProperties;
};

const LoadingSpinner = ({ loading, center }: LoadingSpinnerProps) => {
  // css
  const override = {
    display: 'block',
    margin: '0 auto',
    ...center,
  };
  return (
    <ClipLoader 
    color="#2c3895" 
    size={80} 
    loading={loading}
    cssOverride={override}
    aria-label="Loading..."
    />
  )
}

export default LoadingSpinner