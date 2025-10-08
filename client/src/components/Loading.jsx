import Spinner from './Spinner';
export default function Loading({ text }) {
  return (
    <div className="loading-container">
      <Spinner />
      <p>{text}</p>
    </div>
  );
}
