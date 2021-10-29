import { GiNaCObject, numeric, symbol } from './comm';

const utf8encoder = new TextEncoder();

const BaseFn = (name: string, params: GiNaCObject[]) => {
  if (params.some(p => p === undefined)) {
    throw new Error(`Missing parameters at ${name}`);
  }

  return {
    toBuf(buf: Uint8Array, index: number) {
      const originalIndex = index;
      buf[index++] = 0x03;
      const str = utf8encoder.encode(name);
      buf.set(str, index);
      index += str.length;
      buf[index++] = 0;
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        index += param.toBuf(buf, index);
      }
      buf[index++] = 0;
      return index - originalIndex;
    },
    toString() {
      return `${name}(${params.map(p => p.toString()).join(', ')})`;
    },
  };
};

export const _eval = (ex: GiNaCObject) => {
  return BaseFn('eval', [ex]);
};

export const evalf = (ex: GiNaCObject) => {
  return BaseFn('evalf', [ex]);
};

export const diff = (ex1: GiNaCObject, symbolName: string, nth = 1) => {
  if (nth < 1) throw new Error('Nth should be greater than 0');
  if (nth > 255) throw new Error('Nth should be less than 256');
  return BaseFn('diff', [ex1, symbol(symbolName), numeric(nth.toString())]);
};

export const lsolve = (ex: GiNaCObject, symbolName: string) => {
  return BaseFn('lsolve', [ex, symbol(symbolName)]);
};

export const factor = (ex: GiNaCObject, all = false) => {
  if (all) return BaseFn('factorall', [ex]);
  return BaseFn('factor', [ex]);
};

export const factorial = (ex: GiNaCObject) => {
  return BaseFn('factorial', [ex]);
};

export const degree = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('degree', [ex1, ex2]);
};

export const ldegree = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('ldegree', [ex1, ex2]);
};

export const coeff = (ex1: GiNaCObject, ex2: GiNaCObject, n: number) => {
  return BaseFn('coeff', [ex1, ex2, numeric(n.toString())]);
};

export const quo = (ex1: GiNaCObject, ex2: GiNaCObject, ex3: GiNaCObject) => {
  return BaseFn('quo', [ex1, ex2, ex3]);
};

export const rem = (ex1: GiNaCObject, ex2: GiNaCObject, ex3: GiNaCObject) => {
  return BaseFn('rem', [ex1, ex2, ex3]);
};

export const prem = (ex1: GiNaCObject, ex2: GiNaCObject, ex3: GiNaCObject) => {
  return BaseFn('prem', [ex1, ex2, ex3]);
};

export const divide = (ex1: GiNaCObject, ex2: GiNaCObject, ex3: GiNaCObject) => {
  return BaseFn('divide', [ex1, ex2, ex3]);
};

export const unit = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('unit', [ex1, ex2]);
};

export const content = (ex1: GiNaCObject) => {
  return BaseFn('content', [ex1]);
};

export const primpart = (ex1: GiNaCObject, ex2: GiNaCObject, ex3?: GiNaCObject) => {
  if (ex3) return BaseFn('primpart3', [ex1, ex2, ex3]);
  return BaseFn('primpart', [ex1, ex2]);
};

export const unitcontprim = (ex1: GiNaCObject, ex2: GiNaCObject, ex3: GiNaCObject, ex4: GiNaCObject) => {
  return BaseFn('unitcontprim', [ex1, ex2, ex3, ex4]);
};

export const gcd = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('gcd', [ex1, ex2]);
};

export const lcm = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('lcm', [ex1, ex2]);
};

export const resultant = (ex1: GiNaCObject, ex2: GiNaCObject, ex3: GiNaCObject) => {
  return BaseFn('resultant', [ex1, ex2, ex3]);
};

export const normal = (ex: GiNaCObject) => {
  return BaseFn('normal', [ex]);
};

export const numer = (ex: GiNaCObject) => {
  return BaseFn('numer', [ex]);
};

export const denom = (ex: GiNaCObject) => {
  return BaseFn('denom', [ex]);
};

export const numer_denom = (ex: GiNaCObject) => {
  return BaseFn('numer_denom', [ex]);
};

export const series = (ex: GiNaCObject, r: GiNaCObject, order: number) => {
  return BaseFn('series', [ex, r, numeric(order.toString())]);
};

export const abs = (ex: GiNaCObject) => {
  return BaseFn('abs', [ex]);
};

export const sqrt = (ex: GiNaCObject) => {
  return BaseFn('sqrt', [ex]);
};

export const sin = (ex: GiNaCObject) => {
  return BaseFn('sin', [ex]);
};

export const cos = (ex: GiNaCObject) => {
  return BaseFn('cos', [ex]);
};

export const tan = (ex: GiNaCObject) => {
  return BaseFn('tan', [ex]);
};

export const exp = (ex: GiNaCObject) => {
  return BaseFn('exp', [ex]);
};

export const log = (ex: GiNaCObject) => {
  return BaseFn('log', [ex]);
};

export const asin = (ex: GiNaCObject) => {
  return BaseFn('asin', [ex]);
};

export const acos = (ex: GiNaCObject) => {
  return BaseFn('acos', [ex]);
};

export const atan = (ex: GiNaCObject) => {
  return BaseFn('atan', [ex]);
};

export const atan2 = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('atan2', [ex1, ex2]);
};

export const sinh = (ex: GiNaCObject) => {
  return BaseFn('sinh', [ex]);
};

export const cosh = (ex: GiNaCObject) => {
  return BaseFn('cosh', [ex]);
};

export const tanh = (ex: GiNaCObject) => {
  return BaseFn('tanh', [ex]);
};

export const asinh = (ex: GiNaCObject) => {
  return BaseFn('asinh', [ex]);
};

export const acosh = (ex: GiNaCObject) => {
  return BaseFn('acosh', [ex]);
};

export const atanh = (ex: GiNaCObject) => {
  return BaseFn('atanh', [ex]);
};
