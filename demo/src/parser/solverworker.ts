import wasmBinary from '../../../dist/ginac.wasm';
import { initGiNaC } from '../../../dist/index.esm.min.js';
import { parse } from './parser';

let GiNaC = null;

(async () => {
  GiNaC = await initGiNaC(wasmBinary);
  // console.log('g', GiNaC);
  postMessage('init');
})();

const parseLines = (lines: string[]) => {
  const prevValues: Record<string, number> = {};
  const asts = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const parseResult = parse(line, prevValues);
    if (parseResult.error) {
      throw new Error(`Cannot parse line "${line}"`);
    }
    const { id, expr } = parseResult.ast;
    if (id) {
      prevValues[id] = i;
    }
    asts.push(expr);
  }
  return asts;
};

(self as any).onmessage = e => {
  // console.log('worker got message', e);
  const { lines } = e.data;
  let res = [];

  try {
    const asts = parseLines(lines);
    res = GiNaC.print(asts);
  } catch (err) {
    console.error(err);
    res = err.message ?? 'Evaluation error';
  }
  self.postMessage(res);
};
