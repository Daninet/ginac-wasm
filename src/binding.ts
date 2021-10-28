import GiNaCModule from "../binding/build/release/ginac";
// console.log("m", GiNaCModule);
import { GiNaCObject } from "./comm";

const utf8decoder = new TextDecoder();
const utf8encoder = new TextEncoder();

const makeInstance = (binding: any) => {
  const ginacGetBuffer = binding._ginac_get_buffer; // binding.cwrap('ginac_get_buffer', 'uint32', []);
  const ginacSetDigits = binding._ginac_set_digits; // binding.cwrap('ginac_set_digits', null, ['uint32']);
  const ginacPrint = binding._ginac_print; // binding.cwrap('ginac_print', null, []);
  const ginacParsePrint = binding._ginac_parse_print; // binding.cwrap('ginac_print', null, []);

  const ptr = ginacGetBuffer();
  const iobuf = binding.HEAPU8.subarray(ptr, ptr + 65000);

  ginacSetDigits(10);

  const readResponseStr = () => {
    const strEnd = iobuf.indexOf(0);
    const str = utf8decoder.decode(iobuf.subarray(0, strEnd));
    return str;
  };

  return {
    setDigits: (digits: number) => ginacSetDigits(digits),
    parsePrint: (input: string) => {
      const str = utf8encoder.encode(input);
      iobuf.set(str, 0);
      iobuf[str.length] = 0;
      ginacParsePrint();
      return readResponseStr();
    },
    print: (ex: GiNaCObject) => {
      ex.toBuf(iobuf, 0);
      console.log(iobuf);
      ginacPrint();
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
      console.log("locating", path);
      return wasmPath;
    },
  });
  instance = makeInstance(binding);
  return instance;
};
