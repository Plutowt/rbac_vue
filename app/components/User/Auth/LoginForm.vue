<script setup lang="ts">
import type { GetArgument } from '@yecaoi/arco'

const auth = useAuth()

type LoginData = GetArgument<typeof auth.login>

const { authGetCsrfToken } = useApiV1Client()
const csrfToken = ref()

const { data, refresh } = useAsyncData(() => authGetCsrfToken())

watch(data, (n) => {
  if (n?.error) {
    console.error(`request csrf token error: ${n.error}`)
  }
  else {
    csrfToken.value = n?.data
  }
})

const { attrs, model } = useArcoForm<LoginData>({
  async onSubmitSuccess(values) {
    if (!auth.loading) {
      const v = { ...values }
      if (!v._token) {
        v._token = data.value?.data || null
      }

      await auth.login(v)
      await refresh()
      // if (auth.error) {

      // }
    }
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
