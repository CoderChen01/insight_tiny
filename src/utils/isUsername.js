let isUsername = function (val) {
  const pattern = /^[a-zA-Z1-9][a-zA-Z0-9_]{6,16}$/
  let res = pattern.test(val)
  if(res) {
    return {
      result: '验证通过',
      status: true
    }
  }
  return {
    result: '用户名是以字母或非 0 数字开头的 6 到 16 个字母、数字或下划线',
    status: false
  }
}


export default isUsername