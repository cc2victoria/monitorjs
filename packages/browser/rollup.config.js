import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import { defineConfig } from 'rollup'

const prefix = `dist`

const minifyConfig = {
  mangle: {
    reserved: ['captureError', 'init', 'Monitor'],
  },
  output: {
    comments: false,
  },
}

export default defineConfig([
  {
    input: 'dist/es/index',
    output: [
      { format: 'cjs', file: `${prefix}/index.js`, exports: 'named' },
      { name: 'Monitor', format: 'umd', file: `${prefix}/index.umd.js`, exports: 'named' },
      {
        name: 'window',
        format: 'iife',
        file: `${prefix}/index.iife.js`,
        extend: true,
      },
    ],
    plugins: [resolve({ browser: true }), commonjs(), terser(minifyConfig)],
  },
  {
    input: 'dist/es/index',
    output: [{ format: 'esm', file: `${prefix}/index.esm.js` }],
    plugins: [resolve(), terser(minifyConfig)],
  },
])
