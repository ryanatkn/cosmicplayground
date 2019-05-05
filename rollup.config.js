import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import {terser} from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';

const dev = process.env.NODE_ENV !== 'production';

export default {
  input: 'src/main.js',
  output: {
    file: 'static/bundle.js',
    format: 'iife',
    name: 'app',
    sourcemap: true,
  },
  plugins: [
    svelte({
      include: 'src/components/**/*.svelte',
      dev: !dev,
      css: css => {
        css.write('static/main.css', !dev);
      },
    }),
    resolve(),
    commonjs(),
    ...(dev ? [serve({contentBase: 'static', port: 3000})] : [terser()]),
  ],
};
