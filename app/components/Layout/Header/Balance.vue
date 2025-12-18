<template>
    <div class="balance-display">
        <template v-if="loading && !isRefreshing">
            <a-spin size="small" />
        </template>
        <template v-else-if="nowerror">
        <a-tooltip :content="nowerror">
            <IconExclamationCircle class="text-arco-warning-6" />
        </a-tooltip>
        </template>
        <template v-else>
            <span class="text-arco-text-2 font-medium">
            
                posted_balance: ￥{{ (posted_balance||0).toFixed(5) }} pending_balance: ￥{{ (pending_balance||0).toFixed(5) }}
            </span>
        </template>
        <a-button type="text" size="mini" :loading="isRefreshing" @click="handleRefresh" class="refresh-button">
          <template #icon>
            <IconRefresh />
          </template>
        </a-button>

    </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  const balanceStore = userBalance()
const { 
    posted_balance,
    pending_balance,
    loading,
    nowerror
} = storeToRefs(balanceStore)
console.log('posted_balance', posted_balance)
const fetchBalance = balanceStore.fetchBalance

const { pause, resume } = useIntervalFn(fetchBalance, 5 * 60 * 1000, { immediate: false })
const isRefreshing = ref(false)

async function handleRefresh() {
  if (isRefreshing.value) return
  isRefreshing.value = true
  try{
    // console.log('开始刷新余额')
    await fetchBalance()
    // console.log('余额刷新成功，当前值:', posted_balance.value)
  }finally{
    isRefreshing.value = false
  }
  
  
}

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

.refresh-button {
  padding: 4px;
  margin-left: 4px;
  border-radius: 50%;
  opacity: 0.7;
  transition: all 0.2s;
}

.refresh-button:hover {
  opacity: 1;
  background-color: var(--color-fill-2);
}
</style>