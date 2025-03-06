import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['projects/**/*', '**/node_modules/', '**/dist/', '**/build/', 'src/index.html'],
  },
  ...compat.extends('plugin:prettier/recommended'),
  ...compat
    .extends(
      'plugin:@angular-eslint/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    )
    .map((config) => ({
      ...config,
      files: ['**/*.ts'],
    })),
  {
    files: ['**/*.ts'],

    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: ['tsconfig.json'],
      },
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],

      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],

      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
    },
  },
  ...compat
    .extends('plugin:@angular-eslint/template/recommended')
    .map((config) => ({
      ...config,
      files: ['**/*.html'],
    })),
  {
    files: ['**/*.html'],

    rules: {
      'max-len': [
        'error',
        {
          code: 140,
        },
      ],

      'prettier/prettier': 'error',
    },
  },
];
