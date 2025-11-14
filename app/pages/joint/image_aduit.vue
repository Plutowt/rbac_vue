<script setup>
import { Message } from '@arco-design/web-vue'
import { onMounted, ref } from 'vue'
import { useApiV1Client } from '~/composables/useApiV1Client'

// 图片列表
const images = ref([])
const loading = ref(false)
const showResultModal = ref(false)
const resultModalTitle = ref('')
const resultMessage = ref('')

// 图片预览功能
const previewVisible = ref(false)
const previewImageUrl = ref('')
const previewImageAlt = ref('')

// 获取图片列表
async function fetchImages() {
  loading.value = true
  try {
    const { listImages } = useApiV1Client()
    const { data, error } = await listImages({
      query: {
        audit_status: 'pending',
        limit: 50,
      },
    })
    if (error) {
      Message.error(`获取图片列表失败: ${error.message}`)
    }
    images.value = data || []
  }
  catch (err) {
    Message.error(`获取图片列表失败: ${err.message}`)
  } finally {
    loading.value = false
  }
}

// 审核图片
async function auditImage(image, status) {
  try {
    const { auditImage } = useApiV1Client()
    const { data, error } = await auditImage({
      body: { image_id: Number(image.id), audit_status: String(status) },
    })
    if (error) {
      Message.error(`图片审核失败: ${error.message}`)
      return
    }

    // 显示审核结果
    resultModalTitle.value = status === 'approved' ? '审核通过' : '审核拒绝'
    resultMessage.value = `图片 ${image.originalFilename} 已${status === 'approved' ? '通过' : '拒绝'}`
    showResultModal.value = true

    // 从列表中移除已审核的图片
    const index = images.value.findIndex(img => img.id === image.id)
    if (index !== -1) {
      images.value.splice(index, 1)
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

// 预览图片
function previewImage(image) {
  previewImageUrl.value = image.fileUrl
  previewImageAlt.value = image.originalFilename
  previewVisible.value = true
}

// 格式化日期
function formatDate(dateString) {
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
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
        <div class="header-section">
          <h2>图片审核</h2>
          <div class="header-actions">
            <a-button type="outline" @click="fetchImages" :loading="loading">
              <template #icon>
                <i class="i-icon-park-outline:refresh"></i>
              </template>
              刷新
            </a-button>
          </div>
        </div>
      </template>

      <div v-if="loading" class="loading-container">
        <a-spin tip="加载中..." />
      </div>

      <div v-else-if="images.length === 0" class="no-image">
        <i class="i-icon-park-outline:empty-block text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg">暂无待审核图片</p>
        <p class="text-gray-400 mt-2">点击刷新按钮获取最新数据</p>
      </div>

      <div v-else class="image-list">
        <a-list :data="images" class="image-list-container">
          <template #item="{ item, index }">
            <a-list-item class="image-item">
              <div class="image-item-content">
                <!-- 左侧：小图 -->
                <div class="image-thumb">
                  <img 
                    :src="item.fileUrl" 
                    :alt="item.originalFilename"
                    class="thumbnail"
                    @click="previewImage(item)"
                  />
                </div>

                <!-- 中间：审核操作 -->
                <div class="audit-actions">
                  <a-space direction="vertical" size="large">
                    <a-button 
                      type="primary" 
                      status="success" 
                      size="large"
                      @click="auditImage(item, 'approved')"
                      class="approve-btn"
                    >
                      <template #icon>
                        <i class="i-icon-park-outline:check"></i>
                      </template>
                      通过
                    </a-button>
                    <a-button 
                      type="primary" 
                      status="danger" 
                      size="large"
                      @click="auditImage(item, 'rejected')"
                      class="reject-btn"
                    >
                      <template #icon>
                        <i class="i-icon-park-outline:close"></i>
                      </template>
                      拒绝
                    </a-button>
                  </a-space>
                </div>

                <!-- 右侧：文件信息 -->
                <div class="file-info">
                  <div class="info-section">
                    <div class="info-item">
                      <span class="label">文件名:</span>
                      <span class="value">{{ item.originalFilename }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">上传用户ID:</span>
                      <span class="value">{{ item.userId }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">上传时间:</span>
                      <span class="value">{{ formatDate(item.createdAt) }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">文件大小:</span>
                      <span class="value">{{ formatFileSize(item.fileSize) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-card>

    <a-modal v-model:visible="showResultModal" :title="resultModalTitle" :footer="false">
      <p>{{ resultMessage }}</p>
      <div class="modal-footer">
        <a-button type="primary" @click="showResultModal = false">确定</a-button>
      </div>
    </a-modal>

    <!-- 图片预览模态框 -->
    <a-modal v-model:visible="previewVisible" :footer="false" width="auto">
      <img :src="previewImageUrl" :alt="previewImageAlt" style="max-width: 100%; max-height: 80vh;">
    </a-modal>
  </div>
</template>
<style scoped>
.audit-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.audit-card {
  background-color: #f5f7ff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-section h2 {
  margin: 0;
  color: #1f2937;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
}

.no-image {
  text-align: center;
  padding: 80px 0;
  color: #666;
}

.image-list-container {
  max-height: 70vh;
  overflow-y: auto;
}

.image-item {
  border-bottom: 1px solid #e5e7eb;
  padding: 20px 0;
}

.image-item:last-child {
  border-bottom: none;
}

.image-item-content {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 0 20px;
}

.image-thumb {
  flex-shrink: 0;
}

.thumbnail {
  width: 240px;
  height: 160px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.thumbnail:hover {
  transform: scale(1.05);
}

.audit-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.approve-btn {
  min-width: 100px;
}

.reject-btn {
  min-width: 100px;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.info-section {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-item {
  display: flex;
  margin-bottom: 8px;
  align-items: center;
}

.label {
  font-weight: 600;
  color: #374151;
  min-width: 100px;
  margin-right: 12px;
}

.value {
  color: #6b7280;
  word-break: break-all;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .image-item-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .audit-actions {
    flex-direction: row;
    gap: 20px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .label {
    min-width: auto;
    margin-right: 0;
    margin-bottom: 4px;
  }
}
</style>
