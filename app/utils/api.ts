// 提取分页结果
type _Result<T> = UnVueMaybeRef<T> extends MaybeRef<{
  data?: { results: (infer DataResultsItem)[] }
}>
  ? DataResultsItem
  : T extends {
    results: (infer DataResultsItem)[]
  } ? DataResultsItem : T extends Array<infer I> ? I : T

export type APIResult<T> = T extends (...params: any) => Promise<infer Res> ? _Result<Res> : _Result<T>

type _PageResult<T> = T extends MaybeRef<{ data: Exclude<{ results: (infer I)[] }, undefined> }>
  ? I
  : T extends MaybeRef<{ results: (infer I)[] } | undefined>
    ? I
    : T extends MaybeRef<(infer I)[]>
      ? I
      : never

export type APIPageResult<T> = T extends (...params: any) => Promise<infer Res> ? _PageResult<Res> : _PageResult<T>

export function getApiPageData<T>(v: { data?: T }): T | undefined {
  return v.data
}
