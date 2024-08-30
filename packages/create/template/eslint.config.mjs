import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['**/node_modules/', '**/build/', '**/package-lock.json']
  },
  {
    rules: {
      // This is used to type custom elements with jsx
      '@typescript-eslint/no-namespace': 'off'
    }
  }
)
