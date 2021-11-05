export * from './functions';
const utf8encoder = new TextEncoder();

export type GiNaCObject = {
  toBuf(buf: Uint8Array, index: number): number;
  toString(): string;
};

function namedObjToBuf(code: number, name: string, buf: Uint8Array, index: number) {
  const originalIndex = index;
  buf[index++] = code;
  const str = utf8encoder.encode(name);
  buf.set(str, index);
  index += str.length;
  buf[index++] = 0;
  return index - originalIndex;
}

export const numeric = (value: string) => {
  return {
    value,

    toBuf(buf: Uint8Array, index: number) {
      return namedObjToBuf(0x02, value, buf, index);
    },

    toString() {
      return `numeric(${JSON.stringify(value)})`;
    },
  };
};

export const symbol = (name: string) => {
  return {
    name,

    toBuf(buf: Uint8Array, index: number) {
      return namedObjToBuf(0x03, name, buf, index);
    },

    toString() {
      return `symbol(${JSON.stringify(name)})`;
    },
  };
};

export const realsymbol = (name: string) => {
  return {
    name,

    toBuf(buf: Uint8Array, index: number) {
      return namedObjToBuf(0x09, name, buf, index);
    },

    toString() {
      return `realsymbol(${JSON.stringify(name)})`;
    },
  };
};

export const possymbol = (name: string) => {
  return {
    name,

    toBuf(buf: Uint8Array, index: number) {
      return namedObjToBuf(0x0a, name, buf, index);
    },

    toString() {
      return `possymbol(${JSON.stringify(name)})`;
    },
  };
};

export const idx = (value: GiNaCObject, dimension: GiNaCObject) => {
  return {
    value,
    dimension,

    toBuf(buf: Uint8Array, index: number) {
      const originalIndex = index;
      buf[index++] = 0x0b;
      index += value.toBuf(buf, index);
      index += dimension.toBuf(buf, index);
      return index - originalIndex;
    },

    toString() {
      return `idx(${value.toString()}, ${dimension.toString()})`;
    },
  };
};

export const wild = (id: number) => {
  return {
    value: id,

    toBuf(buf: Uint8Array, index: number) {
      const originalIndex = index;
      buf[index++] = 0x0c;
      const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
      view.setUint32(index, id, true);
      index += 4;
      return index - originalIndex;
    },

    toString() {
      return `wild(${id})`;
    },
  };
};

export const lst = (items: GiNaCObject[]) => {
  if (!Array.isArray(items)) {
    throw new Error('Items needs to be an array!');
  }

  return {
    items,

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
      return `lst(${items.map(item => item.toString()).join(', ')})`;
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
    rows,
    columns,
    items,

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
      return `matrix(${rows},${columns},${items.map(item => item.toString()).join(', ')})`;
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
      return 'Pi()';
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
      return 'Euler()';
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
      return 'Catalan()';
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
      return 'I()';
    },
  };
};

export const ref = (refIndex: number) => {
  return {
    value: refIndex,

    toBuf(buf: Uint8Array, index: number) {
      const originalIndex = index;
      buf[index++] = 0x06;
      index += numeric(refIndex.toString()).toBuf(buf, index);
      return index - originalIndex;
    },

    toString() {
      return `ref(${refIndex})`;
    },
  };
};

export const ex = (ex: GiNaCObject) => {
  return {
    value: ex,

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

export const parse = (value: string) => {
  return {
    value,

    toBuf(buf: Uint8Array, index: number) {
      return namedObjToBuf(0x07, value, buf, index);
    },

    toString() {
      return `parse(${value.toString()})`;
    },
  };
};

export const unarchive = (arr: Uint8Array) => {
  return {
    value: arr,

    toBuf(buf: Uint8Array, index: number) {
      const originalIndex = index;
      buf[index++] = 0x08;
      const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
      view.setUint32(index, arr.length, true);
      index += 4;
      buf.set(arr, index);
      index += arr.length;
      return index - originalIndex;
    },

    toString() {
      return `unarchive(${arr.toString()})`;
    },
  };
};
