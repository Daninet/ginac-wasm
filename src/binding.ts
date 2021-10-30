import GiNaCModule from '../binding/dist/ginac';
import { GiNaCObject } from './comm';

const utf8decoder = new TextDecoder();
const utf8encoder = new TextEncoder();

const makeInstance = (binding: any) => {
  const ptr = binding._ginac_get_buffer();
  const iobuf = binding.HEAPU8.subarray(ptr, ptr + 65000);

  binding._ginac_set_digits(10);

  const readResponseStr = () => {
    const strEnd = iobuf.indexOf(0);
    const str = utf8decoder.decode(iobuf.subarray(0, strEnd));
    return str;
  };

  return {
    setDigits: (digits: number) => binding._ginac_set_digits(digits),
    parsePrint: (input: string) => {
      const str = utf8encoder.encode(input);
      iobuf.set(str, 0);
      iobuf[str.length] = 0;
      binding._ginac_parse_print();
      return readResponseStr();
    },
    print: (ex: GiNaCObject) => {
      ex.toBuf(iobuf, 0);
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
