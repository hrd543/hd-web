import eslint from '@eslint/js'
import sort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'simple-import-sort': sort
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error'
    }
  },
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/package-lock.json',
      '**/playground'
    ]
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'import/order': 'off',
      'sort-imports': 'off'
    }
  }
)
