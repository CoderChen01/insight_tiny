export const isURL = value => {
  const pattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'*+,;=]+$/
  return pattern.test(value)
}
