const { initGiNaC } = require('./dist/index.umd.min.js');

(async () => {
  console.log(initGiNaC);
  const GiNaC = await initGiNaC('./dist/ginac.wasm');
  // console.log(GiNaC);
  // console.log(
  //   // GiNaC(g => g.evalf(g.Ex(g.Pi()))).print()
  //   GiNaC((g) => g.Pi()).print()
  // );
  // console.log(GiNaC((g) => g.diff(g.sin(g.symbol("x")))).print());
  // console.log(GiNaC((g) => g).parsePrint("1+1"));
  console.log(GiNaC(g => g.numeric('1')).print());
  console.log(GiNaC(g => g.diff(g.sin(g.symbol('x')), g.symbol('x'))).print());
  console.log(
    GiNaC(g =>
      g.matrix(2, 3, [g.numeric('1'), g.numeric('2'), g.numeric('3'), g.numeric('4'), g.numeric('5'), g.numeric('6')]),
    ).print(),
  );
  // console.log(GiNaC(g => g.diff(g.Ex(g.Num('2')).mul(g.Ex(g.Sym('x')).pow(g.Num('2'))), 'x', 1)).print());
})();
