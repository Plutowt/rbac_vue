<script setup lang="ts">
import { me, type MeUpdate } from '~/api/v1/users'

const auth = useAuth()

const { attrs, model, el, submitting } = useForm<MeUpdate>({
  default: {
    nickname: auth.info?.nickname,
    username: auth.info?.username,
    email: auth.info?.email,
    bio: auth.info?.bio,
  },
  async onSubmitSuccess(values) {
    const data = diff(auth.info!, values)
    if (data) {
      await useApi(() => me.update(data)).fetcher()
    }
  },
})
</script>

<template>
  <ASpin :loading="submitting" class="!block">
    <AForm v-bind="attrs" class="sm:max-w-lg">
      <AFormItem
        field="username" :label="$t('common.username')"
        :rules="[
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
        field="bio" :label="$t('common.bio')"
        :rules="[
          { maxLength: 1024, message: $t('validation.string.max', { max: 1024 }) },
        ]"
      >
        <ATextarea
          v-model="model.bio"
          show-word-limit
          :max-length="1024"
          allow-clear
          :placeholder="$t('common.placeholderItem', { item: $t('common.bio') })"
        />
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
  </ASpin>
</template>
