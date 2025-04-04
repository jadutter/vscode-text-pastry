import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

const srcFiles = ['src/**/*.{js,mjs,cjs,ts}'];
const testFiles = ['test/**/*.{js,mjs,cjs,ts}'];
const outFiles = ['out/**/*'];

export default defineConfig([
	{ ignores: outFiles },
	{ files: [...srcFiles, ...testFiles] },
	{ files: [...srcFiles, ...testFiles], languageOptions: { globals: globals.browser } },
	{ files: [...srcFiles, ...testFiles], plugins: { js }, extends: ['js/recommended'] },
	tseslint.configs.recommended
]);
