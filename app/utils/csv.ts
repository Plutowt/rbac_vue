export function exportCSV(options: {
  header: string[]
  data: any[][]
  filename: string
}) {
  const header = options.header
  const csv = [header, ...options.data].map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = options.filename
  a.click()
  URL.revokeObjectURL(url)
}
