export const isID = value => {
  const pattern = /^[0-9a-zA-Z_]{6,20}$/
  return pattern.test(value)
}
