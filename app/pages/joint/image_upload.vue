<script setup>
import { ref } from 'vue'
import { useApiV1Client } from '~/composables/useApiV1Client'

const fileInput = ref(null) // 关联 DOM 中的文件选择输入框
const selectedFile = ref(null) // 存储用户选择的图片文件（File 对象）
const previewUrl = ref(null) // 存储图片预览地址（临时 URL）
const isUploading = ref(false) // 标记是否正在上传（控制按钮状态）
const uploadStatus = ref(null) // 存储上传结果状态（成功/失败信息）

// 图片选择以及合法性验证
function handleFileSelect(event) {
  const file = event.target.files[0]
  if (!file)
    return

  // 验证文件类型
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp']
  if (!validTypes.includes(file.type)) {
    uploadStatus.value = {
      type: 'error',
      message: '不支持的图片格式，请上传JPEG、PNG、GIF、WebP或BMP格式的图片',
    }
    return
  }

  // 验证文件大小 (10MB)
  if (file.size > 10 * 1024 * 1024) {
    uploadStatus.value = {
      type: 'error',
      message: '图片大小不能超过10MB',
    }
    return
  }

  selectedFile.value = file // 生成存储对象
  previewUrl.value = URL.createObjectURL(file) // 生成预览对象的url
  uploadStatus.value = null // 清空上传状态
}

async function handleUpload() {
  if (!selectedFile.value) // 判断有没有选中对应的对象
    return

  isUploading.value = true // 设置状态
  uploadStatus.value = null // 清空状态

  try {
    const { uploadImage } = useApiV1Client()
    const { data, error } = await uploadImage({ body: { file: selectedFile.value } })

    if (error) {
      uploadStatus.value = {
        type: 'error',
        message: error.message || '上传失败，请稍后重试',
      }
    }
    else {
      uploadStatus.value = {
        type: 'success',
        message: '上传成功！',
      }
      // 可以在这里处理上传成功后的逻辑，如显示图片URL等
      console.log('上传成功:', data)
    }
  }
  catch (err) {
    console.error('上传出错:', err)
    uploadStatus.value = {
      type: 'error',
      message: '上传过程中发生错误',
    }
  }
  finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div class="upload-container">
    <header class="header">
      <h1>图片上传</h1>
      <p>选择图片文件并上传</p>
    </header>

    <div class="upload-box">
      <div class="file-selector">
        <input
          id="fileInput"
          ref="fileInput"
          type="file"
          accept="image/*"
          hidden
          @change="handleFileSelect"
        >
        <label for="fileInput" class="select-button">
          <span>选择图片</span>
        </label>
        <span v-if="selectedFile" class="file-name">{{ selectedFile.name }}</span>
      </div>

      <button
        class="upload-button"
        :disabled="!selectedFile || isUploading"
        @click="handleUpload"
      >
        <span v-if="!isUploading">上传</span>
        <span v-else>上传中...</span>
      </button>
    </div>

    <div v-if="uploadStatus" class="status-message">
      <p :class="uploadStatus.type">
        {{ uploadStatus.message }}
      </p>
    </div>

    <div v-if="previewUrl" class="preview-container">
      <img :src="previewUrl" alt="预览图片" class="preview-image">
    </div>
  </div>
</template>

<style scoped>
.upload-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arch Design', sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #1a73e8;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.header p {
  color: #5f6368;
  font-size: 1rem;
}

.upload-box {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.file-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.select-button {
  background-color: #1a73e8;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: inline-block;
}

.select-button:hover {
  background-color: #1557b0;
}

.file-name {
  color: #5f6368;
  font-size: 0.9rem;
}

.upload-button {
  background-color: #34a853;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1rem;
}

.upload-button:hover:not(:disabled) {
  background-color: #2d8e47;
}

.upload-button:disabled {
  background-color: #a8c6af;
  cursor: not-allowed;
}

.status-message {
  margin-bottom: 1rem;
  text-align: center;
}

.status-message .success {
  color: #34a853;
}

.status-message .error {
  color: #ea4335;
}

.preview-container {
  margin-top: 2rem;
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
