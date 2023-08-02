import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { defineConfig } from 'rollup';

const minifyConfig = {
  mangle: {
    reserved: ['captureError', 'init'],
  },
  output: {
    comments: false,
  },
};

/**
 * 获取发布到npm包rollup配置
 * @param {string} name 包名称
 * @param {string} prefix 前缀
 * @returns
 */
export const getRollupPkgConfig = (name = 'Monitor', prefix = 'dist') =>
  defineConfig([
    {
      input: 'dist/es/index',
      output: [
        // 浏览器配置
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
      output: { name, format: 'umd', file: `${prefix}/index.umd.min.js`, exports: 'named' },
      plugins: [resolve({ browser: true }), commonjs(), terser(minifyConfig)],
    },
    {
      input: 'dist/es/index',
      output: [{ format: 'esm', file: `${prefix}/index.esm.min.js` }],
      plugins: [resolve(), terser(minifyConfig)],
    },
  ]);
