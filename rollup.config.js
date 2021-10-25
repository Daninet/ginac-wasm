import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import license from 'rollup-plugin-license';

const TERSER_CONFIG = {
  output: {
    comments: false,
  },
};

const LICENSE_CONFIG = {
  banner: {
    commentStyle: 'ignored',
    content: `ginac-wasm (https://www.npmjs.com/package/ginac-wasm)
    (c) Dani Biro
    @license GPLv2`,
  },
};

const MAIN_BUNDLE_CONFIG = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.umd.js',
      name: 'ginac',
      format: 'umd',
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
    },
  ],
  plugins: [
    typescript(),
    license(LICENSE_CONFIG),
  ],
};

const MINIFIED_MAIN_BUNDLE_CONFIG = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.umd.min.js',
      name: 'ginac',
      format: 'umd',
    },
    {
      file: 'dist/index.esm.min.js',
      format: 'es',
    },
  ],
  plugins: [
    typescript(),
    terser(TERSER_CONFIG),
    license(LICENSE_CONFIG),
  ],
};

export default [
  MAIN_BUNDLE_CONFIG,
  MINIFIED_MAIN_BUNDLE_CONFIG,
];
