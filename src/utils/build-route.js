export function buildRoute(path) {
  const paramsRegex = /:(\w+)/g
  const pathWithParams = path.replace(paramsRegex, "(?<$1>[a-zA-Z0-9\-_]+)")
  return new RegExp(`^${pathWithParams}(?<query>/\?(.*))?$`)
}