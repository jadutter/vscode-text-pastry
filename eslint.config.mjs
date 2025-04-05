import js from '@eslint/js';
import eslint from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import tslint from '@typescript-eslint/eslint-plugin-tslint';
import { defineConfig } from 'eslint/config';
import etcPluginEslint from 'eslint-plugin-etc';
import eslintPluginJsonc from 'eslint-plugin-jsonc';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

const srcFiles = ['src/**/*.{js,mjs,cjs,ts}'];
const testFiles = ['test/**/*.{js,mjs,cjs,ts}'];
const outFiles = ['out/**/*.{js,mjs,cjs,ts}'];
const jsonFiles = ['**/*.json'];
const mdFiles = ['**/*.md'];

const config = defineConfig([
    {
        name: 'globalIgnore',
        ignores: outFiles
    },
    { ...eslint.configs.recommended, ignores: [...jsonFiles, ...mdFiles] },
    {
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    },
    {
        files: ['*.ts'],
        plugins: {
            '@typescript-eslint/tslint': tslint
        },
        parserOptions: {
            project: 'tsconfig.json'
        },
        rules: {
            '@typescript-eslint/tslint/config': [
                'warn',
                {
                    lintFile: 'tslint.json' // path to tslint.json of your project
                    // "rules": {
                    //   // tslint rules (will be used if `lintFile` is not specified)
                    // },
                }
            ]
        }
    },
    {
        name: 'src',
        files: [...srcFiles, ...testFiles, 'eslint.config.mjs'],
        ignores: [...jsonFiles, ...mdFiles],
        plugins: {
            js,
            'typescript-eslint': tsEslint,
            'simple-import-sort': simpleImportSort,
            etc: etcPluginEslint
        },
        extends: ['typescript-eslint/recommended', 'js/recommended'],
        linterOptions: {
            reportUnusedDisableDirectives: 'error'
        },
        rules: {
            camelcase: 'error',
            'no-console': 'error',
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            eqeqeq: 'error',
            '@typescript-eslint/array-type': 'error',
            'etc/no-commented-out-code': 'error',
            'max-len': [
                'error',
                {
                    code: 120,
                    tabWidth: 4,
                    ignoreTrailingComments: true,
                    ignoreComments: true
                }
            ]
        }
    },
    {
        name: 'types',
        files: ['**/*.d.ts'],
        rules: { 'no-unused-vars': 'off' }
    },
    {
        name: 'test > mocha',
        files: ['test/**/*.test.ts'],
        languageOptions: {
            globals: {
                ...globals.mocha
            }
        }
    },
    {
        name: 'extension',
        files: ['src/extension.ts'],
        languageOptions: {
            globals: { ...globals.vscode }
        },
        rules: { 'no-console': 'off' }
    },
    {
        files: jsonFiles,
        ignores: ['package-lock.json', 'package.json'],
        plugins: {
            json: json,
            jsonc: eslintPluginJsonc
        },
        extends: ['jsonc/flat/recommended-with-json5'],
        rules: {
            'jsonc/sort-keys': 'error'
        }
    },
    {
        files: mdFiles,
        plugins: {
            markdown
        },
        language: 'markdown/commonmark',
        extends: ['markdown/recommended']
    }
]);

export default config;
