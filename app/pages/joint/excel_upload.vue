<script setup>
import { Message } from '@arco-design/web-vue'
import { computed, onMounted, ref } from 'vue'
import { useApiV1Client } from '~/composables/useApiV1Client'

// 文件上传状态
const excelFile = ref(null)
const excelId = ref(null)
const selectedImageId = ref(null)
const selectedImage = ref(null)
const localtaskname = ref(null)
const showImageSelector = ref(false)
const showSuccessModal = ref(false)
const successMessage = ref('')
const submitting = ref(false)
const uploadingExcel = ref(false)
const auditFilter = ref('all')



// 图片列表相关状态
const images = ref([])
const loadingImages = ref(false)
const loadingMore = ref(false)
const pageSize = 2
const lastcreatedAt = ref(null)
const hasMoreImages = ref(true)

// 步骤状态
const currentStep = computed(() => {
  if (!excelFile.value) return 1
  if (!selectedImage.value) return 2
  if (!localtaskname.value) return 3
  return 4
})


// 过滤后的图片
const filteredImages = computed(() => {
  if (auditFilter.value === 'all')
    return images.value
  return images.value.filter(img => img.auditStatus === auditFilter.value)
})

// 是否可以提交 - 修改：只需要excelId即可提交，图片为可选
const canSubmit = computed(() => {
  return excelId.value 
})

// 获取图片列表
async function fetchImages(loadMore = false) {
  if (loadMore) {
    loadingMore.value = true
  }
  else {
    loadingImages.value = true
  }

  try {
    const { listImages } = useApiV1Client()
    // console.log(lastcreatedAt.value)
    const { data, error } = await listImages({
      query: {
        audit_status: auditFilter.value === 'all' ? undefined : auditFilter.value,
        limit: pageSize,
        last_created_at: lastcreatedAt.value,
      },
    })

    if (error) {
      throw new Error(error.message || '获取图片列表失败')
    }

    if (data && data.length > 0) {
      if (loadMore) {
        images.value = [...images.value, ...data]
      }
      else {
        images.value = data
      }
      lastcreatedAt.value = data[data.length - 1]?.createdAt || null
      // console.log(lastcreatedAt.value)
      hasMoreImages.value = data.length === pageSize
    }
    else if (loadMore) {
      hasMoreImages.value = false
    }
  }
  catch (error) {
    console.error('获取图片列表失败:', error)
    Message.error(`获取图片列表失败: ${error.message}`)
  }
  finally {
    loadingImages.value = false
    loadingMore.value = false
  }
}

// 加载更多图片
function loadMoreImages() {
  fetchImages(true)
}

// Excel文件上传处理
async function handleExcelUpload(options) {
  uploadingExcel.value = true

  try {
    excelFile.value = options.fileItem.file

    if (excelFile.value) {
      Message.success('Excel文件上传成功')
      excelId.value = true
    }
  }
  catch (error) {
    console.error('Excel文件上传失败:', error)
    Message.error(`Excel文件上传失败: ${error.message}`)
  }
  finally {
    uploadingExcel.value = false
  }
}

// 选择图片
function selectImage(image) {
  if (image.auditStatus !== 'approved') {
    Message.warning('只能选择审核通过的图片')
    return
  }

  selectedImageId.value = image.id
  selectedImage.value = image
  showImageSelector.value = false
}

// 移除已选图片
function removeSelectedImage() {
  selectedImageId.value = null
  selectedImage.value = null
}

// 提交表单
async function submitForm() {
  if (!canSubmit.value)
    return

  submitting.value = true
  try {
    const { jointContent } = useApiV1Client()
    console.log(localtaskname.value)
    const { data, error } = await jointContent({
      body: {
        file: excelFile.value,
        image_id: selectedImageId.value, // 图片ID为可选，可为null
        local_task_name: localtaskname.value
      },
    })

    if (error) {
      throw new Error(error.message || '提交失败')
    }

    successMessage.value = data.isSucceed
      ? (selectedImageId.value ? '任务上传成功' : 'Excel文件提交成功')
      : '提交失败'
    showSuccessModal.value = true
  }
  catch (error) {
    console.error('提交失败:', error)
    Message.error(`提交失败: ${error.message}`)
  }
  finally {
    submitting.value = false
  }
}

// 处理模态框关闭
function handleModalClose() {
  showImageSelector.value = false
}

// 处理成功确认
function handleSuccessConfirm() {
  showSuccessModal.value = false
  // 重置表单
  excelFile.value = null
  excelId.value = null
  selectedImageId.value = null
  selectedImage.value = null
  images.value = []
  lastcreatedAt.value = null
  hasMoreImages.value = true
  localtaskname.value = null
}

// 处理图片加载错误
function handleImageError(event) {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPC9zdmc+'
}

// 处理筛选变化
function handleFilterChange() {
  images.value = []
  lastcreatedAt.value = null
  hasMoreImages.value = true
  fetchImages(false)
}

// 格式化日期
function formatDate(dateString) {
  if (!dateString)
    return '未知'
  return new Date(dateString).toLocaleString('zh-CN')
}

// 格式化文件大小
function formatFileSize(bytes) {
  if (!bytes)
    return '0 Bytes'
  if (bytes === 0)
    return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

// 获取审核状态文本
function getStatusText(status) {
  const statusMap = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
  }
  return statusMap[status] || status
}

// 获取状态颜色
function getStatusColor(status) {
  const colorMap = {
    pending: 'orange',
    approved: 'green',
    rejected: 'red',
  }
  return colorMap[status] || 'blue'
}

// 组件挂载时获取图片
onMounted(() => {
  fetchImages(false)
})
</script>

<template>
  <div class="upload-container">
    <a-card class="upload-card" :bordered="false">
      <template #title>
        <h2>SMS任务上传管理</h2>
      </template>

      <div class="upload-steps">
        <a-steps :current="currentStep">
          <a-step title="上传Excel" />
          <a-step title="选择图片（可选）" />
          <a-step title="输入任务名称(可选)"/>
          <a-step title="完成提交" />
        </a-steps>
      </div>

      <div class="upload-section">
        <h3>1. 上传Excel文件</h3>
        <a-upload
          :custom-request="handleExcelUpload"
          accept=".xls,.xlsx,.csv"
          :show-file-list="false"
          :disabled="uploadingExcel"
        >
          <a-button type="primary" :loading="uploadingExcel">
            <template #icon>
              <icon-upload />
            </template>
            {{ uploadingExcel ? '上传中...' : '上传Excel文件' }}
          </a-button>
        </a-upload>
        <p v-if="excelFile" class="file-info success">
          <icon-check-circle style="color: #00b42a; margin-right: 8px;" />
          已上传文件: {{ excelFile.name }} ({{ formatFileSize(excelFile.size) }})
        </p>
        <p v-else class="file-info hint">
          支持 .xls, .xlsx, .csv 格式，最大 15MB
        </p>
      </div>

      <div class="upload-section">
        <h3>2. 选择图片（可选）</h3>
        <a-button type="primary" @click="showImageSelector = true">
          <template #icon>
            <icon-picture />
          </template>
          选择图片
        </a-button>
        <p class="optional-hint">
          图片为可选内容，可不选择直接提交
        </p>

        <!-- 模态框 -->
        <a-modal
          v-model:visible="showImageSelector"
          title="选择图片"
          width="80%"
          :footer="false"
          @close="handleModalClose"
        >
          <div class="image-selector">
            <div class="selector-header">
              <a-radio-group v-model="auditFilter" type="button" @change="handleFilterChange">
                <a-radio value="all">
                  全部图片
                </a-radio>
                <a-radio value="approved">
                  仅审核通过
                </a-radio>
                <a-radio value="pending">
                  待审核
                </a-radio>
                <a-radio value="rejected">
                  已拒绝
                </a-radio>
              </a-radio-group>
            </div>

            <a-spin :loading="loadingImages">
              <div class="image-grid">
                <div
                  v-for="image in filteredImages"
                  :key="image.id"
                  class="image-item"
                  :class="{
                    selected: selectedImageId === image.id,
                    approved: image.auditStatus === 'approved',
                    rejected: image.auditStatus === 'rejected',
                    pending: image.auditStatus === 'pending',
                    disabled: image.auditStatus !== 'approved',
                  }"
                  @click="selectImage(image)"
                >
                  <img
                    :src="image.fileUrl"
                    :alt="image.originalFilename"
                    loading="lazy"
                    @error="handleImageError"
                  >
                  <div class="image-overlay">
                    <div class="image-status" :class="image.auditStatus">
                      {{ getStatusText(image.auditStatus) }}
                    </div>
                    <div class="image-actions">
                      <a-button
                        v-if="image.auditStatus === 'approved'"
                        type="primary"
                        size="mini"
                      >
                        选择
                      </a-button>
                      <a-button v-else disabled size="mini">
                        不可选
                      </a-button>
                    </div>
                  </div>
                </div>
              </div>
            </a-spin>

            <div class="load-more">
              <a-button
                type="outline"
                :loading="loadingMore"
                :disabled="!hasMoreImages"
                @click="loadMoreImages"
              >
                {{ hasMoreImages ? '加载更多' : '没有更多图片了' }}
              </a-button>
            </div>
          </div>
        </a-modal>

        <div v-if="selectedImage" class="selected-image">
          <h4>已选图片</h4>
          <div class="image-preview">
            <div class="preview-image">
              <img :src="selectedImage.fileUrl" :alt="selectedImage.originalFilename" @error="handleImageError">
            </div>
            <div class="image-info">
              <p><strong>文件名:</strong> {{ selectedImage.originalFilename }}</p>
              <p><strong>上传时间:</strong> {{ formatDate(selectedImage.createdAt) }}</p>
              <p>
                <strong>审核状态:</strong>
                <a-tag :color="getStatusColor(selectedImage.auditStatus)">
                  {{ getStatusText(selectedImage.auditStatus) }}
                </a-tag>
              </p>
              <p><strong>文件大小:</strong> {{ formatFileSize(selectedImage.fileSize) }}</p>
            </div>
            <div class="image-remove">
              <a-button type="outline" size="mini" @click="removeSelectedImage">
                <template #icon>
                  <icon-delete />
                </template>
                移除
              </a-button>
            </div>
          </div>
        </div>

      </div>
      
        <div class="task-name-section">
          <h3>3. 输入任务名称（可选）</h3>
          <a-input
          v-model="localtaskname"
          placeholder="请输入任务名称(可选)"
          :max-length="50"
          allow-clear
          style="max-width: 500px;"/>
          <p class="optional-hint">
            任务名称为可选内容
          </p>
        </div>

      <div class="submit-section">
        <a-button
          type="primary"
          status="success"
          :disabled="!canSubmit"
          :loading="submitting"
          size="large"
          @click="submitForm"
        >
          <template #icon>
            <icon-check />
          </template>
          {{ submitting ? '提交中...' : '提交' }}
        </a-button>
        <p v-if="canSubmit" class="submit-hint">
          {{ selectedImage ? '将提交Excel文件和选中的图片' : '将仅提交Excel文件' }}
        </p>
      </div>
    </a-card>

    <a-modal
      v-model:visible="showSuccessModal"
      title="操作成功"
      :footer="false"
      :hide-cancel="true"
    >
      <div class="success-modal">
        <icon-check-circle style="font-size: 48px; color: #00b42a; margin-bottom: 16px;" />
        <p style="font-size: 16px; margin-bottom: 16px;">
          {{ successMessage }}
        </p>
        <a-button type="primary" @click="handleSuccessConfirm">
          确定
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.upload-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

.upload-card {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.upload-steps {
  margin-bottom: 32px;
  padding: 0 20px;
}

.upload-section {
  margin-bottom: 32px;
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e5e5;
}

.upload-section h3 {
  color: #1d2129;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
}

.optional-hint {
  margin-top: 8px;
  color: #86909c;
  font-size: 14px;
  font-style: italic;
}

.file-info {
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.file-info.success {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
}

.file-info.hint {
  color: #86909c;
  background-color: #f7f8fa;
}

.selector-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e6eb;
}

.image-selector {
  padding: 16px 0;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
  max-height: 500px;
  overflow-y: auto;
  padding: 8px;
}

.image-item {
  position: relative;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.image-item.selected {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.image-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.image-item.approved {
  border-color: #52c41a;
}

.image-item.rejected {
  border-color: #ff4d4f;
}

.image-item.pending {
  border-color: #faad14;
}

.image-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.7));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.image-status {
  align-self: flex-start;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
  font-weight: 500;
}

.image-status.approved {
  background-color: #52c41a;
}

.image-status.rejected {
  background-color: #ff4d4f;
}

.image-status.pending {
  background-color: #faad14;
}

.image-actions {
  align-self: center;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.selected-image {
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.selected-image h4 {
  color: #1d2129;
  margin-bottom: 16px;
  font-size: 16px;
}

.image-preview {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.preview-image {
  flex-shrink: 0;
}

.preview-image img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid #e5e6eb;
}

.image-info {
  flex: 1;
}

.image-info p {
  margin-bottom: 8px;
  color: #4e5969;
}

.image-info strong {
  color: #1d2129;
  min-width: 80px;
  display: inline-block;
}

.image-remove {
  align-self: flex-start;
}

.submit-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e6eb;
  gap: 12px;
}

.submit-hint {
  color: #86909c;
  font-size: 14px;
  margin: 0;
}

.success-modal {
  text-align: center;
  padding: 20px 0;
}

.task-name-section {
  margin-bottom: 32px;
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e5e5;
}

.task-name-section h3 {
  color: #1d2129;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
}


@media (max-width: 768px) {
  .upload-container {
    padding: 10px;
  }

  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }

  .image-preview {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

</style>
