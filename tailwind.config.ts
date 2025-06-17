import type { Config } from 'tailwindcss'

function arcoColors() {
  /**
   * ⬇️ themes 变量在 https://arco.design/vue/docs/token 的控制台执行下述代码获取 ⬇️
   * function colors(n) {
      const all = document.querySelectorAll(`#root > div > div.arco-vue-body.arco-vue-body-has-notice > main > article > div.article-content > div.arco-table:nth-child(${n}) > div > div > div > div.arco-scrollbar-container.arco-table-content.arco-table-content-scroll-x > table > tbody > tr`)
      const result = []
      all.forEach(i => {
          const value = i.querySelector('td:nth-child(3) > span > span').textContent
          result.push(value)
      })
      return result
    }
    [colors(3), colors(5), colors(7), colors(9), colors(11), colors(13), colors(15), colors(17), colors(19)]
   * ⬆️ themes 变量在 https://arco.design/vue/docs/token 的控制台执行上述代码获取 ⬆️
   */
  const themes = [
    [
      'rgb(var(--primary-6))',
      'rgb(var(--primary-5))',
      'rgb(var(--primary-7))',
      'rgb(var(--primary-4))',
      'rgb(var(--primary-3))',
      'rgb(var(--primary-2))',
      'rgb(var(--primary-1))',
    ],
    [
      'rgb(var(--success-7))',
      'rgb(var(--success-4))',
      'rgb(var(--success-3))',
      'rgb(var(--success-2))',
      'rgb(var(--success-1))',
    ],
    [
      'rgb(var(--warning-6))',
      'rgb(var(--warning-5))',
      'rgb(var(--warning-7))',
      'rgb(var(--warning-4))',
      'rgb(var(--warning-3))',
      'rgb(var(--warning-2))',
      'rgb(var(--warning-1))',
    ],
    [
      'rgb(var(--danger-6))',
      'rgb(var(--danger-5))',
      'rgb(var(--danger-7))',
      'rgb(var(--danger-4))',
      'rgb(var(--danger-2))',
      'rgb(var(--danger-3))',
      'rgb(var(--danger-1))',
    ],
    [
      'rgb(var(--link-6))',
      'rgb(var(--link-5))',
      'rgb(var(--link-7))',
      'rgb(var(--link-4))',
      'rgb(var(--link-3))',
      'rgb(var(--link-2))',
      'rgb(var(--link-1))',
    ],
    [
      'var(--color-border-1)',
      'var(--color-border-2)',
      'var(--color-border-3)',
      'var(--color-border-4)',
    ],
    [
      'var(--color-fill-1)',
      'var(--color-fill-2)',
      'var(--color-fill-3)',
      'var(--color-fill-4)',
    ],
    [
      'var(--color-text-1)',
      'var(--color-text-2)',
      'var(--color-text-3)',
      'var(--color-text-4)',
    ],
    [
      'var(--color-bg-1)',
      'var(--color-bg-2)',
      'var(--color-bg-3)',
      'var(--color-bg-4)',
      'var(--color-bg-5)',
      'var(--color-bg-white)',
    ],
  ]

  const result: Record<string, Record<number, string>> = {}

  for (const i of themes) {
    for (const ii of i) {
      const iiSplit = ii.split('-')
      const name = iiSplit[iiSplit.length - 2]!
      if (!(name in result)) {
        result[name] = {}
      }
      const k = Number.parseInt(iiSplit[iiSplit.length - 1]!)
      if (!Number.isNaN(k)) {
        result[name]![k] = ii
      }
    }
  }

  return result
}

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: arcoColors(),
    },
  },
  // content: {
  //   files: [
  //     // all directories and extensions will correspond to your Nuxt config
  //     '{srcDir}/components/**/*.{vue,js,jsx,mjs,ts,tsx}',
  //     '{srcDir}/layouts/**/*.{vue,js,jsx,mjs,ts,tsx}',
  //     '{srcDir}/pages/**/*.{vue,js,jsx,mjs,ts,tsx}',
  //     '{srcDir}/plugins/**/*.{js,ts,mjs}',
  //     '{srcDir}/composables/**/*.{js,ts,mjs}',
  //     '{srcDir}/utils/**/*.{js,ts,mjs}',
  //     '{srcDir}/{A,a}pp.{vue,js,jsx,mjs,ts,tsx}',
  //     '{srcDir}/{E,e}rror.{vue,js,jsx,mjs,ts,tsx}',
  //     '{srcDir}/app.config.{js,ts,mjs}',
  //     '{srcDir}/app/spa-loading-template.html',
  //   ],
  // },
  // plugins: [],
}
