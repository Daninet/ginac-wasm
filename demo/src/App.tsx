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
      <h2>
        GiNaC-WASM demo &nbsp;
        <a href="https://github.com/Daninet/ginac-wasm" target="_blank" rel="noreferrer">
          <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/daninet/ginac-wasm?style=social" />
        </a>
      </h2>
      {ready ? <Calculator /> : 'Loading...'}
    </div>
  );
};
