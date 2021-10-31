import { getBinding } from './binding';
import * as GiNaCFactory from './comm';

export const initGiNaC = async (wasmPath: string) => {
  const binding = await getBinding(wasmPath);

  const GiNaC = {
    parsePrint: (arr: string[] | string) => {
      return binding.parsePrint(Array.isArray(arr) ? arr : [arr]);
    },
    print: (arr: GiNaCFactory.GiNaCObject[] | GiNaCFactory.GiNaCObject) => {
      return binding.print(Array.isArray(arr) ? arr : [arr]);
    },
  };

  // binding.setDigits(precision);

  return GiNaC;
};

export const getFactory = () => {
  return GiNaCFactory;
};
