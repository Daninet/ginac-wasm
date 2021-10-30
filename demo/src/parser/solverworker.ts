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
  const { internal, str } = e.data;
  let res = '';

  try {
    if (internal) {
      res = GiNaC().parsePrint(str);
    } else {
      res = GiNaC(g => {
        const ast = parse(g, str);
        console.log(`input="${str} parsed="${ast.toString()}"`);
        return ast;
      }, 1000).print();
    }
  } catch (err) {
    console.error(err);
    res = 'Error!';
  }
  self.postMessage(res);
};
