import { initGiNaC } from '.';

(async () => {
  const GiNaC = await initGiNaC();
  console.log(
    // GiNaC(g => g.evalf(g.Ex(g.Pi()))).print()
    GiNaC(g => g.evalf(g.Pi())).print()
  );
  // console.log(
  //   GiNaC(g => g.diff(g.Ex(g.Num('2')).mul(g.Ex(g.Sym('x')).pow(g.Num('2'))), 'x', 1)).print()
  // );
})();
