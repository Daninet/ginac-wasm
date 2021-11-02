import { getBinding, PrintOptions } from './binding';
import * as GiNaCFactory from './comm';

export const initGiNaC = async (wasmPath: string) => {
  if (!wasmPath || typeof wasmPath !== 'string') {
    throw new Error('wasmPath needs to be a valid path to the .wasm binary');
  }
  const binding = await getBinding(wasmPath);

  const GiNaC = (arr: GiNaCFactory.GiNaCObject[] | GiNaCFactory.GiNaCObject, opts: PrintOptions = { string: true }) => {
    const lst = Array.isArray(arr) ? arr : [arr];
    if (lst.length === 0) return [];
    return binding.print(lst, opts);
  };

  return GiNaC;
};

export const getFactory = () => {
  return GiNaCFactory;
};
