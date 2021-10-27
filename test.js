const { initGiNaC } = require("./dist/index.umd.min.js");

(async () => {
  console.log(initGiNaC);
  const GiNaC = await initGiNaC("./dist/ginac.wasm");
  // console.log(GiNaC);
  console.log(
    // GiNaC(g => g.evalf(g.Ex(g.Pi()))).print()
    GiNaC((g) => g.Pi()).print()
  );
  // console.log(
  //   GiNaC(g => g.diff(g.Ex(g.Num('2')).mul(g.Ex(g.Sym('x')).pow(g.Num('2'))), 'x', 1)).print()
  // );
})();
