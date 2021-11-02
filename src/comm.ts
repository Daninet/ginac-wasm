export * from './functions';
const utf8encoder = new TextEncoder();

export type GiNaCObject = {
  toBuf(buf: Uint8Array, index: number): number;
  toString(): string;
};

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

export const lst = (items: GiNaCObject[]) => {
  if (!Array.isArray(items)) {
    throw new Error('Items needs to be an array!');
  }

  return {
    toBuf(buf: Uint8Array, index: number) {
      const originalIndex = index;
      buf[index++] = 0x04;

      for (let i = 0; i < items.length; i++) {
        index += items[i].toBuf(buf, index);
      }

      buf[index++] = 0x00;

      return index - originalIndex;
    },

    toString() {
      return `{${items.map(item => item.toString()).join(', ')}}`;
    },
  };
};

export const matrix = (rows: number, columns: number, items: GiNaCObject[]) => {
  if (!Number.isInteger(rows) || !Number.isInteger(columns)) {
    throw new Error('Matrix rows and columns number needs to be integers');
  }

  if (rows < 1 || columns < 1) {
    throw new Error('Invalid matrix size');
  }

  if (!Array.isArray(items)) {
    throw new Error('Matrix list needs to be an array!');
  }

  if (rows * columns !== items.length) {
    throw new Error('Invalid item list size');
  }

  return {
    toBuf(buf: Uint8Array, index: number) {
      const originalIndex = index;
      buf[index++] = 0x05;
      index += numeric(rows.toString()).toBuf(buf, index);
      index += numeric(columns.toString()).toBuf(buf, index);
      index += lst(items).toBuf(buf, index);
      buf[index++] = 0x00;
      return index - originalIndex;
    },

    toString() {
      const chunked = [...Array(Math.ceil(items.length / columns))].map((_, i) =>
        items.slice(i * columns, i * columns + columns),
      );
      const rows = chunked.map(r => `[${r.map(i => i.toString()).join(', ')}]`);
      return `[${rows.join(', ')}]`;
    },
  };
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
    type: 'const',
    toBuf(buf: Uint8Array, index: number) {
      buf[index++] = 0xa2;
      return 1;
    },

    toString() {
      return 'G';
    },
  };
};

export const I = () => {
  return {
    toBuf(buf: Uint8Array, index: number) {
      buf[index++] = 0xa3;
      return 1;
    },

    toString() {
      return 'I';
    },
  };
};

export const ref = (refIndex: number) => {
  return {
    toBuf(buf: Uint8Array, index: number) {
      const originalIndex = index;
      buf[index++] = 0x06;
      index += numeric(refIndex.toString()).toBuf(buf, index);
      return index - originalIndex;
    },

    toString() {
      return 'ref()';
    },
  };
};

export const ex = (ex: GiNaCObject) => {
  return {
    toBuf(buf: Uint8Array, index: number) {
      const originalIndex = index;
      buf[index++] = 0x01;
      index += ex.toBuf(buf, index);
      return index - originalIndex;
    },

    toString() {
      return `ex(${ex.toString()})`;
    },
  };
};

export const parse = (name: string) => {
  return {
    toBuf(buf: Uint8Array, index: number) {
      const originalIndex = index;
      buf[index++] = 0x07;
      const str = utf8encoder.encode(name);
      buf.set(str, index);
      index += str.length;
      buf[index++] = 0;
      return index - originalIndex;
    },

    toString() {
      return `parse(${ex.toString()})`;
    },
  };
};
