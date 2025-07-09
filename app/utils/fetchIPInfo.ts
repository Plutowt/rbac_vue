export interface IpApiCoResult {
  ip: string
  network: string
  version: string
  city: string
  region: null
  region_code: null
  country: string
  country_name: string
  /** 手动标识的, 到底是不是这个类型不确定  */
  country_code: ISO3166_1_Alpha_2
  country_code_iso3: string
  country_capital: string
  country_tld: string
  continent_code: string
  in_eu: boolean
  postal: string
  latitude: number
  longitude: number
  timezone: string
  utc_offset: string
  country_calling_code: string
  currency: string
  currency_name: string
  languages: string
  country_area: number
  country_population: number
  asn: string
  org: string
}

export function fetchIpApiCo() {
  return $fetch<IpApiCoResult>('https://ipapi.co/json/')
}
