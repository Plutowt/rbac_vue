import type { NuxtLinkProps } from 'nuxt/app'
import type { components } from '~/api/v1/types'
import '#app'

declare module '#app' {

  interface PageMeta {
    breadcrumbs?: () => (NuxtLinkLocaleProps & { label: string })[]
    permissions?: components['schemas']['PermissionCode'][]
    padding?: boolean
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
    // 无须指定任何特定前缀
      readonly NUXT_PUBLIC_API_V1_BASE: string
    }
  }

  type NuxtLinkLocaleProps = Omit<NuxtLinkProps, 'to'> & {
    to?: import('vue-router').RouteLocationNamedI18n
  }
  ////////////////////////////////////////////////////////////////
  // ref: https://flagicons.lipis.dev/ ⬇️
  // const isoList = []
  // document.querySelectorAll('#iso-flags div.col-6 div.flag').forEach(node => {
  //     const iso = node.querySelector('.flag-code').textContent
  //     const name = node.querySelector('.flag-country').title
  //     isoList.push({iso, name})
  // })
  // const ISO = isoList.map(i => `"${i.iso}"`).join('|')
  // ref: https://flagicons.lipis.dev/ ⬆️
  ////////////////////////////////////////////////////////////////
  type ISO3166_1_Alpha_2 = 'af' | 'ax' | 'al' | 'dz' | 'as' | 'ad' | 'ao' | 'ai' | 'aq' | 'ag' | 'ar' | 'am' | 'aw' | 'au' | 'at' | 'az' | 'bs' | 'bh' | 'bd' | 'bb' | 'by' | 'be' | 'bz' | 'bj' | 'bm' | 'bt' | 'bo' | 'bq' | 'ba' | 'bw' | 'bv' | 'br' | 'io' | 'bn' | 'bg' | 'bf' | 'bi' | 'cv' | 'kh' | 'cm' | 'ca' | 'ky' | 'cf' | 'td' | 'cl' | 'cn' | 'cx' | 'cc' | 'co' | 'km' | 'ck' | 'cr' | 'hr' | 'cu' | 'cw' | 'cy' | 'cz' | 'ci' | 'cd' | 'dk' | 'dj' | 'dm' | 'do' | 'ec' | 'eg' | 'sv' | 'gq' | 'er' | 'ee' | 'sz' | 'et' | 'fk' | 'fo' | 'fm' | 'fj' | 'fi' | 'fr' | 'gf' | 'pf' | 'tf' | 'ga' | 'gm' | 'ge' | 'de' | 'gh' | 'gi' | 'gr' | 'gl' | 'gd' | 'gp' | 'gu' | 'gt' | 'gg' | 'gn' | 'gw' | 'gy' | 'ht' | 'hm' | 'va' | 'hn' | 'hk' | 'hu' | 'is' | 'in' | 'id' | 'ir' | 'iq' | 'ie' | 'im' | 'il' | 'it' | 'jm' | 'jp' | 'je' | 'jo' | 'kz' | 'ke' | 'ki' | 'kw' | 'kg' | 'la' | 'lv' | 'lb' | 'ls' | 'lr' | 'ly' | 'li' | 'lt' | 'lu' | 'mo' | 'mg' | 'mw' | 'my' | 'mv' | 'ml' | 'mt' | 'mh' | 'mq' | 'mr' | 'mu' | 'yt' | 'mx' | 'md' | 'mc' | 'mn' | 'me' | 'ms' | 'ma' | 'mz' | 'mm' | 'na' | 'nr' | 'np' | 'nl' | 'nc' | 'nz' | 'ni' | 'ne' | 'ng' | 'nu' | 'nf' | 'kp' | 'mk' | 'mp' | 'no' | 'om' | 'pk' | 'pw' | 'pa' | 'pg' | 'py' | 'pe' | 'ph' | 'pn' | 'pl' | 'pt' | 'pr' | 'qa' | 'cg' | 'ro' | 'ru' | 'rw' | 're' | 'bl' | 'sh' | 'kn' | 'lc' | 'mf' | 'pm' | 'vc' | 'ws' | 'sm' | 'st' | 'sa' | 'sn' | 'rs' | 'sc' | 'sl' | 'sg' | 'sx' | 'sk' | 'si' | 'sb' | 'so' | 'za' | 'gs' | 'kr' | 'ss' | 'es' | 'lk' | 'ps' | 'sd' | 'sr' | 'sj' | 'se' | 'ch' | 'sy' | 'tw' | 'tj' | 'tz' | 'th' | 'tl' | 'tg' | 'tk' | 'to' | 'tt' | 'tn' | 'tm' | 'tc' | 'tv' | 'tr' | 'ug' | 'ua' | 'ae' | 'gb' | 'um' | 'us' | 'uy' | 'uz' | 'vu' | 've' | 'vn' | 'vg' | 'vi' | 'wf' | 'eh' | 'ye' | 'zm' | 'zw'

  type Y<T> = Exclude<T, undefined | null>
}

export {}
