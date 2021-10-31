import wasmBinary from '../../../dist/ginac.wasm';
import { initGiNaC } from '../../../dist/index.esm.min.js';
import { parse } from './parser';

let GiNaC = null;

(async () => {
  GiNaC = await initGiNaC(wasmBinary);
  // console.log('g', GiNaC);
  postMessage('init');
})();

(self as any).onmessage = e => {
  // console.log('worker got message', e);
  const { lines } = e.data;
  let res = [];

  const prevValues: Record<string, number> = {};
  try {
    const asts = lines.map((line, index) => {
      const { id, expr } = parse(line, prevValues);
      if (id) {
        prevValues[id] = index;
      }
      return expr;
    });
    res = GiNaC.print(asts);
  } catch (err) {
    console.error(err);
    res = ['Error!'];
  }
  self.postMessage(res);
};
