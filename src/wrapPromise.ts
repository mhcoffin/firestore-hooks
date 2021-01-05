export const wrapPromise = <T>(promise: Promise<T>) => {
  let result: T
  let error: Error
  let status: 'pending' | 'done' | 'error' = 'pending'

  const suspender = promise
    .then(
      (r) => {
        status = 'done'
        result = r
      },
      (err) => {
        status = 'error'
        error = err
      })

  const read = (): T => {
    switch (status) {
      case 'pending':
        throw suspender
      case 'error':
        throw error
      default:
        return result
    }
  }
  return {read}
}