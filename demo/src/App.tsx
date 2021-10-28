import { useEffect, useState } from 'react';
import wasmBinary from '../../dist/ginac.wasm';
import { initGiNaC } from '../../dist/index.esm.min.js';
import { Calculator } from './Calculator';

export const App = () => {
  const [ginac, setGinac] = useState();

  useEffect(() => {
    (async () => {
      const GiNaC = await initGiNaC(wasmBinary);
      setGinac(() => GiNaC);
    })();
  }, []);

  return (
    <div style={{ textAlign: 'center', maxWidth: 350, margin: '0 auto' }}>
      <h2>GiNaC-WASM demo</h2>
      {ginac ? <Calculator ginac={ginac} /> : 'Loading...'}
    </div>
  );
};
