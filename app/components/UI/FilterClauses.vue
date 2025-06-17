<script setup lang="ts" generic="T">
const props = defineProps<{
  options: (UIDataOption<T> & {
    options?: { value: string | number | boolean | Record<string, any> | undefined, label: string }[]
  })[]
}>()

const rules = defineModel<FilterRule<T>[]>()

const items = computed(() => {
  let index = 0
  return rules.value?.map((rule) => {
    const removeIndex = index++
    return ({
      index: removeIndex,
      attrs: {
        'modelValue': rule.clause as any,
        'onUpdate:modelValue': (nValue: any) => rule.clause = nValue,
        'field': rule.field as string,
        'label': rule.label,
        'icon': props.options.find(oi => oi.field === rule.field)?.icon,
        'options': props.options.find(oi => oi.field === rule.field)?.options,
        'onDelete': () => {
          rules.value?.splice(removeIndex, 1)
        },
      },
      type: rule.type,
    })
  })
})
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <template v-for="(i, index) in items" :key="index">
      <slot :name="i.attrs.field" :attrs="i.attrs">
        <UIFilterClauseUserSelect
          v-if="i.attrs.field === 'userId'" v-bind="{
            'modelValue': i.attrs.modelValue,
            'onUpdate:modelValue': i.attrs['onUpdate:modelValue'],
            'field': i.attrs.field,
            'onDelete': i.attrs.onDelete,
          }"
        />
        <UIFilterClauseString v-else-if="i.type === 'string'" v-bind="i.attrs" />
        <UIFilterClauseNumber v-else-if="i.type === 'number'" v-bind="i.attrs" />
        <UIFilterClauseDatetime v-else-if="i.type === 'datetime'" v-bind="i.attrs" />
        <UIFilterClauseSelect v-else-if="i.type === 'select'" v-bind="i.attrs" />
      </slot>
    </template>

    <UIFilterClauseAdd v-model="rules" :items="$props.options" />
  </div>
</template>
