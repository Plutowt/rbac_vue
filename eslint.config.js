// @ts-nocheck
import antfu from '@antfu/eslint-config'
// @ts-ignore
import tailwind from 'eslint-plugin-better-tailwindcss'
import { globalIgnores } from 'eslint/config'
import nuxt from './.nuxt/eslint.config.mjs'

export default nuxt(
  antfu(
    {
      formatters: true,
    },

    // ...tailwind.configs['flat/recommended'],
    {
      rules: {
        '@typescript-eslint/no-redeclare': 'error',
      },
    },
  ),

  // tailwind.rules,
  {
    plugins: {
      'better-tailwindcss': tailwind,
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'app/assets/css/main.css',
      },
    },
    rules: {
      // enable all recommended rules to report a warning
      ...tailwind.configs['recommended-warn'].rules,
      // enable all recommended rules to report an error
      ...tailwind.configs['recommended-error'].rules,

      // or configure rules individually
      'better-tailwindcss/enforce-consistent-line-wrapping': ['warn', { printWidth: 100 }],
    },
  },

  globalIgnores([
    'app/api/v1_1/**/*',
    'public/**/*',
  ]),
)
