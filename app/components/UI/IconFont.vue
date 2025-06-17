<script setup lang="ts">
import { Icon } from '@arco-design/web-vue'

defineProps<{ type: string }>()

const IconFont = Icon.addFromIconFontCn({ src: '/js/iconfont.js' })
</script>

<template>
  <IconFont :type="$props.type" />
</template>
