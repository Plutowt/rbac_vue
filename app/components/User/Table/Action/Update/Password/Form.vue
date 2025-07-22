<script setup lang="ts">
import type { ApiUserDetail, ApiUserUpdate } from '~/api/v1_1'

const props = defineProps<{ id: ApiUserDetail['id'] }>()
const emit = defineEmits<{
  success: []
  failure: []
  cancel: []
}>()

const { t } = useI18n()

const { userUpdate } = useApiV1Client()

const loading = ref(false)

const { model, attrs, setField } = useArcoForm<ApiUserUpdate & { passwordAgain?: string }>({
  default: {
    isActive: true,
  },
  onSubmitSuccess: async (values) => {
    if (!Object.values(values).length)
      return

    loading.value = true
    const { error } = await userUpdate({ body: values, path: { user_id: props.id } })

    if (error) {
      switch (error.code) {
        case 'Conflict':
          setField(error.target, {
            message: t('validation.conflictItem', { value: t(`common.${error.target}`) }),
            status: 'error',
          })
          break
        case 'ValidationError':
          error.detail?.forEach((i) => {
            setField(
              i.loc.at(-1) as any,
              {
                message: t('validation.invalidFormat', { value: t(`common.${i.loc.at(-1)}`) }),
                status: 'error',
              },
            )
          })
          break
        default:
          break
      }
      emit('failure')
    }
    else {
      emit('success')
    }
    loading.value = false
  },
})
</script>

<template>
  <AForm layout="vertical" :disabled="loading" v-bind="attrs">
    <UIDevPreview :data="model" />

    <UIFormItem
      :model-value="{ id: $props.id.toString() }"
      field="id"
      disabled
      auto-label
      type="input"
    />

    <UIFormItem
      v-model="model"
      field="password"
      auto-label
      type="input-password"
      :min-length="6"
      :max-length="128"
      :pattern="/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]{6,128}$/"
    />

    <UIFormItem
      v-model="model"
      field="passwordAgain"
      type="input-password"
      auto-label
      :rules="[
        {
          validator: (value, callback) => {
            if (value !== model.password)
              callback($t('validation.passwordRepeat'))
            else
              callback()
          },
        },
      ]"
    />

    <div class="flex w-full items-center justify-end gap-4">
      <AButton @click="$emit('cancel')">
        <template #icon>
          <IconClose />
        </template>
        {{ $t('common.cancel') }}
      </AButton>
      <AButton
        type="primary" status="warning" html-type="submit"
        :loading="loading" class="items-center"
      >
        <template #icon>
          <IconTool />
        </template>
        {{ $t('common.changePassword') }}
      </AButton>
    </div>
  </AForm>
</template>
