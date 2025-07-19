<script setup lang="ts">
import { Notification } from '@arco-design/web-vue'

const { t } = useI18n()
const { userCreate } = useApiV1Client()
const { model, attrs, setField, reset } = useArcoForm<typeof userCreate>({
  default: {
    isActive: true,
  },
  onSubmitSuccess: async (values) => {
    const { data, error } = await userCreate({ body: values })
    if (error) {
      switch (error.code) {
        case 'Conflict':
          setField(error.target, {
            message: t('validation.conflictItem', { value: t(`common.${error.target}`) }),
            status: 'error',
          })
          break

        default:
          break
      }
    }
    else {
      Notification.success(`创建用户${data.username}成功`)
    }
  },
  onChange: (v) => {
    if (v.email === '') {
      model.email = undefined
    }
  },
})
</script>

<template>
  <AForm layout="vertical" v-bind="attrs">
    <UIDevPreview :data="model" />

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
      field="password"
      auto-label
      type="input-password"
      :min-length="6"
      :max-length="128"
      :pattern="/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]{6,128}$/"
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

    <UIFormItem
      v-model="model"
      field="email"
      auto-label
      type="input"
      :rules="[
        { type: 'email', message: $t('validation.invalidFormat', { value: $t('common.email') }) },
      ]"
    />

    <UIFormItem
      v-model="model"
      v-any-permission="['roles:read']"
      field="roles"
      type="select"
      auto-label
    >
      <UIRoleSelect />
    </UIFormItem>

    <UIFormItem
      v-model="model"
      field="isActive"
      type="switch"
      auto-label
      hide-asterisk
      required
    />

    <UIFormItem
      v-model="model"
      field="phoneNumber"
      type="input"
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
      <AButton @click="reset">
        <template #icon>
          <IconRefresh />
        </template>
        {{ $t('common.reset') }}
      </AButton>
      <AButton type="primary" html-type="submit">
        <template #icon>
          <IconPlus />
        </template>
        {{ $t('common.create') }}
      </AButton>
    </div>
  </AForm>
</template>
