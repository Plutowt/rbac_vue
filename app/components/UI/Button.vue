<script setup lang="ts">
defineProps<{
  type: 'edit' | 'delete' | 'cancel' | 'confirm'
  loading?: boolean
  size?: 'mini' | 'small' | 'large'
  atype?: 'text'
}>()
defineEmits<{ click: [] }>()

const visible = ref(false)
</script>

<template>
  <AButton
    v-if="$props.type === 'edit'"
    :type="$props.atype" status="warning" :loading="$props.loading"
    :size="$props.size"
    @click="$emit('click')"
  >
    <template #icon>
      <IconPen />
    </template>
    <slot>
      {{ $t('common.edit') }}
    </slot>
  </AButton>
  <AButton
    v-else-if="$props.type === 'delete'"
    :type="$props.atype" status="danger" :loading="$props.loading"
    :size="$props.size"
    @click="visible = true"
  >
    <template #icon>
      <IconDelete />
    </template>
    {{ $t('common.delete') }}
    <a-modal v-model:visible="visible" @ok="$emit('click')">
      <template #title>
        {{ $t('common.operationConfirm') }}
      </template>
      <div>
        <slot />
      </div>
    </a-modal>
  </AButton>
  <AButton
    v-else-if="$props.type === 'cancel'" :loading="$props.loading"
    :type="$props.atype"
    :size="$props.size"
    @click="$emit('click')"
  >
    <template #icon>
      <IconClose />
    </template>
    {{ $t('common.cancel') }}
  </AButton>
  <AButton
    v-else-if="$props.type === 'confirm'" :loading="$props.loading"
    :type="$props.atype"
    :size="$props.size"
    @click="$emit('click')"
  >
    <template #icon>
      <IconCheck />
    </template>
    {{ $t('common.confirm') }}
  </AButton>
</template>
