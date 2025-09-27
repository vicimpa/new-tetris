import { defineConfig } from 'vite';
import swc from "rollup-plugin-swc3";
import paths from "vite-tsconfig-paths";

export default defineConfig({
	root: './src',
	base: './',
	publicDir: '../public',
	build: {
		emptyOutDir: true,
		outDir: '../dist',
	},
	server: {
		host: true,
		port: 3344,
	},
	plugins: [
		paths({ root: '..' }),
		swc(),
	],
	esbuild: false,
});