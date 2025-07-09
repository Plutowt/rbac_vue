export default defineI18nConfig(() => ({
  fallbackLocale: 'EN',
  datetimeFormats: {
    EN: {
      mini: {
        month: '2-digit',
        day: '2-digit',
      },
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
    CN: {
      mini: {
        month: '2-digit',
        day: '2-digit',
      },
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        // weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        second: '2-digit',
      },
    },
  },
}),
)
