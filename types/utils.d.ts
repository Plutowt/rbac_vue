declare global {

  export type UnPackArray<T> = T extends Array<infer R> ? R : T

  export type RequiredKeys<T, KT extends keyof T> = Omit<T, KT> & Required<Pick<T, KT>>

  export type Optional<T> = { [K in keyof T]?: T[K] | null }

  type GetFirstArgument<T> = T extends (...args: any) => any ? Exclude<Parameters<T>[0], undefined> : never

  type MaybeIterable<T = any> = Iterable<T> | AsyncIterable<T>

  type UnVueMaybeRef<
    T = any,
    ExcludeUndefined extends boolean = true,
  > = T extends MaybeRef<infer V>
    ? ExcludeUndefined extends true
      ? Exclude<V, undefined>
      : V
    : never
}

export {}
