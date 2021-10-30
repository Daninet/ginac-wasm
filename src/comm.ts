export * from './functions';
const utf8encoder = new TextEncoder();

interface GiNaCExType extends ReturnType<typeof ex> {}
export type GiNaCObject =
  | {
      toBuf(buf: Uint8Array, index: number): number;
      toString(): string;
    }
  | GiNaCExType;

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
    },
  };
};

export const symbol = (name: string) => {
  return {
    toBuf(buf: Uint8Array, index: number) {
      const originalIndex = index;
      buf[index++] = 0x03;
      const str = utf8encoder.encode(name);
      buf.set(str, index);
      index += str.length;
      buf[index++] = 0;
      return index - originalIndex;
    },

    toString() {
      return name;
    },
  };
};

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
      },
    };
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
};

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
    not() {},

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
    },
  };

  return res;
};

export const Pi = () => {
  return {
    toBuf(buf: Uint8Array, index: number) {
      buf[index++] = 0xa0;
      return 1;
    },

    toString() {
      return 'π';
    },
  };
};

export const Euler = () => {
  return {
    toBuf(buf: Uint8Array, index: number) {
      buf[index++] = 0xa1;
      return 1;
    },

    toString() {
      return 'γ';
    },
  };
};

export const Catalan = () => {
  return {
    toBuf(buf: Uint8Array, index: number) {
      buf[index++] = 0xa2;
      return 1;
    },

    toString() {
      return 'G';
    },
  };
};
