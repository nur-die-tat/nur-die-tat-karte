export function curry (fn, ...staticArgs) {
  return (...dynamicArgs) => {
    return fn(...staticArgs, ...dynamicArgs)
  }
}
