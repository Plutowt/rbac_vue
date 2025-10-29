<script setup>
import { ref } from 'vue'
import { useApiV1Client } from '~/composables/useApiV1Client'

const excelFile = ref(null)
const uploading = ref(false)
const images = ref([])
const selectedIds = ref([])
const lastExcelId = ref('')

function onExcelChange(e) {
  const input = e.target
  if (!input.files || input.files.length === 0) { excelFile.value = null; return }
  excelFile.value = input.files[0]
}

async function uploadExcel() {
  if (!excelFile.value)
    return
  uploading.value = true
  try {
    const api = useApiV1Client()
    const form = new FormData()
    form.append('file', excelFile.value)
    const res = await api.uploadExcel({ body: form })
    // SDK uploadExcel may return { excel_id, images } or just images
    if (res && res.excel_id)
      lastExcelId.value = res.excel_id
    images.value = res?.images || res || []
    selectedIds.value = []
  }
  finally { uploading.value = false }
}

async function submit() {
  if (!selectedIds.value.length)
    return
  try {
    const api = useApiV1Client()
    if (lastExcelId.value) {
      await api.jointContent({ excel_id: lastExcelId.value })
      return
    }
    // Fallback: try to call jointContent with body.image_ids if supported
    await api.jointContent({ body: { image_ids: selectedIds.value } })
  }
  catch {
    // ignore for now
  }
}
</script>

<template>
  <div class="p-4">
    <h2 class="mb-4 text-lg font-semibold">
      Excel 上传并选择图片
    </h2>

    <div class="mb-4">
      <input type="file" accept=".xlsx,.xls" @change="onExcelChange">
    </div>

    <div class="mb-4">
      <arco-button type="primary" :loading="uploading" :disabled="!excelFile" @click="uploadExcel">
        上传 Excel
      </arco-button>
    </div>

    <div v-if="images.length" class="mb-4">
      <h3 class="mb-2 font-medium">
        可选已审核图片（只能选择审核通过的）
      </h3>
      <div class="grid grid-cols-4 gap-2">
        <div v-for="img in images" :key="img.id" class="border p-2">
          <img :src="img.url" class="h-24 max-w-full object-cover">
          <div class="mt-2 text-center">
            <arco-checkbox v-model:checked="selectedIds" :value="img.id">
              选择
            </arco-checkbox>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <arco-button type="primary" :disabled="!selectedIds.length" @click="submit">
        提交并拼接
      </arco-button>
    </div>
  </div>
</template>

<style scoped>
</style>
