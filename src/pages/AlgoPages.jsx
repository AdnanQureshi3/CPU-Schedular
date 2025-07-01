import { useLocation } from 'react-router-dom';

function AlgoPage() {
  const { state } = useLocation();
  const algoName = state?.name;

  return (
    <div>
      <h1>Selected Algorithm: {algoName}</h1>
    </div>
  );
}

export default AlgoPage;
