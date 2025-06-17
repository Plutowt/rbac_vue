import { pwa } from './config/pwa'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },

  ssr: false,

  future: {
    compatibilityVersion: 4,
  },

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
      routes: ['/', '/_ipx/_/image/flag/af.svg', '/_ipx/_/image/flag/ax.svg', '/_ipx/_/image/flag/al.svg', '/_ipx/_/image/flag/dz.svg', '/_ipx/_/image/flag/as.svg', '/_ipx/_/image/flag/ad.svg', '/_ipx/_/image/flag/ao.svg', '/_ipx/_/image/flag/ai.svg', '/_ipx/_/image/flag/aq.svg', '/_ipx/_/image/flag/ag.svg', '/_ipx/_/image/flag/ar.svg', '/_ipx/_/image/flag/am.svg', '/_ipx/_/image/flag/aw.svg', '/_ipx/_/image/flag/au.svg', '/_ipx/_/image/flag/at.svg', '/_ipx/_/image/flag/az.svg', '/_ipx/_/image/flag/bs.svg', '/_ipx/_/image/flag/bh.svg', '/_ipx/_/image/flag/bd.svg', '/_ipx/_/image/flag/bb.svg', '/_ipx/_/image/flag/by.svg', '/_ipx/_/image/flag/be.svg', '/_ipx/_/image/flag/bz.svg', '/_ipx/_/image/flag/bj.svg', '/_ipx/_/image/flag/bm.svg', '/_ipx/_/image/flag/bt.svg', '/_ipx/_/image/flag/bo.svg', '/_ipx/_/image/flag/bq.svg', '/_ipx/_/image/flag/ba.svg', '/_ipx/_/image/flag/bw.svg', '/_ipx/_/image/flag/bv.svg', '/_ipx/_/image/flag/br.svg', '/_ipx/_/image/flag/io.svg', '/_ipx/_/image/flag/bn.svg', '/_ipx/_/image/flag/bg.svg', '/_ipx/_/image/flag/bf.svg', '/_ipx/_/image/flag/bi.svg', '/_ipx/_/image/flag/cv.svg', '/_ipx/_/image/flag/kh.svg', '/_ipx/_/image/flag/cm.svg', '/_ipx/_/image/flag/ca.svg', '/_ipx/_/image/flag/ky.svg', '/_ipx/_/image/flag/cf.svg', '/_ipx/_/image/flag/td.svg', '/_ipx/_/image/flag/cl.svg', '/_ipx/_/image/flag/cn.svg', '/_ipx/_/image/flag/cx.svg', '/_ipx/_/image/flag/cc.svg', '/_ipx/_/image/flag/co.svg', '/_ipx/_/image/flag/km.svg', '/_ipx/_/image/flag/ck.svg', '/_ipx/_/image/flag/cr.svg', '/_ipx/_/image/flag/hr.svg', '/_ipx/_/image/flag/cu.svg', '/_ipx/_/image/flag/cw.svg', '/_ipx/_/image/flag/cy.svg', '/_ipx/_/image/flag/cz.svg', '/_ipx/_/image/flag/ci.svg', '/_ipx/_/image/flag/cd.svg', '/_ipx/_/image/flag/dk.svg', '/_ipx/_/image/flag/dj.svg', '/_ipx/_/image/flag/dm.svg', '/_ipx/_/image/flag/do.svg', '/_ipx/_/image/flag/ec.svg', '/_ipx/_/image/flag/eg.svg', '/_ipx/_/image/flag/sv.svg', '/_ipx/_/image/flag/gq.svg', '/_ipx/_/image/flag/er.svg', '/_ipx/_/image/flag/ee.svg', '/_ipx/_/image/flag/sz.svg', '/_ipx/_/image/flag/et.svg', '/_ipx/_/image/flag/fk.svg', '/_ipx/_/image/flag/fo.svg', '/_ipx/_/image/flag/fm.svg', '/_ipx/_/image/flag/fj.svg', '/_ipx/_/image/flag/fi.svg', '/_ipx/_/image/flag/fr.svg', '/_ipx/_/image/flag/gf.svg', '/_ipx/_/image/flag/pf.svg', '/_ipx/_/image/flag/tf.svg', '/_ipx/_/image/flag/ga.svg', '/_ipx/_/image/flag/gm.svg', '/_ipx/_/image/flag/ge.svg', '/_ipx/_/image/flag/de.svg', '/_ipx/_/image/flag/gh.svg', '/_ipx/_/image/flag/gi.svg', '/_ipx/_/image/flag/gr.svg', '/_ipx/_/image/flag/gl.svg', '/_ipx/_/image/flag/gd.svg', '/_ipx/_/image/flag/gp.svg', '/_ipx/_/image/flag/gu.svg', '/_ipx/_/image/flag/gt.svg', '/_ipx/_/image/flag/gg.svg', '/_ipx/_/image/flag/gn.svg', '/_ipx/_/image/flag/gw.svg', '/_ipx/_/image/flag/gy.svg', '/_ipx/_/image/flag/ht.svg', '/_ipx/_/image/flag/hm.svg', '/_ipx/_/image/flag/va.svg', '/_ipx/_/image/flag/hn.svg', '/_ipx/_/image/flag/hk.svg', '/_ipx/_/image/flag/hu.svg', '/_ipx/_/image/flag/is.svg', '/_ipx/_/image/flag/in.svg', '/_ipx/_/image/flag/id.svg', '/_ipx/_/image/flag/ir.svg', '/_ipx/_/image/flag/iq.svg', '/_ipx/_/image/flag/ie.svg', '/_ipx/_/image/flag/im.svg', '/_ipx/_/image/flag/il.svg', '/_ipx/_/image/flag/it.svg', '/_ipx/_/image/flag/jm.svg', '/_ipx/_/image/flag/jp.svg', '/_ipx/_/image/flag/je.svg', '/_ipx/_/image/flag/jo.svg', '/_ipx/_/image/flag/kz.svg', '/_ipx/_/image/flag/ke.svg', '/_ipx/_/image/flag/ki.svg', '/_ipx/_/image/flag/kw.svg', '/_ipx/_/image/flag/kg.svg', '/_ipx/_/image/flag/la.svg', '/_ipx/_/image/flag/lv.svg', '/_ipx/_/image/flag/lb.svg', '/_ipx/_/image/flag/ls.svg', '/_ipx/_/image/flag/lr.svg', '/_ipx/_/image/flag/ly.svg', '/_ipx/_/image/flag/li.svg', '/_ipx/_/image/flag/lt.svg', '/_ipx/_/image/flag/lu.svg', '/_ipx/_/image/flag/mo.svg', '/_ipx/_/image/flag/mg.svg', '/_ipx/_/image/flag/mw.svg', '/_ipx/_/image/flag/my.svg', '/_ipx/_/image/flag/mv.svg', '/_ipx/_/image/flag/ml.svg', '/_ipx/_/image/flag/mt.svg', '/_ipx/_/image/flag/mh.svg', '/_ipx/_/image/flag/mq.svg', '/_ipx/_/image/flag/mr.svg', '/_ipx/_/image/flag/mu.svg', '/_ipx/_/image/flag/yt.svg', '/_ipx/_/image/flag/mx.svg', '/_ipx/_/image/flag/md.svg', '/_ipx/_/image/flag/mc.svg', '/_ipx/_/image/flag/mn.svg', '/_ipx/_/image/flag/me.svg', '/_ipx/_/image/flag/ms.svg', '/_ipx/_/image/flag/ma.svg', '/_ipx/_/image/flag/mz.svg', '/_ipx/_/image/flag/mm.svg', '/_ipx/_/image/flag/na.svg', '/_ipx/_/image/flag/nr.svg', '/_ipx/_/image/flag/np.svg', '/_ipx/_/image/flag/nl.svg', '/_ipx/_/image/flag/nc.svg', '/_ipx/_/image/flag/nz.svg', '/_ipx/_/image/flag/ni.svg', '/_ipx/_/image/flag/ne.svg', '/_ipx/_/image/flag/ng.svg', '/_ipx/_/image/flag/nu.svg', '/_ipx/_/image/flag/nf.svg', '/_ipx/_/image/flag/kp.svg', '/_ipx/_/image/flag/mk.svg', '/_ipx/_/image/flag/mp.svg', '/_ipx/_/image/flag/no.svg', '/_ipx/_/image/flag/om.svg', '/_ipx/_/image/flag/pk.svg', '/_ipx/_/image/flag/pw.svg', '/_ipx/_/image/flag/pa.svg', '/_ipx/_/image/flag/pg.svg', '/_ipx/_/image/flag/py.svg', '/_ipx/_/image/flag/pe.svg', '/_ipx/_/image/flag/ph.svg', '/_ipx/_/image/flag/pn.svg', '/_ipx/_/image/flag/pl.svg', '/_ipx/_/image/flag/pt.svg', '/_ipx/_/image/flag/pr.svg', '/_ipx/_/image/flag/qa.svg', '/_ipx/_/image/flag/cg.svg', '/_ipx/_/image/flag/ro.svg', '/_ipx/_/image/flag/ru.svg', '/_ipx/_/image/flag/rw.svg', '/_ipx/_/image/flag/re.svg', '/_ipx/_/image/flag/bl.svg', '/_ipx/_/image/flag/sh.svg', '/_ipx/_/image/flag/kn.svg', '/_ipx/_/image/flag/lc.svg', '/_ipx/_/image/flag/mf.svg', '/_ipx/_/image/flag/pm.svg', '/_ipx/_/image/flag/vc.svg', '/_ipx/_/image/flag/ws.svg', '/_ipx/_/image/flag/sm.svg', '/_ipx/_/image/flag/st.svg', '/_ipx/_/image/flag/sa.svg', '/_ipx/_/image/flag/sn.svg', '/_ipx/_/image/flag/rs.svg', '/_ipx/_/image/flag/sc.svg', '/_ipx/_/image/flag/sl.svg', '/_ipx/_/image/flag/sg.svg', '/_ipx/_/image/flag/sx.svg', '/_ipx/_/image/flag/sk.svg', '/_ipx/_/image/flag/si.svg', '/_ipx/_/image/flag/sb.svg', '/_ipx/_/image/flag/so.svg', '/_ipx/_/image/flag/za.svg', '/_ipx/_/image/flag/gs.svg', '/_ipx/_/image/flag/kr.svg', '/_ipx/_/image/flag/ss.svg', '/_ipx/_/image/flag/es.svg', '/_ipx/_/image/flag/lk.svg', '/_ipx/_/image/flag/ps.svg', '/_ipx/_/image/flag/sd.svg', '/_ipx/_/image/flag/sr.svg', '/_ipx/_/image/flag/sj.svg', '/_ipx/_/image/flag/se.svg', '/_ipx/_/image/flag/ch.svg', '/_ipx/_/image/flag/sy.svg', '/_ipx/_/image/flag/tw.svg', '/_ipx/_/image/flag/tj.svg', '/_ipx/_/image/flag/tz.svg', '/_ipx/_/image/flag/th.svg', '/_ipx/_/image/flag/tl.svg', '/_ipx/_/image/flag/tg.svg', '/_ipx/_/image/flag/tk.svg', '/_ipx/_/image/flag/to.svg', '/_ipx/_/image/flag/tt.svg', '/_ipx/_/image/flag/tn.svg', '/_ipx/_/image/flag/tm.svg', '/_ipx/_/image/flag/tc.svg', '/_ipx/_/image/flag/tv.svg', '/_ipx/_/image/flag/tr.svg', '/_ipx/_/image/flag/ug.svg', '/_ipx/_/image/flag/ua.svg', '/_ipx/_/image/flag/ae.svg', '/_ipx/_/image/flag/gb.svg', '/_ipx/_/image/flag/um.svg', '/_ipx/_/image/flag/us.svg', '/_ipx/_/image/flag/uy.svg', '/_ipx/_/image/flag/uz.svg', '/_ipx/_/image/flag/vu.svg', '/_ipx/_/image/flag/ve.svg', '/_ipx/_/image/flag/vn.svg', '/_ipx/_/image/flag/vg.svg', '/_ipx/_/image/flag/vi.svg', '/_ipx/_/image/flag/wf.svg', '/_ipx/_/image/flag/eh.svg', '/_ipx/_/image/flag/ye.svg', '/_ipx/_/image/flag/zm.svg', '/_ipx/_/image/flag/zw.svg'],
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
    defaultLocale: 'zh',
    locales: [
      { code: 'en', file: 'en.js', name: 'English', language: 'us' },
      { code: 'zh', file: 'zh.js', name: '中文', language: 'cn' },
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
    server: {
      proxy: {
        '/api': {
          // eslint-disable-next-line node/prefer-global/process
          target: process.env.NUXT_PUBLIC_API_V1_BASE,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
  },

  compatibilityDate: '2025-02-12',
})
