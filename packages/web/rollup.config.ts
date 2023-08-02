import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { defineConfig } from 'rollup';

import pkg from './package.json';

// const prefix = `examples/dist/${pkg.version}`;
const prefix = `dist`;

const minifyConfig = {
  mangle: {
    reserved: ['captureError', 'init'],
  },
  output: {
    comments: false,
  },
};

export default defineConfig([
  {
    input: 'dist/es/index',
    output: [
      { format: 'cjs', file: `${prefix}/index.min.js`, exports: 'named' },
      {
        name: 'window',
        format: 'iife',
        file: `${prefix}/index.iife.min.js`,
        extend: true,
      },
    ],
    plugins: [resolve({ browser: true }), commonjs(), terser(minifyConfig)],
  },
  {
    input: 'dist/es/index',
    output: { name: 'Monitor', format: 'umd', file: `${prefix}/index.umd.min.js`, exports: 'named' },
    plugins: [resolve({ browser: true }), commonjs(), terser(minifyConfig)],
  },
  {
    input: 'dist/es/index',
    output: [{ format: 'esm', file: `${prefix}/index.esm.min.js` }],
    plugins: [resolve(), terser(minifyConfig)],
  },
]);
