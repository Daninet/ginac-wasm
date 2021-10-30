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
    <div style={{ textAlign: 'center', maxWidth: 350, margin: '0 auto' }}>
      <h2>GiNaC-WASM demo</h2>
      {ready ? <Calculator /> : 'Loading...'}
    </div>
  );
};
