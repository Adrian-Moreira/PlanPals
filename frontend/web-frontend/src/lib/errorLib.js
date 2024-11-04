export function onError(error) {
  let message = String(error)

  if (!(error instanceof Error) && error.message) {
    message = String(error.message)
    console.log(message)
  }

  // alert(message)
}
