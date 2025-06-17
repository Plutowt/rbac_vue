<script setup lang="ts" generic="T">
defineProps<{
  items: {
    field: keyof T
    type: FieldType
    label: string
    icon?: string
  }[]
}>()

const rules = defineModel<FilterRule<T>[]>()
</script>

<template>
  <a-popover
    content-class="!p-2"
    position="bl" trigger="click"
  >
    <AButton
      shape="round" size="small"
      class="!px-2"
    >
      <template #icon>
        <slot name="icon">
          <IconPlus />
        </slot>
      </template>
      {{ $t('common.action.item', { action: $t('common.add'), item: $t('common.rule') }) }}
    </AButton>

    <template #content>
      <ul class="space-y-1">
        <li v-for="(i, index) in $props.items" :key="index">
          <!-- TODO: 添加 -->
          <button
            class="flex w-full cursor-pointer items-center gap-3 rounded px-3 py-1.5 hover:bg-fill-2 sm:w-56"
            @click="rules?.push({ field: i.field, label: i.label, type: i.type })"
          >
            <UIIconFont v-if="i.icon !== undefined" :type="i.icon" />
            <UIIconFont v-else-if="i.type === 'string'" type="icon-textformat" />
            <UIIconFont v-else-if="i.type === 'datetime'" type="icon-clock" />
            <UIIconFont v-else-if="i.type === 'select'" type="icon-list_bullet" />
            <UIIconFont v-else-if="i.type === 'number'" type="icon-number" />
            <UIIconFont v-else type="icon-target" />

            <span>{{ i.label }}</span>
            <div
              v-if="rules?.filter(rule => rule.field === i.field).length"
              class="ml-auto inline-flex size-4 items-center justify-center rounded-full text-xs"
              :style="{ background: '#E5E6EB', color: '#86909C' }"
            >
              {{ rules?.filter(rule => rule.field === i.field).length }}
            </div>
          </button>
        </li>
      </ul>
    </template>
  </a-popover>
</template>
