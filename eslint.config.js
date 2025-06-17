// @ts-nocheck
import antfu from '@antfu/eslint-config'
// @ts-ignore
import tailwind from 'eslint-plugin-tailwindcss'
import nuxt from './.nuxt/eslint.config.mjs'

export default nuxt(
  antfu(
    {
      formatters: true,
    },
    ...tailwind.configs['flat/recommended'],
  ),

  {
    settings: {
      tailwindcss: {
        whitelist: [
          // '(bg|text|border|ring|shadow)\\-(primary|gray|cool)\\-(50|100|200|300|400|500|600|700|800|900|950)',
          // '(bg|text|border|ring|shadow)\\-primary',
          'c\\-.+', // 自定义的类
        ],
      },
    },
  },
)
