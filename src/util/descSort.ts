export default function descSort<T>(arr: T[], key: keyof T) {
  return arr.sort((a, b) => (a[key] < b[key] ? 1 : -1));
}
