import { useEffect, useState } from 'react';
import Gnnn from '../../build/release/ginac';

export const App = () => {
  const [input, setInput] = useState('');
  useEffect(() => {
    const init = async () => {
      const GiNaC = await Gnnn();
      console.log(GiNaC);
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
