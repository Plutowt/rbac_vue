<template>
    <div class="balance-display">
        <template v-if="loading">
            <a-spin size="small" />
        </template>
        <template v-else-if="error">
        <a-tooltip :content="error">
            <IconExclamationCircle class="text-arco-warning-6" />
        </a-tooltip>
        </template>
        <template v-else>
            <span class="text-arco-text-2 font-medium">
                posted_balance: ￥{{ (posted_balance||0).toFixed(2) }} pending_balance: ￥{{ (pending_balance||0).toFixed(2) }}
            </span>
        </template>
    </div>
</template>

<script setup lang="ts">
const { posted_balance,
        pending_balance,
        loading,
        nowerror,
        fetchBalance } = userBalance()
const { pause, resume } = useIntervalFn(fetchBalance, 5 * 60 * 1000, { immediate: false })

onMounted(() => {
  fetchBalance()
  resume()
})

onUnmounted(() => {
  pause()
})
</script>

<style scoped>
.balance-display {
  display: flex;
  align-items: center;
  padding: 0 8px;
}
</style>