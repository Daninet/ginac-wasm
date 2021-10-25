import { getBinding } from './binding';
import * as GiNaCFactory from './comm';

export const initGiNaC = async () => {
  const binding = await getBinding();

  const GiNaC = (fn: (c: typeof GiNaCFactory) => GiNaCFactory.GiNaCObject, precision = 10) => {
    binding.setDigits(precision);
    const ex = fn(GiNaCFactory);

    return {
      print: () => binding.print(ex),
      debug: () => ex.toString(),
    };
  };

  return GiNaC;
};
