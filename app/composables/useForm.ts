import type { FormInstance, ValidatedError, ValidateStatus } from '@arco-design/web-vue'
import type { Paths } from 'type-fest'
import type { Reactive, WatchCallback } from 'vue'
import { cloneDeep } from 'es-toolkit'
import { FetchError } from 'ofetch'

export function useArcoForm<T extends object>(
  options: {
    default?: Partial<T>
    onChange?: WatchCallback<Reactive<Partial<T>>, Reactive<Partial<T>>>
    onSubmitSuccess?: (values: T, ev: Event) => Promise<any> | any
    onSubmitFailed?: ((data: {
      values: T
      errors: Record<string, ValidatedError>
    }, ev: Event) => any)
    onSubmitError?: (error: FetchError) => void | Promise<void>
  },
) {
  const model = reactive<Partial<T>>(cloneDeep(options.default) ?? {})
  if (options.onChange)
    watch(model, options.onChange)

  const submitting = ref(false)

  const el: Ref<FormInstance | undefined> = ref()

  function reset() {
    el.value?.resetFields()
  }

  async function onSubmitSuccess(values: T, ev: Event) {
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

  function setField(field: Paths<T>, opts: {
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
