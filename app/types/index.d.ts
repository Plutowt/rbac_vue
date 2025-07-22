import type { NuxtLinkProps } from 'nuxt/app'
import type { PermissionCode } from '~/api/v1_1'
import '#app'

declare module '#app' {
  interface PageMeta {
    anyPermissions?: PermissionCode[]
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

  type ISO3166_1_Alpha_2 = 'DO' | 'GY' | 'NO' | 'AE' | 'AZ' | 'EE' | 'GW' | 'AO' | 'BN' | 'IT' | 'VG' | 'CZ' | 'YT' | 'NI' | 'KP' | 'SY' | 'BH' | 'MQ' | 'AL' | 'KI' | 'MZ' | 'AS' | 'PH' | 'LT' | 'PN' | 'CO' | 'SC' | 'BO' | 'MT' | 'GR' | 'LC' | 'KZ' | 'BA' | 'FJ' | 'ME' | 'SA' | 'GS' | 'SZ' | 'KM' | 'MS' | 'NU' | 'VI' | 'GT' | 'PW' | 'GB' | 'DK' | 'DJ' | 'IL' | 'TM' | 'FM' | 'UA' | 'SB' | 'HN' | 'CX' | 'SJ' | 'TJ' | 'KY' | 'IQ' | 'UG' | 'RU' | 'ZW' | 'SD' | 'TC' | 'HT' | 'SE' | 'LA' | 'AD' | 'TR' | 'LS' | 'AI' | 'SK' | 'GH' | 'FI' | 'MA' | 'NE' | 'UY' | 'CL' | 'BB' | 'KH' | 'BF' | 'RW' | 'TT' | 'ST' | 'BD' | 'IN' | 'CG' | 'OM' | 'PY' | 'TG' | 'BG' | 'SV' | 'FO' | 'BW' | 'PF' | 'PT' | 'VE' | 'FR' | 'PG' | 'TW' | 'MD' | 'CI' | 'BL' | 'BR' | 'LB' | 'YE' | 'CW' | 'GM' | 'WF' | 'ET' | 'LK' | 'CM' | 'GG' | 'CF' | 'GF' | 'AW' | 'TF' | 'DZ' | 'MC' | 'AM' | 'CH' | 'PE' | 'IR' | 'SH' | 'SN' | 'PM' | 'VC' | 'ZM' | 'SO' | 'AT' | 'TO' | 'CV' | 'TH' | 'EH' | 'TL' | 'ZA' | 'GQ' | 'GI' | 'BJ' | 'MO' | 'MW' | 'AU' | 'JM' | 'TD' | 'MM' | 'NG' | 'MR' | 'BM' | 'EC' | 'MU' | 'GL' | 'NC' | 'NZ' | 'AR' | 'CR' | 'MK' | 'MH' | 'ML' | 'BZ' | 'KE' | 'AX' | 'JO' | 'MG' | 'VA' | 'ID' | 'IS' | 'BQ' | 'SG' | 'MY' | 'MX' | 'NA' | 'PR' | 'AF' | 'BY' | 'SX' | 'TZ' | 'IM' | 'GE' | 'HR' | 'PK' | 'KW' | 'ES' | 'LI' | 'PA' | 'AG' | 'JP' | 'CD' | 'CN' | 'GP' | 'LY' | 'RO' | 'IE' | 'EG' | 'IO' | 'MF' | 'NF' | 'VN' | 'LV' | 'TN' | 'DE' | 'AQ' | 'WS' | 'HK' | 'MN' | 'QA' | 'CU' | 'US' | 'GN' | 'BS' | 'CK' | 'SI' | 'MP' | 'KR' | 'XK' | 'CA' | 'TK' | 'GU' | 'SS' | 'SR' | 'HU' | 'DM' | 'NP' | 'GA' | 'BE' | 'LR' | 'UM' | 'BT' | 'RE' | 'SL' | 'NL' | 'BV' | 'ER' | 'MV' | 'LU' | 'NR' | 'SM' | 'HM' | 'KN' | 'CC' | 'FK' | 'VU' | 'CY' | 'PS' | 'RS' | 'BI' | 'GD' | 'TV' | 'JE' | 'UZ' | 'KG' | 'PL'

  type Y<T> = Exclude<T, undefined | null>
}

export {}
