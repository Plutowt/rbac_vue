<script setup lang="ts">
import type { DotLottieVueInstance } from '@lottiefiles/dotlottie-vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { layoutHeaderHeight } from '~/constants'

import LayoutHeaderBalance from './Balance.vue'

const { sm } = useArcoBreakpoints()
const sidebar = useSidebar()

const el = useTemplateRef<DotLottieVueInstance>('lottie')
watchEffect(() => {
  if (el.value) {
    const instance = el.value.getDotLottieInstance()
    if (instance !== null) {
      instance.canvas.height = layoutHeaderHeight
      instance.canvas.width = layoutHeaderHeight
      instance.resize()

      if (sidebar.popShow)
        instance.setSegment(0, 48)
      else
        instance.setSegment(48, 96)

      instance.play()
    }
  }
})

const color = useColorMode()
</script>

<template>
  <a-layout-header
    class="
      flex items-center border-b border-b-arco-border-2 bg-arco-bg-2 pr-5
      sm:pl-5
    "
    :style="{ height: `${layoutHeaderHeight}px` }"
  >
    <button
      v-if="!sm"
      type="button"
      class="
        h-full cursor-pointer
        sm:hidden
      "
      :style="{ width: `${layoutHeaderHeight}px` }"
      @click="() => sidebar.togglePopShow()"
    >
      <DotLottieVue
        ref="lottie"
        src="/lottie/menu.lottie"
        :theme-id="color.value"
        :speed="3"
      />
    </button>
    <Logo />

    <div class="ml-auto">
      <ASpace size="medium">
        <LanguageToggle />
        <ColorModeToggle />
        <!-- <Settings /> -->
         <LayoutHeaderBalance />
        <LayoutHeaderUser />
      </ASpace>
    </div>
  </a-layout-header>
</template>
