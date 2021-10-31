import { useEffect, useState } from 'react';
import { Calculator } from './Calculator';
import { initSolver } from './parser/solver';

export const App = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await initSolver();
      setReady(true);
    })();
  }, []);

  return (
    <div style={{ margin: 30 }}>
      <h2>GiNaC-WASM demo</h2>
      {ready ? <Calculator /> : 'Loading...'}
    </div>
  );
};
