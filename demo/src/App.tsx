import { useEffect, useState } from 'react';
import wasmBinary from '../../dist/ginac.wasm';
import { initGiNaC } from '../../dist/index.esm.min.js';

export const App = () => {
  const [input, setInput] = useState('');
  useEffect(() => {
    const init = async () => {
      const GiNaC = await initGiNaC(wasmBinary);
      console.log(GiNaC(g => g.Pi()).print());
    };
    init();
  }, []);

  return (
    <>
      <h1>GiNaC-WASM Web demo</h1>
      <input type="text" value={input} onChange={e => setInput(e.target.value)} />
    </>
  );
};
