// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    files: ['**/*.vue', '**/*.ts', '**/*.tsx'],
    rules: {
      // Отключаем проблемные правила парсера для TypeScript в Vue
      '@typescript-eslint/no-unused-vars': 'warn',
      'vue/multi-word-component-names': 'off',
      // '@typescript-eslint/ban-ts-comment': 'off',
    },
  }
)
