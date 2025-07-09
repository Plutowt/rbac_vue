<!-- 注意这个是给登录表单用的界面用的 -->
<script lang="ts" setup>
</script>

<template>
  <ALayout class="size-full">
    <div
      class="
        flex size-full items-center justify-center px-6
        sm:px-0
      "
    >
      <div
        class="
          w-full overflow-hidden rounded
          sm:w-96
        "
      >
        <slot />
      </div>
    </div>
  </ALayout>
</template>
