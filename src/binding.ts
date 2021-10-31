import GiNaCModule from '../binding/dist/ginac';
import { GiNaCObject } from './comm';

const utf8decoder = new TextDecoder();
const utf8encoder = new TextEncoder();

const makeInstance = (binding: any) => {
  const ptr = binding._ginac_get_buffer();
  const iobuf = binding.HEAPU8.subarray(ptr, ptr + 65536) as Uint8Array;
  const ioview = new DataView(iobuf.buffer, iobuf.byteOffset, iobuf.byteLength);

  const readResponseStr = () => {
    const res = [];
    let read = 0;
    while (true) {
      const strSize = ioview.getUint32(read, true);
      if (strSize === 0) break;
      read += 4;
      const str = utf8decoder.decode(iobuf.subarray(read, read + strSize));
      read += strSize;
      res.push(str);
    }
    return res;
  };

  return {
    parsePrint: (inputs: string[]) => {
      let written = 0;
      inputs.forEach(str => {
        const buf = utf8encoder.encode(str);
        iobuf.set(buf, written);
        iobuf[buf.length + written] = 0;
        written += buf.length + 1;
      });
      binding._ginac_parse_print();
      return readResponseStr();
    },
    print: (exs: GiNaCObject[]) => {
      let written = 0;
      exs.forEach(ex => {
        written += ex.toBuf(iobuf, written);
      });
      iobuf[written] = 0;
      binding._ginac_print();
      return readResponseStr();
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
