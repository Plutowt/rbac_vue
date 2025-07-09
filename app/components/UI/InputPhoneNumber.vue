<script setup lang="ts">
import countries from '~/region-data.json'

defineProps<{ placeholder?: string }>()

interface Item { cca2: ISO3166_1_Alpha_2, idd: string, name: string }

const values = countries.map(i => ({ ...i, hidden: false })).filter(i => i.idd) as (Item & { hidden: boolean, alt: string })[]

const ipInfo = useIpInfo()

const model = defineModel<string | null>()

const iddPattern = /tel:(?<idd>\+\d+)-/
const modelPhoneNumber = computed({
  get: () => model.value?.replace(iddPattern, ''),
  set: (value) => {
    const currentIDD = model.value?.match(iddPattern)?.[0]
    if (currentIDD) {
      if (value)
        model.value = `${currentIDD}${value}`
      else
        model.value = currentIDD
    }
    else {
      model.value = undefined
    }
  },
})

const modelIDD = computed(
  {
    get: () => {
      const modelValues = model.value?.match(iddPattern)?.groups
      let idd: Item | undefined
      if (modelValues?.idd) {
        idd = values.find(i => i.idd === modelValues.idd)
      }

      // 取当前 ip 的 IDD
      if (!idd && ipInfo.iso)
        idd = values.find(i => i.cca2 === ipInfo.iso) as Item | undefined

      // 最后退回使用美国的 IDD
      idd = idd || { cca2: 'US', idd: '+1', name: 'United States' } satisfies Item

      return idd
    },
    set: (idd) => {
      const currentPhoneNumber = model.value?.replace(iddPattern, '')
      let _result = ''
      if (idd.idd)
        _result = `tel:${idd.idd}-`

      if (currentPhoneNumber !== undefined) {
        _result += currentPhoneNumber
      }

      if (_result)
        model.value = _result
      else
        model.value = undefined
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
    return values.map(i => ({ ...i, hidden: !i.cca2.toLowerCase().includes(f) && !i.idd.toLowerCase().includes(f) && !i.name.toLowerCase().includes(f) }))
  }
  else {
    return values
  }
})

// 现在要考虑的是怎么把 model 的值同步到 IDD 和 value 中
</script>

<template>
  <div ref="container" class="flex h-8 w-full items-center">
    <div v-show="visible" ref="source">
      <AInput v-model="filterValue" class="sticky top-0">
        <template #prepend>
          <IconSearch />
        </template>
      </AInput>
      <ul
        class="border border-arco-border-3 bg-arco-bg-1 text-[12px] text-arco-text-2"
      >
        <li
          v-for="v, index in options"
          :key="index"
          class="
            flex items-center gap-2 px-1 py-2
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
        <AButton class="flex items-center gap-1 text-arco-text-2">
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
            class="max-h-96 overflow-y-scroll shadow-sm"
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
