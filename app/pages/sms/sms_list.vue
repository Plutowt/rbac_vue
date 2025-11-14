<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">短信任务列表</h1>
      <p class="text-gray-600 mt-2">显示所有短信发送任务</p>
    </div>

    <!-- 排序区域 -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <div class="flex-1 flex gap-2">
        <!-- 排序字段选择 -->
        <a-select
          v-model="sortField"
          placeholder="选择排序字段"
          style="width: 200px"
          @change="handleSortChange"
        >
          <a-option value="local_task_name">任务名称</a-option>
          <a-option value="total_count">总数量</a-option>
          <a-option value="success_count">成功数量</a-option>
          <a-option value="failed_count">失败数量</a-option>
          <a-option value="state">状态</a-option>
          <a-option value="created_at">创建时间</a-option>
          <a-option value="bind_picture">图片</a-option>
        </a-select>

        <!-- 排序方向 -->
        <a-button
          @click="toggleSortDirection"
          :type="sortDirection === 'desc' ? 'primary' : 'outline'"
          style="width: 120px"
        >
          <template #icon>
            <i class="mr-2" :class="sortDirection === 'desc' ? 'i-icon-park-outline:sort-descending' : 'i-icon-park-outline:sort-ascending'"></i>
          </template>
          {{ sortDirection === 'desc' ? '降序' : '升序' }}
        </a-button>
      </div>

      <!-- 刷新按钮 -->
      <a-button
        type="primary"
        @click="fetchSmsList"
        :loading="loading"
        style="width: 120px"
      >
        <template #icon>
          <i class="i-icon-park-outline:refresh mr-2"></i>
        </template>
        刷新
      </a-button>
    </div>

    <!-- 数据表格 -->
    <div class="bg-white rounded-lg shadow-sm border-0">
      <a-table
        :columns="columns" 
        :data="tableData" 
        :loading="loading"
        :pagination="{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showTotal: true,
          showPageSize: true,
        }"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
        row-key="id"
        class="min-h-400px"
      >
        <!-- 状态列 -->
        <template #state="{ record }">
          <a-tag
            :color="getStateColor(record.state)"
            size="small"
          >
            {{ getStateText(record.state) }}
          </a-tag>
        </template>

        <!-- 创建时间列 -->
        <template #createdAt="{ record }">
          {{ formatDate(record.createdAt) }}
        </template>

      </a-table>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && tableData.length === 0" class="text-center py-20">
      <i class="i-icon-park-outline:empty-block text-6xl text-gray-300 mb-4"></i>
      <p class="text-gray-500 text-lg">暂无短信任务</p>
      <p class="text-gray-400 mt-2">点击刷新按钮获取最新数据</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { smsGetSmsList } from '~/api/v1_1/sdk.gen'

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const sortField = ref('created_at')
const sortDirection = ref('desc')

// 分页配置
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

// 表格列配置
const columns = [
  {
    title: '任务名称',
    dataIndex: 'localTaskName',
    key: 'localTaskName',
    ellipsis: true,
    tooltip: true
  },
  {
    title:'图片',
    dataIndex:'bindPicture',
    key:'bindPicture',
    width: 100,
    align: 'center',
  },
  {
    title: '总数量',
    dataIndex: 'totalCount',
    key: 'totalCount',
    width: 100,
    align: 'center'
  },
  {
    title: '成功数量',
    dataIndex: 'successCount',
    key: 'successCount',
    width: 100,
    align: 'center'
  },
  {
    title: '失败数量',
    dataIndex: 'failedCount',
    key: 'failedCount',
    width: 100,
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    width: 100,
    align: 'center',
    slotName: 'state'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
    align: 'center',
    slotName: 'createdAt'
  },
]

// 获取短信列表
const fetchSmsList = async () => {
  loading.value = true
  // console.log('sortDirection.value', sortDirection.value)
  try {
    const response = await smsGetSmsList({
      query: {
        page: pagination.value.page,
        page_size: pagination.value.pageSize,
        sort_by: sortField.value,
        sort_direction: sortDirection.value
      }
    })

    if (response.data?.items) {
      tableData.value = response.data.items
      pagination.value.total = response.data.total
    } else {
      tableData.value = []
      pagination.value.total = 0
    }
  } catch (error) {
    console.error('获取短信列表失败:', error)
    // 这里可以添加消息提示
  } finally {
    loading.value = false
  }
}

// 处理排序字段变化
const handleSortChange = () => {
  pagination.value.page = 1
  fetchSmsList()
}

// 切换排序方向
const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === 'desc' ? 'asc' : 'desc'
  
  pagination.value.page = 1
  fetchSmsList()
}

// 处理页码变化
const handlePageChange = (page) => {
  pagination.value.page = page
  fetchSmsList()
}

// 处理每页数量变化
const handlePageSizeChange = (pageSize) => {
  pagination.value.pageSize = pageSize
  pagination.value.page = 1
  fetchSmsList()
}

// 获取状态颜色
const getStateColor = (state) => {
  const stateColors = {
    0: 'orange', // 等待中
    1: 'green',  // 进行中
    2: 'blue',   // 已完成
  }
  return stateColors[state] || 'gray'
}

// 获取状态文本
const getStateText = (state) => {
  const stateTexts = {
    0: '等待中',
    1: '进行中',
    2: '已完成',
  }
  return stateTexts[state] || '未知'
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}


// 组件挂载时获取数据
onMounted(() => {
  fetchSmsList()
})
</script>

<style scoped>
.min-h-400px {
  min-height: 400px;
}
</style>