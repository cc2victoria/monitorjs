import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { defineConfig } from 'rollup';

const minifyConfig = {
  mangle: true,
  compress: true,
  output: {
    comments: false,
  },
};

/**
 * 获取依赖包rollup配置
 * @param {string} name 包名称
 * @param {string} prefix 前缀
 * @returns
 */
export const getRollupDepConfig = (name, prefix = 'dist') =>
  defineConfig([
    {
      input: 'dist/es/index',
      output: [
        { format: 'cjs', file: `${prefix}/index.js`, exports: 'auto' },
        { name, format: 'umd', file: `${prefix}/index.umd.js` },
      ],
      plugins: [resolve(), commonjs(), terser(minifyConfig)],
    },
    {
      input: 'dist/es/index',
      output: [{ name, format: 'esm', file: `${prefix}/index.esm.js` }],
      plugins: [resolve(), terser(minifyConfig)],
    },
  ]);
