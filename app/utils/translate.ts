export function translateReceiveSMSMessage(code: ApiV1SMSStatusCode) {
  const { $i18n } = useNuxtApp()
  const { t } = $i18n
  let result: string | undefined
  switch (code) {
    case ApiV1SMSStatusCode.TEMPORARY_NO_NUMBER:
      result = t('common.receiveSmsErrorCode.TEMPORARY_NO_NUMBER')
      break
    case ApiV1SMSStatusCode.TOKEN_NOT_EXIST:
      result = t('common.receiveSmsErrorCode.TOKEN_NOT_EXIST')
      break
    case ApiV1SMSStatusCode.PROJECT_ID_NOT_EXIST:
      result = t('common.receiveSmsErrorCode.PROJECT_ID_NOT_EXIST')
      break
    case ApiV1SMSStatusCode.COUNTRY_CODE_ERROR:
      result = t('common.receiveSmsErrorCode.COUNTRY_CODE_ERROR')
      break
    case ApiV1SMSStatusCode.PROJECT_UNAPPROVED:
      result = t('common.receiveSmsErrorCode.PROJECT_UNAPPROVED')
      break
    case ApiV1SMSStatusCode.PROJECT_DISABLED:
      result = t('common.receiveSmsErrorCode.PROJECT_DISABLED')
      break
    case ApiV1SMSStatusCode.USER_DISABLED:
      result = t('common.receiveSmsErrorCode.USER_DISABLED')
      break
    case ApiV1SMSStatusCode.INSUFFICIENT_BALANCE:
      result = t('common.receiveSmsErrorCode.INSUFFICIENT_BALANCE')
      break
    case ApiV1SMSStatusCode.TOO_MANY_NUMBERS_OCCUPIED:
      result = t('common.receiveSmsErrorCode.TOO_MANY_NUMBERS_OCCUPIED')
      break
    case ApiV1SMSStatusCode.PROJECT_CANNOT_SPECIFY_NUMBER:
      result = t('common.receiveSmsErrorCode.PROJECT_CANNOT_SPECIFY_NUMBER')
      break
    case ApiV1SMSStatusCode.INVALID_NUMBER_OF_NUMBERS_REQUESTED:
      result = t('common.receiveSmsErrorCode.INVALID_NUMBER_OF_NUMBERS_REQUESTED')
      break
    case ApiV1SMSStatusCode.REQUEST_RATE_TOO_HIGH:
      result = t('common.receiveSmsErrorCode.REQUEST_RATE_TOO_HIGH')
      break
    case ApiV1SMSStatusCode.INTERNAL_SERVER_ERROR:
      result = t('common.receiveSmsErrorCode.INTERNAL_SERVER_ERROR')
      break
    case ApiV1SMSStatusCode.INSUFFICIENT_CARDS:
      result = t('common.receiveSmsErrorCode.INSUFFICIENT_CARDS')
      break
    case ApiV1SMSStatusCode.NO_AVAILABLE_NUMBERS:
      result = t('common.receiveSmsErrorCode.NO_AVAILABLE_NUMBERS')
      break
    default:
      break
  }
  return result
}
