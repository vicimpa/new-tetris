import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react-swc";
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
		react({ tsDecorators: true, plugins: [] })
	],
	esbuild: false,
});