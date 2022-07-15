import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default defineConfig([
  {
    input: './src/index.ts',
    output: [
      {
        file: 'dist/cjs/index.js',
        format: 'cjs',
      },
      {
        file: 'dist/esm/index.js',
        format: 'esm',
      }
    ],
    external: ['vue', 'vue-demi'],
    plugins: [
      typescript({ sourceMap: false }),
      nodeResolve(),
      terser({ format: { comments: false } }),
    ]
  },
  {
    input: './src/vueInstall.js',
    output: [
      {
        file: `dist/cjs/vue.js`,
        format: 'cjs',
        exports: 'default',
      },
      {
        file: 'dist/esm/vue.js',
        format: 'esm',
      },
    ],
    external: ['vue', 'vue-demi'],
    plugins: [
      typescript({ sourceMap: false }),
      nodeResolve(),
      terser({ format: { comments: false } }),
    ]
  }
]);
