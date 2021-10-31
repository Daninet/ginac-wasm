const { initGiNaC, getFactory } = require('./dist/index.umd.min.js');

(async () => {
  const GiNaC = await initGiNaC('./dist/ginac.wasm');
  const g = getFactory();
  console.log(GiNaC.parsePrint(['1+2', '2+3']));

  console.log(
    GiNaC.print([
      g.matrix(2, 3, [g.numeric('1'), g.symbol('x'), g.numeric('3'), g.numeric('4'), g.numeric('5'), g.numeric('6')]),
      g.matrix(3, 2, [g.numeric('1'), g.symbol('x'), g.numeric('3'), g.numeric('4'), g.numeric('5'), g.numeric('6')]),
      g.sin(g.symbol('x')),
      g.cos(g.ref(2)),
      g.add(g.ref(2), g.ref(3)),
      g.evalf(g.div(g.numeric('2'), g.numeric('3'))),
      g.digits(50),
      g.evalf(g.div(g.numeric('2'), g.numeric('3'))),
    ]),
  );
})();
