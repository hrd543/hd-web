import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
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
      // This is used to type custom elements with jsx
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
)
