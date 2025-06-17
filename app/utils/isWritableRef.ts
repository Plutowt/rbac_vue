import type { Ref, WritableComputedRef } from 'vue'
import { isReadonly, isRef } from 'vue'

type Result<T> = Ref<T> | WritableComputedRef<T>

export default function isWritableRef<T>(
  value: Result<T> | unknown,
): value is Result<T> {
  return isRef(value) && !isReadonly(value)
}
