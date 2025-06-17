<template>
  <div>
    <ATypographyTitle :heading="1">
      403
    </ATypographyTitle>
    <ATypographyTitle :heading="2">
      {{ $t('validation.permissionForbiddenDetail') }}
    </ATypographyTitle>

    <AButton type="primary" class="mt-8" @click="$router.go(-2)">
      {{ $t('common.return') }}
    </AButton>
  </div>
</template>
