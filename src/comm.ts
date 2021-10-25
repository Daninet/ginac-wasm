const utf8encoder = new TextEncoder();

interface GiNaCExType extends ReturnType<typeof ex> {};
export type GiNaCObject = {
  toBuf(buf: Uint8Array, index: number): number;
  toString(): string;
} | GiNaCExType;

export const numeric = (num: string) => {
  return {
    toBuf(buf: Uint8Array, index: number) {
      const originalIndex = index;
      buf[index++] = 0x02;
      const str = utf8encoder.encode(num);
      buf.set(str, index);
      index += str.length;
      buf[index++] = 0;
      return index - originalIndex;
    },
    toString() {
      return num;
    }
  };
}

const BaseFn = (name: string, params: GiNaCObject[]) => {
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
      return `${this.name}(${this.params.map(p => p.toString()).join(', ')})`;
    }
  };
}

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

export const symbol = (name: string) => {
  return {
    toBuf(buf: Uint8Array, index: number) {
      const originalIndex = index;
      buf[index++] = 0x04;
      const str = utf8encoder.encode(name);
      buf.set(str, index);
      index += str.length;
      buf[index++] = 0;
      return index - originalIndex;
    },
  
    toString() {
      return name;
    }
  };
}

export const relation = (lValue: GiNaCObject) => {
  const makeResult = (op: string, opVal: number, rValue: GiNaCObject) => {
    return {
      toBuf(buf: Uint8Array, index: number) {
        const originalIndex = index;
        index += lValue.toBuf(buf, index);
        buf[index++] = opVal;
        index += rValue.toBuf(buf, index);
    
        return index - originalIndex;
      },
    
      toString() {
        return `${lValue.toString()}${op}${rValue.toString()}`;
      }
    }
  };

  return {
    eq(rValue: GiNaCObject) {
      return makeResult('==', 0x10, rValue);
    },
  
    neq(rValue: GiNaCObject) {
      return makeResult('!=', 0x11, rValue);
    },
  
    lessThan(rValue: GiNaCObject) {
      return makeResult('<', 0x12, rValue);
    },
  
    lessThanOrEqualTo(rValue: GiNaCObject) {
      return makeResult('<=', 0x13, rValue);
    },
  
    greaterThan(rValue: GiNaCObject) {
      return makeResult('>', 0x14, rValue);
    },
  
    greaterThanOrEqualTo(rValue: GiNaCObject) {
      return makeResult('>=', 0x15, rValue);
    },
  };
}

export const ex = (lValue: GiNaCObject) => {
  const arr: GiNaCObject[] = [lValue];
  const op: string[] = [];

  const res = {
    add(val: GiNaCObject) {
      arr.push(val);
      op.push('+');
      return res;
    },
  
    sub(val: GiNaCObject) {
      arr.push(val);
      op.push('-');
      return res;
    },
  
    mul(val: GiNaCObject) {
      arr.push(val);
      op.push('*');
      return res;
    },
  
    div(val: GiNaCObject) {
      arr.push(val);
      op.push('/');
      return res;
    },
  
    pow(val: GiNaCObject) {
      arr.push(val);
      op.push('^');
      return res;
    },

    // TODO
    and(val: GiNaCObject) {
      arr.push(val);
      op.push('&');
      return res;
    },

    or(val: GiNaCObject) {
      arr.push(val);
      op.push('|');
      return res;
    },

    xor(val: GiNaCObject) {
      arr.push(val);
      op.push('r');
      return res;
    },

    nand(val: GiNaCObject) {
      arr.push(val);
      op.push('a');
      return res;
    },

    nor(val: GiNaCObject) {
      arr.push(val);
      op.push('o');
      return res;
    },

    shiftLeft(val: GiNaCObject) {
      arr.push(val);
      op.push('<');
      return res;
    },

    shiftRight(val: GiNaCObject) {
      arr.push(val);
      op.push('>');
      return res;
    },

    toBuf(buf: Uint8Array, index: number) {
      const originalIndex = index;
      buf[index++] = 0x01;
      index += arr[0].toBuf(buf, index);
  
      for (let i = 0; i < op.length; i++) {
        buf[index++] = op[i].charCodeAt(0);
        index += arr[i + 1].toBuf(buf, index);
      }
  
      buf[index++] = 0x00;
  
      return index - originalIndex;
    },
  
    toString() {
      const parts = op.map((op, index) => {
        return `${op}${arr[index + 1].toString()}`;
      });
      return `(${arr[0].toString()}${parts.join('')})`;
    }
  };

  return res;
}

export const Pi = () => {
  return {
    toBuf(buf: Uint8Array, index: number) {
      buf[index++] = 0xA0;
      return 1;
    },
  
    toString() {
      return 'π';
    }
  };
}

export const Euler = () => {
  return {
    toBuf(buf: Uint8Array, index: number) {
      buf[index++] = 0xA1;
      return 1;
    },
  
    toString() {
      return 'γ';
    }
  };
}

export const Catalan = () => {
  return {
    toBuf(buf: Uint8Array, index: number) {
      buf[index++] = 0xA2;
      return 1;
    },
  
    toString() {
      return 'G';
    }
  };
}
