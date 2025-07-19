import type { FormInstance, ValidatedError, ValidateStatus } from '@arco-design/web-vue'
import type { Paths } from 'type-fest'
import type { Reactive, WatchCallback } from 'vue'
import { cloneDeep } from 'es-toolkit'
import { FetchError } from 'ofetch'

export function useArcoForm<
  Req extends ((options: object) => any) | object,
>(
  options: {
    default?: Partial<APIRequestBody<Req>>
    onChange?: WatchCallback<Reactive<Partial<APIRequestBody<Req>>>, Reactive<Partial<APIRequestBody<Req>>>>
    onSubmitSuccess?: (values: APIRequestBody<Req>, ev: Event) => Promise<any> | any
    onSubmitFailed?: ((data: {
      values: APIRequestBody<Req>
      errors: Record<string, ValidatedError>
    }, ev: Event) => any)
    onSubmitError?: (error: FetchError) => void | Promise<void>
  },
) {
  const model = reactive<Partial<APIRequestBody<Req>>>(cloneDeep(options.default) ?? {})
  if (options.onChange)
    watch(model, options.onChange)

  const submitting = ref(false)

  const el: Ref<FormInstance | undefined> = ref()

  function reset() {
    el.value?.resetFields()
  }

  async function onSubmitSuccess(values: APIRequestBody<Req>, ev: Event) {
    if (submitting.value)
      return

    submitting.value = true

    try {
      await options.onSubmitSuccess?.(values, ev)
    }
    catch (error) {
      if (error instanceof FetchError) {
        await options.onSubmitError?.(error)
      }
    }

    submitting.value = false
  }

  const attrs = {
    ref: el,
    model,
    onSubmitSuccess: (onSubmitSuccess as unknown as ((values: Record<string, any>, ev: Event) => any)),
    onSubmitFailed: (options.onSubmitFailed as unknown as () => ((data: {
      values: Record<string, any>
      errors: Record<string, ValidatedError>
    }, ev: Event) => any)),
  }

  function setField(field: Paths<APIRequestBody<Req>>, opts: {
    message: string
    status?: ValidateStatus

  }) {
    el.value?.setFields(Object.fromEntries([[field, opts]]))
  }

  return {
    attrs,
    model,
    el,
    onSubmitSuccess: attrs.onSubmitSuccess,
    submitting,
    reset,
    setField,
  }
}

type APIRequestBody<T> = T extends (options: infer Options) => any
  ? Options extends { body: infer BodyData } ? BodyData : T
  : T
