<script setup lang="ts">
import type { ApiUserDetail, ApiUserUpdate } from '~/api/v1_1'
import { diff } from '@yecaoi/arco'

const props = defineProps<{ old: ApiUserDetail | undefined, id: ApiUserDetail['id'] }>()
const emit = defineEmits<{ success: [], failure: [] }>()

const { t } = useI18n()

const { userUpdate } = useApiV1Client()

const loading = ref(false)

const { model, attrs, setField } = useArcoForm<ApiUserUpdate>({
  default: {
    isActive: true,
  },
  onSubmitSuccess: async (values) => {
    const body = diff(values, props.old) as typeof values
    if (!body)
      return
    loading.value = true
    const { error } = await userUpdate({ body, path: { user_id: props.id } })

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
  onChange: (v) => {
    if (v.email === '') {
      model.email = undefined
    }
  },
})
const { pause, resume } = watchEffect(() => {
  const user = props.old
  if (user) {
    model.nickname = user.nickname
    model.bio = user.bio
    model.zoneinfo = user.zoneinfo
    model.locale = user.locale
    model.phoneNumber = user.phoneNumber
    model.email = user.email
    model.username = user.username
    model.isActive = user.isActive
  }
})

const modelChanged = ref(false)
watch(model, () => {
  modelChanged.value = true
})
watchEffect(() => {
  if (modelChanged.value)
    pause()
  else
    resume()
})
</script>

<template>
  <AForm layout="vertical" :disabled="loading" v-bind="attrs">
    <UIFormItem
      :model-value="{ id: $props.id.toString() }"
      field="id"
      disabled
      auto-label
      type="input"
    />

    <UIFormItem
      v-model="model"
      field="username"
      auto-label
      type="input"
      :min-length="3"
      :max-length="64"
      :pattern="/^[a-zA-Z][a-zA-Z0-9_-]{2,64}$/"
    />

    <UIFormItem
      v-model="model"
      field="nickname"
      auto-label
      type="input"
      :rules="[
        { minLength: 2, message: $t('validation.string.min', { value: 2 }) },
        { maxLength: 32, message: $t('validation.string.max', { value: 32 }) },
      ]"
    />

    {{ }}
    <UIFormItem
      v-model="model"
      field="email"
      auto-label
      type="input"
      :rules="[
        {
          validator(value, callback) {
            if (value === null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
              callback()
            else
              callback($t('validation.invalidFormat', { value: $t('common.email') }))
          },
        },
      ]"
    />

    <UIFormItem
      v-model="model"
      field="phoneNumber"
      type="input-phonenumber"
      auto-label
    />

    <UIFormItem
      v-model="model"
      field="bio"
      auto-label
      type="textarea"
      :max-length="1024"
    />

    <div class="flex w-full items-center justify-end gap-4">
      <AButton>
        <template #icon>
          <IconRefresh />
        </template>
        {{ $t('common.reset') }}
      </AButton>
      <AButton
        type="primary" status="warning" html-type="submit"
        :loading="loading"
      >
        <template #icon>
          <IconPlus />
        </template>
        {{ $t('common.update') }}
      </AButton>
    </div>
  </AForm>
</template>
