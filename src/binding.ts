import GiNaCModule from '../binding/dist/ginac';
import { GiNaCObject } from './comm';

const utf8decoder = new TextDecoder();

export interface PrintOptions {
  string?: boolean;
  latex?: boolean;
  tree?: boolean;
  archive?: boolean;
  json?: boolean;
}

type ObjectType =
  | 'symbol'
  | 'constant'
  | 'numeric'
  | 'add'
  | 'mul'
  | 'ncmul'
  | 'power'
  | 'pseries'
  | 'function'
  | 'lst'
  | 'matrix'
  | 'relational'
  | 'indexed'
  | 'tensor'
  | 'idx'
  | 'varidx'
  | 'spinidx'
  | 'wildcard'
  | 'unknown';

type NumberSubtype = 'integer' | 'rational' | 'real' | 'cinteger' | 'crational';
type RelationOp = '==' | '!=' | '<' | '<=' | '>' | '>=';

export interface JSONObj {
  type: ObjectType;
  subtype?: NumberSubtype;
  name?: string;
  value?: string;
  cols?: number;
  rows?: number;
  op?: RelationOp;
  children?: JSONObj[];
}

export interface PrintOutput {
  string?: string;
  latex?: string;
  tree?: string;
  archive?: Uint8Array;
  json?: JSONObj;
  error?: string;
}

const makeInstance = (binding: any) => {
  const ptr = binding._ginac_get_buffer();
  const iobuf = binding.HEAPU8.subarray(ptr, ptr + 65536) as Uint8Array;
  const ioview = new DataView(iobuf.buffer, iobuf.byteOffset, iobuf.byteLength);

  const readResponseChunk = (pos: number) => {
    const strSize = ioview.getUint32(pos, true);
    if (strSize === 0) return null;
    pos += 4;
    const buf = iobuf.subarray(pos, pos + strSize);
    pos += strSize;
    return { pos, buf };
  };

  const readResponse = (pos: number, chunks: number) => {
    const buf: Uint8Array[] = [];
    for (let i = 0; i < chunks; i++) {
      const chunk = readResponseChunk(pos);
      if (chunk === null) return null;
      pos = chunk.pos;
      buf.push(chunk.buf);
    }
    return { pos, buf };
  };

  const readResponseList = (chunks: number) => {
    const list: Uint8Array[][] = [];
    let pos = 0;
    while (true) {
      const response = readResponse(pos, chunks);
      if (!response) break;
      pos = response.pos;
      list.push(response.buf);
    }
    return list;
  };

  const encodePrintOptions = (opts: PrintOptions) => {
    let res = 0;
    if (opts.string) res = res | (1 << 0);
    if (opts.latex) res = res | (1 << 1);
    if (opts.tree) res = res | (1 << 2);
    if (opts.archive) res = res | (1 << 3);
    if (opts.json) res = res | (1 << 4);
    return res;
  };

  const listToResObject = (arr: Uint8Array[], opts: PrintOptions) => {
    const res = {} as PrintOutput;
    let index = 0;
    if (opts.string) {
      res.string = utf8decoder.decode(arr[index++]);
    }
    if (opts.latex) {
      res.latex = utf8decoder.decode(arr[index++]);
    }
    if (opts.tree) {
      res.tree = utf8decoder.decode(arr[index++]);
    }
    if (opts.archive) {
      res.archive = arr[index++].slice();
    }
    if (opts.json) {
      const str = utf8decoder.decode(arr[index++]);
      try {
        res.json = JSON.parse(str);
      } catch (err) {
        res.json = null;
        throw new Error('Failed parsing: ' + str);
      }
    }
    return res;
  };

  const makeRead = (opts: PrintOptions) => {
    let chunks = 0;
    if (opts.string) chunks++;
    if (opts.latex) chunks++;
    if (opts.tree) chunks++;
    if (opts.archive) chunks++;
    if (opts.json) chunks++;
    const res = readResponseList(chunks);
    return res.map(ex => listToResObject(ex, opts));
  };

  return {
    print: (exs: GiNaCObject[], opts: PrintOptions) => {
      let written = 0;
      exs.forEach(ex => {
        written += ex.toBuf(iobuf, written);
      });
      iobuf[written] = 0;
      const optsInt = encodePrintOptions(opts);
      try {
        binding._ginac_print(optsInt);
        const res = makeRead(opts);
        return res;
      } catch (err) {
        binding._ginac_get_exception(err);
        const zeroPtr = iobuf.indexOf(0);
        if (zeroPtr === -1) throw new Error('Unknown exception');
        const errorStr = utf8decoder.decode(iobuf.subarray(0, zeroPtr));
        console.error(errorStr);
        return [{ error: `Error: ${errorStr}` }];
      }
    },
  };
};

let instance: ReturnType<typeof makeInstance> = null;

export const getBinding = async (wasmPath: string) => {
  if (instance !== null) {
    return instance;
  }
  const binding = await GiNaCModule({
    locateFile: function (path) {
      console.log('locating', path);
      return wasmPath;
    },
  });
  instance = makeInstance(binding);
  return instance;
};
