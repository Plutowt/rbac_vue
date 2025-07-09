import type { FieldRule } from '@arco-design/web-vue'
import type { Paths } from 'type-fest'

export interface UIFormItemProps<T, Field = Paths<T>> {
  /** 字段名 */
  field?: Field
  /**
   * 是否自动处理 label, 如果是的话，相当于使用 t(`common.${field}`)
   * 此外如果表单项支持 placeholder, 也会创建相应的 t(`common.placeholderInput`, { value: t(`common.${field}`) })
   */
  autoLabel?: boolean
  /**
   * 覆盖 autoLabel 的值
   */
  label?: string
  placeholder?: string
  /** 表单项类型 */
  type: 'input' | 'input-password' | 'input-phonenumber' | 'switch' | 'select' | 'textarea'
  /** 规则集 */
  rules?: FieldRule | FieldRule[]
  /** 匹配模板, 会传给创建相应规则的表单项 */
  pattern?: RegExp
  /** 最短长度, 会传给 input/textarea 并创建相应规则的表单项 */
  minLength?: number
  /** 最大长度, 会传给 input/textarea 并创建相应规则的表单项 */
  maxLength?: number
  /** 是否隐藏星号 */
  hideAsterisk?: boolean
  /** 是否禁用此项 */
  disabled?: boolean
  /** 没指定 field 时, 会使用这个作为展示值传入表单项 */
  visibleValue?: unknown
}

export interface UIFormProps<T> {
  items?: (UIFormItemProps<T> & { slotName?: string })[]
}
