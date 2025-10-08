import ClipLoader from 'react-spinners/ClipLoader';

const override = {
  display: 'block',
  margin: '100px auto',
};

const Spinner = ({ loading, size = 150 }) => {
  return (
    <ClipLoader
      color="#3b82f6"
      loading={loading}
      cssOverride={override}
      size={size}
      aria-label="Loading Spinner"
    />
  );
};
export default Spinner;
