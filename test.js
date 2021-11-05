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
  // console.log(GiNaC(g.mul(g.numeric('2'), g.pow(g.symbol('x'), g.numeric('2')))));
  // console.log(GiNaC(g.series(g.atan(g.symbol('x')), g.symbol('x'), g.numeric('5'))));
  console.log(
    GiNaC([g.equal(g.symbol('x'), g.numeric('2')), g.sin(g.add(g.symbol('x'), g.mul(g.numeric('2'), g.symbol('y'))))], {
      string: true,
    }),
  );

  // console.log(
  //   GiNaC(
  //     [
  //       g.unarchive(
  //         new Uint8Array([
  //           71, 65, 82, 67, 3, 12, 99, 108, 97, 115, 115, 0, 114, 101, 108, 97, 116, 105, 111, 110, 97, 108, 0, 115,
  //           121, 109, 98, 111, 108, 0, 110, 97, 109, 101, 0, 120, 0, 108, 104, 0, 110, 117, 109, 101, 114, 105, 99, 0,
  //           110, 117, 109, 98, 101, 114, 0, 50, 0, 114, 104, 0, 111, 112, 0, 101, 120, 0, 1, 11, 2, 3, 2, 2, 2, 26, 4,
  //           2, 2, 6, 58, 8, 4, 2, 1, 43, 0, 75, 1, 81, 0, 0, 0, 0,
  //         ]),
  //       ),
  //     ],
  //     {
  //       string: true,
  //     },
  //   ),
  // );
  // console.dir(
  //   GiNaC(JSONTestObjects, {
  //     string: true,
  //     // latex: true,
  //     // tree: true,
  //     json: true,
  //   }),
  //   { depth: null },
  // );

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
