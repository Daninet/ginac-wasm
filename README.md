# GiNaC-WASM
WebAssembly bindings for the [GiNaC computer algebra system](https://www.ginac.de/)

Demo frontend: https://daninet.github.io/ginac-wasm

## Usage

```js
const { initGiNaC, getFactory: g } = require('ginac-wasm');

(async () => {
  const GiNaC = await initGiNaC('ginac-wasm/dist/ginac.wasm');
  const g = getFactory();

  console.log(
    GiNaC([
      // 2 * 3 = 6
      g.mul(g.numeric('2'), g.numeric('3')),
      // x + 2x = 3x
      g.add(g.symbol('x'), g.mul(g.numeric('2'), g.symbol('x'))),
      // (2*sin(x))' = 2*cos(x)
      g.diff(g.mul(g.numeric('2'), g.sin(g.symbol('x'))), g.symbol('x')),
      // internal parser of GiNaC
      g.parse('x^3 + 3*x + 1') 
    ]),
  );

  console.log(
    GiNaC([
      g.numeric('2'),
      g.numeric('3'),
      // reference first and second items from the array => 2*3 = 6
      g.mul(g.ref(0), g.ref(1))
    ]),
  );

  // besides the string output format,
  // it can also generate traversable json structures
  console.dir(
    GiNaC([
      // 2*sin(x)
      g.mul(g.numeric('2'), g.sin(g.symbol('x'))),
    ], { json: true }),
    { depth: null }
  );
})();

```

For more details, see the [source code](https://github.com/Daninet/ginac-wasm/tree/master/demo) of the demo frontend app.
