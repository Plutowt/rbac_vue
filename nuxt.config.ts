import { pwa } from './config/pwa'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },

  ssr: false,

  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
    '@nuxtjs/mdc',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    'arco-design-nuxt-module',
    '@nuxt/image',
    '@nuxt/icon',
  ],

  pwa,

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  css: [
    '~/assets/css/main.css',
  ],

  colorMode: {
    classSuffix: '',
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/', '/_ipx/_/image/flag/DO.svg', '/_ipx/_/image/flag/GY.svg', '/_ipx/_/image/flag/NO.svg', '/_ipx/_/image/flag/AE.svg', '/_ipx/_/image/flag/AZ.svg', '/_ipx/_/image/flag/EE.svg', '/_ipx/_/image/flag/GW.svg', '/_ipx/_/image/flag/AO.svg', '/_ipx/_/image/flag/BN.svg', '/_ipx/_/image/flag/IT.svg', '/_ipx/_/image/flag/VG.svg', '/_ipx/_/image/flag/CZ.svg', '/_ipx/_/image/flag/YT.svg', '/_ipx/_/image/flag/NI.svg', '/_ipx/_/image/flag/KP.svg', '/_ipx/_/image/flag/SY.svg', '/_ipx/_/image/flag/BH.svg', '/_ipx/_/image/flag/MQ.svg', '/_ipx/_/image/flag/AL.svg', '/_ipx/_/image/flag/KI.svg', '/_ipx/_/image/flag/MZ.svg', '/_ipx/_/image/flag/AS.svg', '/_ipx/_/image/flag/PH.svg', '/_ipx/_/image/flag/LT.svg', '/_ipx/_/image/flag/PN.svg', '/_ipx/_/image/flag/CO.svg', '/_ipx/_/image/flag/SC.svg', '/_ipx/_/image/flag/BO.svg', '/_ipx/_/image/flag/MT.svg', '/_ipx/_/image/flag/GR.svg', '/_ipx/_/image/flag/LC.svg', '/_ipx/_/image/flag/KZ.svg', '/_ipx/_/image/flag/BA.svg', '/_ipx/_/image/flag/FJ.svg', '/_ipx/_/image/flag/ME.svg', '/_ipx/_/image/flag/SA.svg', '/_ipx/_/image/flag/GS.svg', '/_ipx/_/image/flag/SZ.svg', '/_ipx/_/image/flag/KM.svg', '/_ipx/_/image/flag/MS.svg', '/_ipx/_/image/flag/NU.svg', '/_ipx/_/image/flag/VI.svg', '/_ipx/_/image/flag/GT.svg', '/_ipx/_/image/flag/PW.svg', '/_ipx/_/image/flag/GB.svg', '/_ipx/_/image/flag/DK.svg', '/_ipx/_/image/flag/DJ.svg', '/_ipx/_/image/flag/IL.svg', '/_ipx/_/image/flag/TM.svg', '/_ipx/_/image/flag/FM.svg', '/_ipx/_/image/flag/UA.svg', '/_ipx/_/image/flag/SB.svg', '/_ipx/_/image/flag/HN.svg', '/_ipx/_/image/flag/CX.svg', '/_ipx/_/image/flag/SJ.svg', '/_ipx/_/image/flag/TJ.svg', '/_ipx/_/image/flag/KY.svg', '/_ipx/_/image/flag/IQ.svg', '/_ipx/_/image/flag/UG.svg', '/_ipx/_/image/flag/RU.svg', '/_ipx/_/image/flag/ZW.svg', '/_ipx/_/image/flag/SD.svg', '/_ipx/_/image/flag/TC.svg', '/_ipx/_/image/flag/HT.svg', '/_ipx/_/image/flag/SE.svg', '/_ipx/_/image/flag/LA.svg', '/_ipx/_/image/flag/AD.svg', '/_ipx/_/image/flag/TR.svg', '/_ipx/_/image/flag/LS.svg', '/_ipx/_/image/flag/AI.svg', '/_ipx/_/image/flag/SK.svg', '/_ipx/_/image/flag/GH.svg', '/_ipx/_/image/flag/FI.svg', '/_ipx/_/image/flag/MA.svg', '/_ipx/_/image/flag/NE.svg', '/_ipx/_/image/flag/UY.svg', '/_ipx/_/image/flag/CL.svg', '/_ipx/_/image/flag/BB.svg', '/_ipx/_/image/flag/KH.svg', '/_ipx/_/image/flag/BF.svg', '/_ipx/_/image/flag/RW.svg', '/_ipx/_/image/flag/TT.svg', '/_ipx/_/image/flag/ST.svg', '/_ipx/_/image/flag/BD.svg', '/_ipx/_/image/flag/IN.svg', '/_ipx/_/image/flag/CG.svg', '/_ipx/_/image/flag/OM.svg', '/_ipx/_/image/flag/PY.svg', '/_ipx/_/image/flag/TG.svg', '/_ipx/_/image/flag/BG.svg', '/_ipx/_/image/flag/SV.svg', '/_ipx/_/image/flag/FO.svg', '/_ipx/_/image/flag/BW.svg', '/_ipx/_/image/flag/PF.svg', '/_ipx/_/image/flag/PT.svg', '/_ipx/_/image/flag/VE.svg', '/_ipx/_/image/flag/FR.svg', '/_ipx/_/image/flag/PG.svg', '/_ipx/_/image/flag/TW.svg', '/_ipx/_/image/flag/MD.svg', '/_ipx/_/image/flag/CI.svg', '/_ipx/_/image/flag/BL.svg', '/_ipx/_/image/flag/BR.svg', '/_ipx/_/image/flag/LB.svg', '/_ipx/_/image/flag/YE.svg', '/_ipx/_/image/flag/CW.svg', '/_ipx/_/image/flag/GM.svg', '/_ipx/_/image/flag/WF.svg', '/_ipx/_/image/flag/ET.svg', '/_ipx/_/image/flag/LK.svg', '/_ipx/_/image/flag/CM.svg', '/_ipx/_/image/flag/GG.svg', '/_ipx/_/image/flag/CF.svg', '/_ipx/_/image/flag/GF.svg', '/_ipx/_/image/flag/AW.svg', '/_ipx/_/image/flag/TF.svg', '/_ipx/_/image/flag/DZ.svg', '/_ipx/_/image/flag/MC.svg', '/_ipx/_/image/flag/AM.svg', '/_ipx/_/image/flag/CH.svg', '/_ipx/_/image/flag/PE.svg', '/_ipx/_/image/flag/IR.svg', '/_ipx/_/image/flag/SH.svg', '/_ipx/_/image/flag/SN.svg', '/_ipx/_/image/flag/PM.svg', '/_ipx/_/image/flag/VC.svg', '/_ipx/_/image/flag/ZM.svg', '/_ipx/_/image/flag/SO.svg', '/_ipx/_/image/flag/AT.svg', '/_ipx/_/image/flag/TO.svg', '/_ipx/_/image/flag/CV.svg', '/_ipx/_/image/flag/TH.svg', '/_ipx/_/image/flag/EH.svg', '/_ipx/_/image/flag/TL.svg', '/_ipx/_/image/flag/ZA.svg', '/_ipx/_/image/flag/GQ.svg', '/_ipx/_/image/flag/GI.svg', '/_ipx/_/image/flag/BJ.svg', '/_ipx/_/image/flag/MO.svg', '/_ipx/_/image/flag/MW.svg', '/_ipx/_/image/flag/AU.svg', '/_ipx/_/image/flag/JM.svg', '/_ipx/_/image/flag/TD.svg', '/_ipx/_/image/flag/MM.svg', '/_ipx/_/image/flag/NG.svg', '/_ipx/_/image/flag/MR.svg', '/_ipx/_/image/flag/BM.svg', '/_ipx/_/image/flag/EC.svg', '/_ipx/_/image/flag/MU.svg', '/_ipx/_/image/flag/GL.svg', '/_ipx/_/image/flag/NC.svg', '/_ipx/_/image/flag/NZ.svg', '/_ipx/_/image/flag/AR.svg', '/_ipx/_/image/flag/CR.svg', '/_ipx/_/image/flag/MK.svg', '/_ipx/_/image/flag/MH.svg', '/_ipx/_/image/flag/ML.svg', '/_ipx/_/image/flag/BZ.svg', '/_ipx/_/image/flag/KE.svg', '/_ipx/_/image/flag/AX.svg', '/_ipx/_/image/flag/JO.svg', '/_ipx/_/image/flag/MG.svg', '/_ipx/_/image/flag/VA.svg', '/_ipx/_/image/flag/ID.svg', '/_ipx/_/image/flag/IS.svg', '/_ipx/_/image/flag/BQ.svg', '/_ipx/_/image/flag/SG.svg', '/_ipx/_/image/flag/MY.svg', '/_ipx/_/image/flag/MX.svg', '/_ipx/_/image/flag/NA.svg', '/_ipx/_/image/flag/PR.svg', '/_ipx/_/image/flag/AF.svg', '/_ipx/_/image/flag/BY.svg', '/_ipx/_/image/flag/SX.svg', '/_ipx/_/image/flag/TZ.svg', '/_ipx/_/image/flag/IM.svg', '/_ipx/_/image/flag/GE.svg', '/_ipx/_/image/flag/HR.svg', '/_ipx/_/image/flag/PK.svg', '/_ipx/_/image/flag/KW.svg', '/_ipx/_/image/flag/ES.svg', '/_ipx/_/image/flag/LI.svg', '/_ipx/_/image/flag/PA.svg', '/_ipx/_/image/flag/AG.svg', '/_ipx/_/image/flag/JP.svg', '/_ipx/_/image/flag/CD.svg', '/_ipx/_/image/flag/CN.svg', '/_ipx/_/image/flag/GP.svg', '/_ipx/_/image/flag/LY.svg', '/_ipx/_/image/flag/RO.svg', '/_ipx/_/image/flag/IE.svg', '/_ipx/_/image/flag/EG.svg', '/_ipx/_/image/flag/IO.svg', '/_ipx/_/image/flag/MF.svg', '/_ipx/_/image/flag/NF.svg', '/_ipx/_/image/flag/VN.svg', '/_ipx/_/image/flag/LV.svg', '/_ipx/_/image/flag/TN.svg', '/_ipx/_/image/flag/DE.svg', '/_ipx/_/image/flag/AQ.svg', '/_ipx/_/image/flag/WS.svg', '/_ipx/_/image/flag/HK.svg', '/_ipx/_/image/flag/MN.svg', '/_ipx/_/image/flag/QA.svg', '/_ipx/_/image/flag/CU.svg', '/_ipx/_/image/flag/US.svg', '/_ipx/_/image/flag/GN.svg', '/_ipx/_/image/flag/BS.svg', '/_ipx/_/image/flag/CK.svg', '/_ipx/_/image/flag/SI.svg', '/_ipx/_/image/flag/MP.svg', '/_ipx/_/image/flag/KR.svg', '/_ipx/_/image/flag/XK.svg', '/_ipx/_/image/flag/CA.svg', '/_ipx/_/image/flag/TK.svg', '/_ipx/_/image/flag/GU.svg', '/_ipx/_/image/flag/SS.svg', '/_ipx/_/image/flag/SR.svg', '/_ipx/_/image/flag/HU.svg', '/_ipx/_/image/flag/DM.svg', '/_ipx/_/image/flag/NP.svg', '/_ipx/_/image/flag/GA.svg', '/_ipx/_/image/flag/BE.svg', '/_ipx/_/image/flag/LR.svg', '/_ipx/_/image/flag/UM.svg', '/_ipx/_/image/flag/BT.svg', '/_ipx/_/image/flag/RE.svg', '/_ipx/_/image/flag/SL.svg', '/_ipx/_/image/flag/NL.svg', '/_ipx/_/image/flag/BV.svg', '/_ipx/_/image/flag/ER.svg', '/_ipx/_/image/flag/MV.svg', '/_ipx/_/image/flag/LU.svg', '/_ipx/_/image/flag/NR.svg', '/_ipx/_/image/flag/SM.svg', '/_ipx/_/image/flag/HM.svg', '/_ipx/_/image/flag/KN.svg', '/_ipx/_/image/flag/CC.svg', '/_ipx/_/image/flag/FK.svg', '/_ipx/_/image/flag/VU.svg', '/_ipx/_/image/flag/CY.svg', '/_ipx/_/image/flag/PS.svg', '/_ipx/_/image/flag/RS.svg', '/_ipx/_/image/flag/BI.svg', '/_ipx/_/image/flag/GD.svg', '/_ipx/_/image/flag/TV.svg', '/_ipx/_/image/flag/JE.svg', '/_ipx/_/image/flag/UZ.svg', '/_ipx/_/image/flag/KG.svg', '/_ipx/_/image/flag/PL.svg'],
      // routes: ['/'],
    },
  },

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  i18n: {
    lazy: true,
    // restructureDir: 'app/i18n',
    langDir: 'lang',
    defaultLocale: 'CN',
    locales: [
      { code: 'EN', file: 'en.js', name: 'English', language: 'US' },
      { code: 'CN', file: 'zh.js', name: '中文', language: 'CN' },
    ],
    vueI18n: '../i18n.config.ts',
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  runtimeConfig: {
    public: {
      apiV1Base: '',
    },
  },

  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    // and more...
  },

  vite: {
    // server: {
    //   proxy: {
    //     '/api': {
    //       // eslint-disable-next-line node/prefer-global/process
    //       target: process.env.NUXT_PUBLIC_API_V1_BASE,
    //       changeOrigin: true,
    //       rewrite: path => path.replace(/^\/api/, ''),
    //     },
    //   },
    // },
  },

  compatibilityDate: '2025-02-12',
})
