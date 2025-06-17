<script setup lang="ts">
const props = defineProps<{ items: UIAnyNavigationItem[] }>()

const localePath = useLocalePath()

function onClickMenuItem(key: string) {
  let result: UINavigationItem | undefined
  let current = props.items
  const indexes = key.split('_')

  for (const [index, indexValue] of indexes.entries()) {
    const i = current[Number.parseInt(indexValue)]!
    if ((index + 1) < indexes.length) {
      current = (i as UISubNavigationItem).children ?? (i as UIGroupNavigationItem).group
    }
    else {
      result = i as UINavigationItem
    }
  }

  if (result!.to) {
    navigateTo(localePath(result!.to))
  }
}

function withKey(items: Record<string, any>[], parent?: string) {
  let counter = 0
  const result = []
  for (const i of items) {
    const ii = { ...i }
    ii.key = parent ? `${parent}_${counter++}` : `${counter++}`

    if (ii.children) {
      ii.children = withKey(ii.children, ii.key.toString())
    }
    else if (ii.group) {
      ii.group = withKey(ii.group, ii.key.toString())
    }
    result.push(ii)
  }
  return result as (UIAnyNavigationItem & { key: string })[]
}
const items = computed(() => withKey(props.items))
const sidebar = useSidebar()
</script>

<template>
  <AMenu
    class="h-full"
    show-collapse-button
    @collapse="sidebar.toggleExpanded()"
    @menu-item-click="onClickMenuItem"
  >
    <UINavigationItems :items="items" />
  </AMenu>
</template>
