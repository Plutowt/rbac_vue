<script setup lang="ts">
import type { MeUpdatePassword } from '~/api/v1/users'
import { me } from '~/api/v1/users'

const auth = useAuth()
const { t } = useI18n()
const displayLogout = ref(false)
const { attrs, model, submitting, el } = useForm<MeUpdatePassword>({
  async onSubmitSuccess(values) {
    await useApi(
      () => me.updatePassword(values),
      {
        onSuccess: () => {
          Message.success(t('common.action.status', { action: t('common.changePassword'), status: t('common.status.success') }))
          displayLogout.value = true
        },
        onFailure: (error) => {
          if (error.status !== 401) {
            Message.error(t('common.action.status', { action: t('common.changePassword'), status: t('common.status.failure') }))
          }
        },
        errorHandles: {
          401: async () => {
            displayLogout.value = true
          },
        },
      },
    ).fetcher()
  },
})

const confirmPassword = ref<string>()
</script>

<template>
  <ASpin :loading="submitting" class="!block">
    <AForm v-bind="attrs" class="sm:max-w-lg">
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
        field="confirmPassword"
        :label="$t('common.confirmPassword')"
        :rules="[
          { validator: (value, cb) => {
            if (confirmPassword !== model.password) cb($t('validation.passwordRepeat'))
            else cb()
          } },
        ]"
      >
        <AInputPassword
          v-model="confirmPassword"
          :placeholder="$t('common.confirmPassword')"
        >
          {{ $t('common.confirmPassword') }}
        </AInputPassword>
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
    <AModal
      v-model:visible="displayLogout"
      hide-cancel simple :title="$t('glossary.sessionExpired')"
      @close="auth.logout()"
    />
  </ASpin>
</template>
