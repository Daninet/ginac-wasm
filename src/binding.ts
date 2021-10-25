import GiNaCModule from '../build/release/ginac';
import { GiNaCObject } from './comm';

const utf8decoder = new TextDecoder();

const makeInstance = () => {
  const ginacGetBuffer = GiNaCModule.cwrap('ginac_get_buffer', 'uint32', []);
  const ginacSetDigits = GiNaCModule.cwrap('ginac_set_digits', null, ['uint32']);
  const ginacPrint = GiNaCModule.cwrap('ginac_print', null, []);

  const ptr = ginacGetBuffer();
  const iobuf = new Uint8Array(GiNaCModule.asm.memory.buffer).subarray(ptr, ptr + 65000);

  ginacSetDigits(10);

  const readResponseStr = () => {
    const strEnd = iobuf.indexOf(0);
    const str = utf8decoder.decode(iobuf.subarray(0, strEnd));
    return str;
  };

  return {
    setDigits: (digits: number) => ginacSetDigits(digits),
    print: (ex: GiNaCObject) => {
      ex.toBuf(iobuf, 0);
      console.log(iobuf);
      ginacPrint();
      return readResponseStr();
    },
  };
};

let instance: ReturnType<typeof makeInstance> = null;

const loadPromise = new Promise<void>((resolve) => {
  GiNaCModule.onRuntimeInitialized = () => {
    instance = makeInstance();
    resolve();
  };
});

export const getBinding = async () => {
  if (instance !== null) {
    return instance;
  }
  await loadPromise;
  return instance;
};
