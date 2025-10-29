<script setup>
import { Message } from '@arco-design/web-vue'
import { computed, onMounted, ref } from 'vue'
import { useApiV1Client } from '~/composables/useApiV1Client'

// 图片列表和当前索引
const images = ref([])
const currentIndex = ref(0)

// 审核结果弹窗
const showResultModal = ref(false)
const resultModalTitle = ref('')
const resultMessage = ref('')

// 获取图片列表
async function fetchImages() {
  try {
    const { listImages } = useApiV1Client()
    const { data, error } = await listImages({
      query: {
        audit_status: 'pending',
        limit: 20,
      },
    })
    if (error) {
      Message.error(`获取图片列表失败: ${error.message}`)
    }
    images.value = data
    currentIndex.value = 0
  }
  catch (err) {
    Message.error(`获取图片列表失败: ${err.message}`)
  }
}

// 当前显示的图片
const currentImage = computed(() => {
  return images.value.length > 0 ? images.value[currentIndex.value] : null
})

// 是否有上一张/下一张
const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < images.value.length - 1)

// 审核图片
async function auditImage(status) {
  if (!currentImage.value)
    return

  try {
    const { auditImage } = useApiV1Client()
    const { data, error } = await auditImage({
      body: { image_id: Number(currentImage.value.id), audit_status: String(status) },
    })
    if (error) {
      Message.error(`图片审核失败:${error}$`)
    }

    // 显示审核结果
    resultModalTitle.value = data.isSucceed === true ? '审核通过' : '审核拒绝'
    resultMessage.value = `图片 ${currentImage.value.originalFilename} 已${status === 'approved' ? '通过' : '拒绝'}`
    showResultModal.value = true

    // 从列表中移除已审核的图片
    images.value.splice(currentIndex.value, 1)

    // 如果删除后索引超出范围，调整索引
    if (currentIndex.value >= images.value.length && images.value.length > 0) {
      currentIndex.value = images.value.length - 1
    }

    // 如果没有更多图片，重新获取
    if (images.value.length === 0) {
      fetchImages()
    }
  }
  catch (error) {
    Message.error(`审核操作失败: ${error.message}`)
  }
}

// 通过图片
const approveImage = () => auditImage('approved')

// 拒绝图片
const rejectImage = () => auditImage('rejected')

// 上一张图片
function prevImage() {
  if (hasPrev.value) {
    currentIndex.value--
  }
}

// 下一张图片
function nextImage() {
  if (hasNext.value) {
    currentIndex.value++
  }
}

// 格式化日期
function formatDate(dateString) {
  return new Date(dateString).toLocaleString()
}

// 格式化文件大小
function formatFileSize(bytes) {
  if (bytes === 0)
    return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

// 组件挂载时获取图片
onMounted(fetchImages)
</script>

<template>
  <div class="audit-container">
    <a-card class="audit-card" :bordered="false">
      <template #title>
        <h2>图片审核</h2>
      </template>

      <div v-if="currentImage" class="image-container">
        <div class="image-wrapper">
          <img :src="currentImage.fileUrl" :alt="currentImage.originalFilename">
        </div>

        <div class="image-info">
          <p><strong>文件名:</strong> {{ currentImage.originalFilename }}</p>
          <p><strong>上传用户ID:</strong> {{ currentImage.userId }}</p>
          <p><strong>上传时间:</strong> {{ formatDate(currentImage.createdAt) }}</p>
          <p><strong>文件大小:</strong> {{ formatFileSize(currentImage.fileSize) }}</p>
          <p><strong>审核状态:</strong>{{ currentImage.auditStatus }}</p>
        </div>
      </div>

      <div v-else class="no-image">
        <p>没有待审核的图片</p>
      </div>

      <div class="action-buttons">
        <a-space>
          <a-button type="outline" :disabled="!hasPrev" @click="prevImage">
            上一张
          </a-button>
          <a-button type="primary" status="success" @click="approveImage">
            通过
          </a-button>
          <a-button type="primary" status="danger" @click="rejectImage">
            拒绝
          </a-button>
          <a-button type="outline" :disabled="!hasNext" @click="nextImage">
            下一张
          </a-button>
        </a-space>
      </div>
    </a-card>

    <a-modal v-model:visible="showResultModal" :title="resultModalTitle" :footer="false">
      <p>{{ resultMessage }}</p>
    </a-modal>
  </div>
</template>

<style scoped>
.audit-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.audit-card {
  background-color: #f5f7ff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.image-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.image-wrapper {
  flex: 1;
  max-width: 70%;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-wrapper img {
  width: 100%;
  height: auto;
  display: block;
}

.image-info {
  flex: 1;
  padding: 15px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-info p {
  margin-bottom: 10px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.no-image {
  text-align: center;
  padding: 40px 0;
  color: #666;
}
</style>
