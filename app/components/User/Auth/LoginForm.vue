<script setup lang="ts">
import type { GetArgument } from '@yecaoi/arco'

const auth = useAuth()

type LoginData = GetArgument<typeof auth.login>

const { attrs, model } = useForm<LoginData>({
  async onSubmitSuccess(values) {
    if (!auth.loading)
      await auth.login(values)
  },
  onChange: () => {
    auth.clearError()
  },
})
</script>

<template>
  <AForm v-bind="attrs">
    <AFormItem
      field="username"
      :rules="[
        { minLength: 3 },
        { maxLength: 64 },
        {
          match: /^[a-zA-Z][a-zA-Z0-9_-]{2,64}$/,
          message: $t('validation.invalidItemFormat', { item: $t('common.username') }),
        },
        { required: true, message: $t('validation.required') },
      ]"
      hide-label
    >
      <AInput
        v-model="model.username"
        :placeholder="$t('common.username')"
      >
        <template #prefix>
          <icon-user />
        </template>
      </AInput>
    </AFormItem>

    <AFormItem
      field="password"
      hide-label

      :rules="[
        { minLength: 3 },
        { maxLength: 64 },
        {
          match: /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]{6,128}$/,
          message: $t('validation.invalidItemFormat', { item: $t('common.password') }),
        },
        { required: true, message: $t('validation.required') },
      ]"
    >
      <AInputPassword
        v-model="model.password"
        :placeholder="$t('common.password')"
      >
        <template #prefix>
          <icon-lock />
        </template>
      </AInputPassword>
    </AFormItem>

    <AFormItem v-if="auth.error" hide-label>
      <AAlert type="error">
        {{ auth.error }}
      </AAlert>
    </AFormItem>

    <AFormItem hide-label>
      <ACheckbox v-model="auth.remember">
        {{ $t('common.rememberLogin') }}
      </ACheckbox>
    </AFormItem>

    <AFormItem hide-label>
      <AButton type="primary" html-type="submit" long :loading="auth.loading">
        {{ $t('common.login') }}
      </AButton>
    </AFormItem>
  </AForm>
</template>
