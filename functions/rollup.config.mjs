import ts from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import cjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default {
	input: './src/index.ts',
	output: {
		file: './lib/index.js',
		format: 'cjs'
	},
	plugins: [resolve(), cjs(), json(), ts(), terser()]
};
