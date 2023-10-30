import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { readFileSync } from 'node:fs';

// Use import.meta.url to make the path relative to the current source file instead of process.cwd()
const packageFile = readFileSync(new URL('./package.json', import.meta.url));
const pkg = JSON.parse(packageFile.toString());

const projectName = 'server';
const compiled = new Date().toUTCString().replace(/GMT/g, 'UTC');

const banner = [
  `/**`,
  ` * ${pkg.name}`,
  ` * @description ${pkg.description}`,
  ` * @author ${pkg.author}`,
  ` * @version ${pkg.version}`,
  ` * @license ${pkg.license}`,
  ` * @see ${pkg.homepage}`,
  ` * @generated ${compiled}`,
  ` */`,
].join('\n');

const external = Object.keys(pkg.dependencies);
external.push('node_modules');

export default {
  input: 'src/index.js',
  output: [
    {
      banner,
      name: pkg.name,
      file: `build/${projectName}.js`,
      format: 'es',
      exports: 'named',
    },
  ],
  external,
  plugins: [commonjs(), nodeResolve(), json()],
};
