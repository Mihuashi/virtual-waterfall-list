import { isVue3 } from 'vue-demi';
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default defineConfig([
  {
    input: './src/index.ts',
    output: {
      file: `dist/${isVue3 ? '3' : '2'}/index.js`,
      format: 'cjs',
    },
    external: ['vue'],
    plugins: [
      typescript({ sourceMap: false }),
      nodeResolve(),
      terser({ format: { comments: false } }),
    ]
  },
  {
    input: './src/vueInstall.js',
    output: {
      file: `dist/${isVue3 ? '3' : '2'}/vue.js`,
      format: 'cjs',
      exports: 'default',
    },
    external: ['vue'],
    plugins: [
      typescript({ sourceMap: false }),
      nodeResolve(),
      terser({ format: { comments: false } }),
    ]
  }
]);
