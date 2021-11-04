import { GiNaCObject, numeric } from './comm';

const utf8encoder = new TextEncoder();

const BaseFn = (name: string, params: GiNaCObject[]): GiNaCObject => {
  if (params.some(p => p === undefined)) {
    throw new Error(`Missing parameters at ${name}`);
  }

  return {
    toBuf(buf: Uint8Array, index: number) {
      const originalIndex = index;
      buf[index++] = 0x20 + params.length;
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

export const diff = (ex1: GiNaCObject, symbolName: GiNaCObject, nth?: GiNaCObject) => {
  return BaseFn('diff', [ex1, symbolName, nth ?? numeric('1')]);
};

export const lsolve = (ex: GiNaCObject, symbolName: GiNaCObject) => {
  return BaseFn('lsolve', [ex, symbolName]);
};

export const factor = (ex: GiNaCObject, all = false) => {
  if (all) return BaseFn('factorall', [ex]);
  return BaseFn('factor', [ex]);
};

export const factorial = (ex: GiNaCObject) => {
  return BaseFn('factorial', [ex]);
};

export const doublefactorial = (ex: GiNaCObject) => {
  return BaseFn('doublefactorial', [ex]);
};

export const degree = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('degree', [ex1, ex2]);
};

export const ldegree = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('ldegree', [ex1, ex2]);
};

export const coeff = (ex1: GiNaCObject, ex2: GiNaCObject, ex3: GiNaCObject) => {
  return BaseFn('coeff', [ex1, ex2, ex3]);
};

export const mod = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('mod', [ex1, ex2]);
};

export const smod = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('smod', [ex1, ex2]);
};

export const irem = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('irem', [ex1, ex2]);
};

export const iquo = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('iquo', [ex1, ex2]);
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

export const bernoulli = (ex1: GiNaCObject) => {
  return BaseFn('bernoulli', [ex1]);
};

export const fibonacci = (ex1: GiNaCObject) => {
  return BaseFn('fibonacci', [ex1]);
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

export const series = (ex: GiNaCObject, r: GiNaCObject, order: GiNaCObject) => {
  return BaseFn('series', [ex, r, order] as GiNaCObject[]);
};

export const floor = (ex: GiNaCObject) => {
  return BaseFn('floor', [ex]);
};

export const ceiling = (ex: GiNaCObject) => {
  return BaseFn('ceiling', [ex]);
};

export const round = (ex: GiNaCObject) => {
  return BaseFn('round', [ex]);
};

export const abs = (ex: GiNaCObject) => {
  return BaseFn('abs', [ex]);
};

export const sqrt = (ex: GiNaCObject) => {
  return BaseFn('sqrt', [ex]);
};

export const isqrt = (ex: GiNaCObject) => {
  return BaseFn('isqrt', [ex]);
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

export const step = (ex: GiNaCObject) => {
  return BaseFn('step', [ex]);
};

export const csgn = (ex: GiNaCObject) => {
  return BaseFn('csgn', [ex]);
};

export const conjugate = (ex: GiNaCObject) => {
  return BaseFn('conjugate', [ex]);
};

export const real = (ex: GiNaCObject) => {
  return BaseFn('real', [ex]);
};

export const real_part = (ex: GiNaCObject) => {
  return BaseFn('real_part', [ex]);
};

export const imag = (ex: GiNaCObject) => {
  return BaseFn('imag', [ex]);
};

export const imag_part = (ex: GiNaCObject) => {
  return BaseFn('imag_part', [ex]);
};

export const eta = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('eta', [ex1, ex2]);
};

export const Li2 = (ex: GiNaCObject) => {
  return BaseFn('Li2', [ex]);
};

export const Li = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('Li', [ex1, ex2]);
};

export const G = (ex1: GiNaCObject, ex2: GiNaCObject, ex3?: GiNaCObject) => {
  if (ex3) return BaseFn('G3', [ex1, ex2, ex3]);
  return BaseFn('G', [ex1, ex2]);
};

export const S = (ex1: GiNaCObject, ex2: GiNaCObject, ex3: GiNaCObject) => {
  return BaseFn('S', [ex1, ex2, ex3]);
};

export const H = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('H', [ex1, ex2]);
};

export const zeta = (ex1: GiNaCObject, ex2?: GiNaCObject) => {
  if (ex2) return BaseFn('zeta2', [ex1, ex2]);
  return BaseFn('zeta', [ex1]);
};

export const zetaderiv = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('zetaderiv', [ex1, ex2]);
};

export const iterated_integral = (ex1: GiNaCObject, ex2: GiNaCObject, ex3?: GiNaCObject) => {
  if (ex3) return BaseFn('iterated_integral3', [ex1, ex2, ex3]);
  return BaseFn('iterated_integral', [ex1, ex2]);
};

export const tgamma = (ex: GiNaCObject) => {
  return BaseFn('tgamma', [ex]);
};

export const lgamma = (ex: GiNaCObject) => {
  return BaseFn('lgamma', [ex]);
};

export const beta = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('beta', [ex1, ex2]);
};

export const psi = (ex1: GiNaCObject, ex2?: GiNaCObject) => {
  if (ex2) return BaseFn('psi2', [ex1, ex2]);
  return BaseFn('psi', [ex1]);
};

export const EllipticK = (ex: GiNaCObject) => {
  return BaseFn('EllipticK', [ex]);
};

export const EllipticE = (ex: GiNaCObject) => {
  return BaseFn('EllipticE', [ex]);
};

export const binomial = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('binomial', [ex1, ex2]);
};

export const Order = (ex: GiNaCObject) => {
  return BaseFn('Order', [ex]);
};

export const pow = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('pow', [ex1, ex2]);
};

export const determinant = (ex: GiNaCObject) => {
  return BaseFn('determinant', [ex]);
};

export const evalm = (ex: GiNaCObject) => {
  return BaseFn('evalm', [ex]);
};

export const charpoly = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('charpoly', [ex1, ex2]);
};

export const expand = (ex: GiNaCObject) => {
  return BaseFn('expand', [ex]);
};

export const collect = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('collect', [ex1, ex2]);
};

export const fsolve = (ex: GiNaCObject, symbolName: GiNaCObject, min: GiNaCObject, max: GiNaCObject) => {
  return BaseFn('fsolve', [ex, symbolName, min, max]);
};

export const subs = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('subs', [ex1, ex2]);
};

export const diag_matrix = (lst: GiNaCObject) => {
  return BaseFn('diag_matrix', [lst]);
};

export const unit_matrix = (rows: GiNaCObject, cols: GiNaCObject) => {
  return BaseFn('unit_matrix', [rows, cols]);
};

export const symbolic_matrix = () => {
  throw new Error('Not implemented!');
};

export const sub_matrix = (
  m: GiNaCObject,
  rowOffset: GiNaCObject,
  rows: GiNaCObject,
  colOffset: GiNaCObject,
  cols: GiNaCObject,
) => {
  return BaseFn('sub_matrix', [m, rowOffset, rows, colOffset, cols]);
};

export const reduced_matrix = (m: GiNaCObject, row: GiNaCObject, column: GiNaCObject) => {
  return BaseFn('reduced_matrix', [m, row, column]);
};

export const transpose = (ex: GiNaCObject) => {
  return BaseFn('transpose', [ex]);
};

export const indexed = () => {
  throw new Error('Not implemented!');
};

export const simplify_indexed = () => {
  throw new Error('Not implemented!');
};

export const trace = (ex: GiNaCObject) => {
  return BaseFn('trace', [ex]);
};

export const rank = (ex: GiNaCObject) => {
  return BaseFn('rank', [ex]);
};

export const series_to_poly = (ex: GiNaCObject) => {
  return BaseFn('series_to_poly', [ex]);
};

export const inverse = (ex: GiNaCObject) => {
  return BaseFn('inverse', [ex]);
};

export const add = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('add', [ex1, ex2]);
};

export const sub = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('sub', [ex1, ex2]);
};

export const mul = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('mul', [ex1, ex2]);
};

export const div = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('div', [ex1, ex2]);
};

export const not = (ex1: GiNaCObject) => {
  return BaseFn('not', [ex1]);
};

export const and = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('and', [ex1, ex2]);
};

export const or = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('or', [ex1, ex2]);
};

export const xor = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('xor', [ex1, ex2]);
};

export const nand = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('nand', [ex1, ex2]);
};

export const nor = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('nor', [ex1, ex2]);
};

export const shiftleft = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('shiftleft', [ex1, ex2]);
};

export const shiftright = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('shiftright', [ex1, ex2]);
};

export const equal = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('equal', [ex1, ex2]);
};

export const notEqual = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('notEqual', [ex1, ex2]);
};

export const lessThan = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('lessThan', [ex1, ex2]);
};

export const lessThanOrEqualTo = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('lessThanOrEqualTo', [ex1, ex2]);
};

export const greaterThan = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('greaterThan', [ex1, ex2]);
};

export const greaterThanOrEqualTo = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('greaterThanOrEqualTo', [ex1, ex2]);
};

export const integral = (ex1: GiNaCObject, ex2: GiNaCObject, ex3: GiNaCObject, ex4: GiNaCObject) => {
  return BaseFn('integral', [ex1, ex2, ex3, ex4]);
};

export const eval_integ = (ex1: GiNaCObject) => {
  return BaseFn('eval_integ', [ex1]);
};

export const digits = (digits: GiNaCObject) => {
  return BaseFn('digits', [digits]);
};

export const relative_integration_error = (ex: GiNaCObject) => {
  return BaseFn('relative_integration_error', [ex]);
};

export const max_integration_level = (level: GiNaCObject) => {
  return BaseFn('max_integration_level', [numeric(level.toString())]);
};

export const adaptivesimpson = (
  ex1: GiNaCObject,
  ex2: GiNaCObject,
  ex3: GiNaCObject,
  ex4: GiNaCObject,
  ex5: GiNaCObject,
) => {
  return BaseFn('adaptivesimpson', [ex1, ex2, ex3, ex4, ex5]);
};

export const has = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('has', [ex1, ex2]);
};

export const find = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('find', [ex1, ex2]);
};

export const at = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('at', [ex1, ex2]);
};

export const sort = (ex: GiNaCObject) => {
  return BaseFn('sort', [ex]);
};

export const unique = (ex: GiNaCObject) => {
  return BaseFn('unique', [ex]);
};

export const is_cinteger = (ex: GiNaCObject) => {
  return BaseFn('is_cinteger', [ex]);
};

export const is_crational = (ex: GiNaCObject) => {
  return BaseFn('is_crational', [ex]);
};

export const is_even = (ex: GiNaCObject) => {
  return BaseFn('is_even', [ex]);
};

export const is_integer = (ex: GiNaCObject) => {
  return BaseFn('is_integer', [ex]);
};

export const is_positive = (ex: GiNaCObject) => {
  return BaseFn('is_positive', [ex]);
};

export const is_negative = (ex: GiNaCObject) => {
  return BaseFn('is_negative', [ex]);
};

export const is_nonneg_integer = (ex: GiNaCObject) => {
  return BaseFn('is_nonneg_integer', [ex]);
};

export const is_odd = (ex: GiNaCObject) => {
  return BaseFn('is_odd', [ex]);
};

export const is_pos_integer = (ex: GiNaCObject) => {
  return BaseFn('is_pos_integer', [ex]);
};

export const is_prime = (ex: GiNaCObject) => {
  return BaseFn('is_prime', [ex]);
};

export const is_rational = (ex: GiNaCObject) => {
  return BaseFn('is_rational', [ex]);
};

export const is_real = (ex: GiNaCObject) => {
  return BaseFn('is_real', [ex]);
};

export const is_zero = (ex: GiNaCObject) => {
  return BaseFn('is_zero', [ex]);
};

export const solve = (ex1: GiNaCObject, ex2: GiNaCObject, ex3: GiNaCObject) => {
  return BaseFn('solve', [ex1, ex2, ex3]);
};

export const match = (ex1: GiNaCObject, ex2: GiNaCObject) => {
  return BaseFn('match', [ex1, ex2]);
};

export const collect_common_factors = (ex: GiNaCObject) => {
  return BaseFn('collect_common_factors', [ex]);
};
