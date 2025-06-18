export function title(value: string) {
  return value.length ? value.split(' ').map(i => i[0]?.toUpperCase() + i.slice(1)).join(' ') : ''
}
