<script setup lang="ts" generic="T">
defineProps<{ items: UIDataOption<T>[] }>()

const sorts = defineModel<any[]>()

function setSort(field: keyof T, type: 'asc' | 'desc') {
  const index = sorts.value?.findIndex(i => i.split('.')[0] === field)
  const value = `${field.toString()}.${type}` as Sort<T>
  if (index !== undefined && index > -1) {
    if (sorts.value![index] === value)
      sorts.value?.splice(index, 1)
    else
      sorts.value![index] = value
  }
  else {
    sorts.value?.push(value)
  }
}
</script>

<template>
  <a-popover
    content-class="!p-2"
    position="bl" trigger="click"
  >
    <AButton shape="circle" :type="sorts?.length ? 'primary' : undefined">
      <template #icon>
        <UIIconFont type="icon-arrow_up_arrow_down" />
      </template>
    </AButton>

    <template #content>
      <ul class="space-y-1">
        <li
          v-for="(i, index) in $props.items"
          :key="index" class="flex w-full items-center gap-3 rounded px-3 py-1.5 hover:bg-fill-2 sm:w-56"
        >
          <UIIconFont v-if="i.icon !== undefined" :type="i.icon" />
          <UIIconFont v-else-if="i.type === 'string'" type="icon-textformat" />
          <UIIconFont v-else-if="i.type === 'datetime'" type="icon-clock" />
          <UIIconFont v-else-if="i.type === 'select'" type="icon-list_bullet" />
          <UIIconFont v-else-if="i.type === 'number'" type="icon-number" />
          <UIIconFont v-else type="icon-target" />

          <span>{{ i.label }}</span>
          <div class="ml-auto inline-flex items-center gap-3">
            <button
              class="flex cursor-pointer items-center rounded p-1 hover:bg-fill-3"
              :class="{ 'bg-fill-3': sorts?.find(ii => ii === `${i.field.toString()}.asc`) }"
              @click="setSort(i.field, 'asc')"
            >
              <icon-up />
            </button>
            <button
              class="flex cursor-pointer items-center rounded p-1 hover:bg-fill-3"
              :class="{ 'bg-fill-3': sorts?.find(ii => ii === `${i.field.toString()}.desc`) }"
              @click="setSort(i.field, 'desc')"
            >
              <icon-down />
            </button>
          </div>
        </li>
      </ul>
    </template>
  </a-popover>
</template>
