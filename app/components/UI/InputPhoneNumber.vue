<script setup lang="ts">
import parsePhoneNumber, { isSupportedCountry } from 'libphonenumber-js'
import countries from '~/region-data.json'

defineProps<{
  placeholder?: string
  error?: boolean
}>()

interface Item {
  cca2: ISO3166_1_Alpha_2
  idd: string
  name: string
}

const values = countries.map(i => ({ ...i, hidden: false })).filter(i => i.idd && isSupportedCountry(i.cca2)) as (Item & { hidden: boolean, alt: string })[]

const ipInfo = useIpInfo()

const model = defineModel<string | null>()
const innerModel = reactive<{ country?: string, number?: string }>({})

const model_ = computed({
  get: () => {
    let country: string | undefined = innerModel.country
    let number: string | undefined = innerModel.number

    if (country === undefined && number === undefined) {
      const modelInfo = model.value ? parsePhoneNumber(model.value) : undefined
      if (modelInfo) {
        country = modelInfo.country
        number = modelInfo.nationalNumber
      }
    }

    return { country, number }
  },
  set: (value) => {
    innerModel.country = value.country
    innerModel.number = value.number

    let result: string | undefined
    if (value.country && value.number) {
      if (isSupportedCountry(value.country))
        result = parsePhoneNumber(value.number, value.country)?.getURI()
    }

    if (result) {
      model.value = result
    }
    else {
      model.value = null
    }
  },
})

const modelPhoneNumber = computed({
  get: () => model_.value.number,
  set: (value) => {
    if (value === undefined)
      return

    // eslint-disable-next-line ts/no-use-before-define
    model_.value = { country: model_.value.country || modelIDD.value.cca2, number: value }
  },
})

const modelIDD = computed(
  {
    get: () => {
      let idd: Item | undefined
      if (model_.value.country) {
        idd = values.find(i => model_.value.country ? i.cca2 === model_.value.country : false)
      }

      // 取当前 ip 的 IDD
      if (!idd && ipInfo.iso)
        idd = values.find(i => i.cca2 === ipInfo.iso) as Item | undefined

      // 最后退回使用美国的 IDD
      idd = idd || { cca2: 'US', idd: '+1', name: 'United States' } satisfies Item

      return idd
    },
    set: (idd) => {
      model_.value = { number: model_.value.number, country: idd.cca2 }
    },
  },
)

const visible = ref(false)
const sourceEl = useTemplateRef('source')
const targetEl = useTemplateRef('target')
const filterValue = ref('')
const { width, stop } = useElementSize(useTemplateRef('container'), undefined)
// 处理 IDD 选择框宽度
watchEffect(() => {
  if (visible.value && width.value)
    stop()
})

// 将 IDD 选择框挂载到下拉框中
// 因为每次渲染选择框都会加载国旗图标, 所以放在外面, 等展开下拉框时再移到下拉框里
watchEffect(() => {
  const el: HTMLDivElement | undefined = targetEl.value?.$el
  if (visible.value) {
    if (el && sourceEl.value) {
      el.firstElementChild!.appendChild(sourceEl.value)
    }
  }
  else {
    if (el && sourceEl.value) {
      el.firstElementChild!.removeChild(sourceEl.value)
    }
  }
})

const options = computed(() => {
  if (filterValue.value) {
    const f = filterValue.value.toLowerCase()
    return values.map(i => ({
      ...i,
      hidden: !i.cca2.toLowerCase().includes(f) && !i.idd.toLowerCase().includes(f) && !i.name.toLowerCase().includes(f),
    }))
  }
  else {
    return values
  }
})
</script>

<template>
  <div ref="container" class="flex h-8 w-full items-center">
    <div
      v-show="visible" ref="source" class="text-[14px] text-arco-text-1"
    >
      <input
        v-model="filterValue"
        class="sticky top-0 h-7 w-full bg-arco-fill-1 px-3 outline-0"
      >
      <ul>
        <li
          v-for="v, index in options"
          :key="index"
          class="
            flex items-center gap-2 px-3 py-2
            hover:cursor-pointer hover:bg-arco-fill-2
          "
          :class="[
            modelIDD?.cca2 === v.cca2 ? 'bg-arco-fill-3' : '',
            v.hidden ? '!hidden' : '',
          ]"
          :title="v.alt"
          @click="modelIDD = v"
        >
          <div class="border border-arco-border-2">
            <UIFlag
              :iso="(v.cca2 as ISO3166_1_Alpha_2)"
              class="h-3 w-5"
            />
          </div>
          <div class="w-0 flex-1 truncate">
            {{ v.name }}
          </div>
          {{ v.idd }}
        </li>
      </ul>
    </div>

    <AInputGroup class="w-full">
      <ATrigger
        v-model:popup-visible="visible" trigger="click"
        position="bl"
      >
        <AButton
          class="flex items-center gap-1 text-arco-text-2"
          :class="visible ? `
            !border-arco-primary-6 !bg-arco-bg-2 !shadow-[0_0_0_0_--color-primary-light-2]
          ` : undefined"
          :status="error ? 'danger' : undefined"
        >
          <UIFlag
            v-if="modelIDD"
            :iso="modelIDD.cca2"
            class="h-4"
          />
          <span class="text-[12px]">{{ modelIDD?.idd }}</span>
        </AButton>
        <template #content>
          <AScrollbar
            v-if="visible" ref="target" :style="{ width: `${width}px` }"
            class="
              max-h-96 overflow-y-scroll rounded border border-arco-fill-3
              bg-[var(--color-bg-popup)] shadow-sm
            "
          />
        </template>
      </ATrigger>

      <AInput
        v-model="modelPhoneNumber"
        class="!w-full flex-1"
        :placeholder="$props.placeholder"
      />
    </AInputGroup>
  </div>
</template>
