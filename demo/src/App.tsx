import { useEffect } from 'react';
import { initGiNaC } from '../../dist/index';

export const App = () => {
  useEffect(() => {
    const init = async () => {
      const GiNaC = await initGiNaC();
      console.log(GiNaC);
    };
  }, []);

  return (
    <h1>GiNaC-WASM Web demo</h1>
  );
};
