<script setup lang="ts" generic="T">
defineProps<{ columns: TableToggleVisibleColumns<T> }>()
</script>

<template>
  <ATrigger trigger="click" :popup-translate="[0, 10]" show-arrow>
    <AButton shape="circle">
      <template #icon>
        <Icon name="ph:columns-light" />
      </template>
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
                flex w-full items-center gap-3 px-3 py-2 text-left text-arco-text-1
                hover:bg-arco-fill-2
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
