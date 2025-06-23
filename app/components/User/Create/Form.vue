<script setup lang="ts">
import type { APICreateUserParams } from '~/api/v1/users'

const { model, attrs } = useForm<APICreateUserParams['body']>({
  onSubmitSuccess: (_values) => {

  },
})
</script>

<template>
  <AForm v-bind="attrs">
    <AFormItem field="nickname">
      <AInputPassword v-model="model.nickname" />
    </AFormItem>
    <AFormItem field="username">
      <AInput v-model="model.username" />
    </AFormItem>
    <AFormItem field="email">
      <AInput v-model="model.email" />
    </AFormItem>
    <AFormItem field="isActive">
      <!-- <AInput v-model="model.isActive" /> -->
    </AFormItem>
    <AFormItem field="password">
      <AInputPassword v-model="model.password" />
    </AFormItem>
    <AFormItem field="roles">
      <AInputPassword v-model="model.roles" />
    </AFormItem>
    <AFormItem field="phoneNumber">
      <AInputPassword v-model="model.phoneNumber" />
    </AFormItem>
    <AFormItem field="locale">
      <!-- TODO: 應該是選項 -->
      <AInputPassword v-model="model.locale" />
    </AFormItem>
    <AFormItem field="zoneinfo">
      <!-- TODO: 應該是選項 -->
      <AInputPassword v-model="model.zoneinfo" />
    </AFormItem>
    <AFormItem field="bio">
      <!-- TODO: 應該是選項 -->
      <AInputPassword v-model="model.bio" />
    </AFormItem>
  </AForm>
</template>
