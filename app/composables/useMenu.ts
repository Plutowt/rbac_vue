export function useMenu() {
  const visible = useState<boolean>('visible-menu', () => false)
  function toggleVisible(force?: boolean) {
    visible.value = force !== undefined ? force : !visible.value
  }

  return { visible, toggleVisible }
}
