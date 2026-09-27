export function getNestedValue(source, path) {
  return path
    .split('.')
    .reduce((value, key) => (value && typeof value === 'object' ? value[key] : undefined), source)
}
