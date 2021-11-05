import wasmBinary from '../../../dist/ginac.wasm';
/// <reference path="../../../dist/types/index.d.ts" />
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
      throw new Error(`Cannot parse line "${line}": ${parseResult.error.message}`);
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
    console.time('parsing');
    const asts = parseLines(lines);
    console.timeEnd('parsing');
    console.time('evaluating');
    res = GiNaC(asts, { string: true, input: true, json: true, latex: true, tree: true });
    console.timeEnd('evaluating');
  } catch (err) {
    console.error(err);
    res = err.message ?? 'Evaluation error';
  }
  self.postMessage(res);
};
