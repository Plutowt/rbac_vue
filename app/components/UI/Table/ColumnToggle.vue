<script setup lang="ts" generic="T">
defineProps<{ columns: TypeTableToggleVisibleColumns<T> }>()
</script>

<template>
  <ATrigger
    trigger="click" :popup-translate="[0, 10]" show-arrow
    position="br"
  >
    <AButton
      shape="round"
      class="inline-flex items-center gap-2"
      type="dashed"
    >
      <Icon name="ph:columns-light" />
      {{ $t('common.visibleColumn') }}
    </AButton>
    <template #content>
      <div class="w-48 rounded border border-arco-fill-3 bg-arco-bg-5 py-1">
        <ul>
          <li
            v-for="(i, index) in $props.columns"
            :key="index"
          >
            <button
              class="
                flex w-full items-center gap-3 px-3 py-2 text-left text-arco-text-2
                hover:cursor-pointer hover:bg-arco-fill-2 hover:text-arco-text-1
              "
              @click="i.toggleVisible()"
            >
              {{ i.title }}
              <IconCheck
                v-if="i.visible.value !== false"
                class="ml-auto"
              />
            </button>
          </li>
        </ul>
      </div>
    </template>
  </ATrigger>
</template>
