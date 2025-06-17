<script setup lang="ts">
import type { UserCreate } from '~/api/v1/users'
import { users } from '~/api/v1/users'

const emit = defineEmits<{ success: [], failure: [] }>()
const localePath = useLocalePath()
const { attrs, model, el } = useForm<UserCreate>({
  async onSubmitSuccess(values) {
    await useApi(
      () => users.create(values),
      {
        onSuccess: () => {
          emit('success')
          navigateTo(localePath('users'))
        },
        onFailure: () => {
          emit('failure')
        },
      },
    ).fetcher()
  },
})
</script>

<template>
  <AForm
    v-bind="attrs" class="mx-auto py-16 sm:max-w-lg"
  >
    <AFormItem
      field="nickname" :label="$t('common.nickname')"
      :rules="[
        { minLength: 2, message: $t('validation.string.min', { min: 2 }) },
        { maxLength: 16, message: $t('validation.string.max', { max: 16 }) },
      ]"
    >
      <AInput
        v-model="model.nickname"
        :placeholder="$t('common.nickname')"
      />
    </AFormItem>

    <AFormItem
      field="email" :label="$t('common.email')"
      :rules="[
        { required: true, message: $t('validation.required') },
        {
          match: /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/,
          message: $t('validation.invalidEmail'),
        },
      ]"
    >
      <AInput
        v-model="model.email"
        :placeholder="$t('common.email')"
      />
    </AFormItem>

    <AFormItem
      field="username" :label="$t('common.username')"
      :rules="[
        { required: true, message: $t('validation.required') },
        { minLength: 5, message: $t('validation.string.min', { min: 5 }) },
        { maxLength: 64, message: $t('validation.string.max', { max: 64 }) },
        { match: /^[a-zA-Z0-9]+$/, message: $t('validation.invalidUsernameFormat') },
      ]"
    >
      <AInput
        v-model="model.username"
        :placeholder="$t('common.username')"
      />
    </AFormItem>

    <AFormItem
      field="password" :label="$t('common.password')"
      :rules="[
        { required: true, message: $t('validation.required') },
        { minLength: 6, message: $t('validation.string.min', { min: 6 }) },
        { maxLength: 128, message: $t('validation.string.max', { max: 128 }) },
      ]"
    >
      <AInputPassword
        v-model="model.password"
        :placeholder="$t('common.password')"
      >
        {{ $t('common.password') }}
      </AInputPassword>
    </AFormItem>

    <AFormItem
      field="disabled" :label="$t('common.status.label')"
    >
      <a-radio-group v-model="model.disabled">
        <a-radio :value="false">
          {{ $t('common.enable') }}
        </a-radio>
        <a-radio :value="true">
          {{ $t('common.disable') }}
        </a-radio>
      </a-radio-group>
    </AFormItem>

    <AFormItem
      field="role" :label="$t('common.role')"
      :rules="[
        { required: true, message: $t('validation.required') },
      ]"
    >
      <a-select v-model="model.role" :placeholder="$t('common.role')">
        <a-option value="admin">
          {{ $t('common.roles.admin') }}
        </a-option>
        <a-option value="agent">
          {{ $t('common.roles.agent') }}
        </a-option>
        <a-option value="user">
          {{ $t('common.roles.user') }}
        </a-option>
      </a-select>
    </AFormItem>

    <AFormItem
      field="bio" :label="$t('common.bio')"
      :rules="[
        { maxLength: 1024, message: $t('validation.string.max', { max: 1024 }) },
      ]"
    >
      <a-textarea v-model="model.bio" :placeholder="$t('common.placeholderItem', { item: $t('common.bio') })" allow-clear />
    </AFormItem>

    <AFormItem>
      <ASpace size="medium">
        <AButton type="primary" html-type="submit">
          {{ $t('common.confirm') }}
        </AButton>
        <AButton html-type="button" @click="el?.resetFields()">
          {{ $t('common.reset') }}
        </AButton>
      </ASpace>
    </AFormItem>
  </AForm>
</template>
