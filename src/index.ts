import { getBinding } from "./binding";
import * as GiNaCFactory from "./comm";

export const initGiNaC = async (wasmPath: string) => {
  const binding = await getBinding(wasmPath);

  const GiNaC = (
    fn: (c?: typeof GiNaCFactory) => GiNaCFactory.GiNaCObject,
    precision = 10
  ) => {
    binding.setDigits(precision);

    return {
      parsePrint: (str: string) => binding.parsePrint(str),
      print: () => binding.print(fn(GiNaCFactory)),
      debug: () => fn(GiNaCFactory).toString(),
    };
  };

  return GiNaC;
};

// export default initGiNaC;
