const { initGiNaC, getFactory } = require('./dist/index.umd.min.js');

const g = getFactory();
const JSONTestObjects = [
  g.numeric('123'),
  g.symbol('xy'),
  g.Pi(),
  g.add(g.numeric('1'), g.numeric('2')),
  g.sub(g.numeric('1'), g.numeric('2')),
  g.mul(g.numeric('2'), g.numeric('3')),
  g.div(g.numeric('2'), g.numeric('3')),
  g.add(g.numeric('2'), g.I()),
  g.sub(g.numeric('2'), g.mul(g.numeric('3'), g.I())),
  g.lessThan(g.numeric('2'), g.symbol('x')),
  g.matrix(2, 2, [g.numeric('3'), g.numeric('4'), g.numeric('3'), g.numeric('4')]),
  g.lst([g.numeric('3'), g.numeric('4'), g.numeric('3'), g.numeric('4')]),
  g.mul(g.matrix(1, 2, [g.numeric('3'), g.numeric('4')]), g.matrix(1, 2, [g.numeric('3'), g.numeric('4')])),
  g.pow(g.symbol('x'), g.numeric('3')),
  g.series(g.atan(g.symbol('x')), g.symbol('x'), g.numeric('5')),
];

(async () => {
  const GiNaC = await initGiNaC('./dist/ginac.wasm');
  // console.log(GiNaC.print(['1+2', '2+3']));
  console.dir(
    GiNaC(JSONTestObjects, {
      string: true,
      // latex: true,
      // tree: true,
      json: true,
    }),
    { depth: null },
  );

  // console.log(
  //   GiNaC([
  //     g.matrix(2, 3, [g.numeric('1'), g.symbol('x'), g.numeric('3'), g.numeric('4'), g.numeric('5'), g.numeric('6')]),
  //     g.matrix(3, 2, [g.numeric('1'), g.symbol('x'), g.numeric('3'), g.numeric('4'), g.numeric('5'), g.numeric('6')]),
  //     g.sin(g.symbol('x')),
  //     g.cos(g.ref(2)),
  //     g.add(g.ref(2), g.ref(3)),
  //     g.evalf(g.div(g.numeric('2'), g.numeric('3'))),
  //     g.digits(50),
  //     g.evalf(g.div(g.numeric('2'), g.numeric('3'))),
  //   ]),
  // );
})();
