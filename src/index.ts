import { getBinding } from './binding';
import * as GiNaCFactory from './comm';

export const initGiNaC = async (wasmPath: string) => {
  if (!wasmPath || typeof wasmPath !== 'string') {
    throw new Error('wasmPath needs to be a valid path to the .wasm binary');
  }
  const binding = await getBinding(wasmPath);

  const GiNaC = {
    print: (arr: string[] | string | GiNaCFactory.GiNaCObject[] | GiNaCFactory.GiNaCObject) => {
      const lst = Array.isArray(arr) ? arr : [arr];
      if (lst.length === 0) return [];
      if (typeof lst[0] === 'string') {
        return binding.parsePrint(lst as string[]);
      }
      return binding.print(lst as GiNaCFactory.GiNaCObject[]);
    },
    archive: (arr: GiNaCFactory.GiNaCObject[] | GiNaCFactory.GiNaCObject) => {
      return binding.archive(Array.isArray(arr) ? arr : [arr]);
    },
  };

  // binding.setDigits(precision);

  return GiNaC;
};

export const getFactory = () => {
  return GiNaCFactory;
};
