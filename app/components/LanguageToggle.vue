<script setup lang="ts">
import type { Locale } from 'vue-i18n'
import { apiV1 } from '~/api/v1'

const auth = useAuth()

const { locale, locales, setLocale } = useI18n()

watch(
  () => auth.info?.locale as Locale | undefined,
  (userLocale) => {
    if (userLocale !== locale.value && userLocale)
      setLocale(userLocale)
  },
)

async function changeLocale(locale: Locale) {
  await setLocale(locale)
  if (auth.isLogged) {
    await apiV1['/user'].PATCH({ body: { locale } })
  }
}

interface Item {
  label: string
  iso: ISO3166_1_Alpha_2
  locale: typeof locale.value
}

const languages = ref<Item[]>(
  locales.value.map(locale => ({
    label: locale.name!,
    iso: (locale.language! as ISO3166_1_Alpha_2),
    locale: locale.code,
    class: 'lg:w-32',
  })),
)

const current = computed<Item>(() => languages.value.find(i => i.locale === locale.value)!)
</script>

<template>
  <ADropdown>
    <AButton
      size="small" shape="circle" type="outline" class="!border-border-2 !text-[rgb(var(--gray-8))]"
    >
      <template #icon>
        <icon-language />
      </template>
    </AButton>

    <template #content>
      <ADoption
        v-for="i in languages" :key="i.locale" :value="i"
        :class="{ '!bg-fill-2': i.iso === current.iso }"
        @click="changeLocale(i.locale)"
      >
        <div
          class="flex items-center gap-2"
        >
          <UIFlag :iso="i.iso" class="size-4" />
          {{ i.label }}
        </div>
      </ADoption>
    </template>
  </ADropdown>
</template>
