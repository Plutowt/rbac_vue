export function useAppSettings() {
  const isLocaleTimezone = useLocalStorage('locale-time', false)

  return {
    localeTimezone: {
      is: isLocaleTimezone,
      transform: (v: string | Date | number) => {
        return isLocaleTimezone.value ? toLocalDate(v) : new Date(v)
      },
    },
  }
}
