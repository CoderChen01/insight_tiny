const isEmail = function (val) {
  let pattern = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
  let domains= [
    'qq.com',
    '163.com',
    'vip.163.com',
    '263.net',
    'yeah.net',
    'sohu.com',
    'sina.cn',
    'sina.com',
    'eyou.com',
    'gmail.com',
    'hotmail.com',
    '42du.cn'
  ]
  if(pattern.test(val)) {
    let domain = val.substring(val.indexOf('@')+1)
    for(let i = 0; i< domains.length; i++) {
      if(domain === domains[i]) {
        return {
          result: '验证通过',
          status: true
        }
      }
    }
    return {
      result: '暂时不支持该邮箱',
      status: false
    }
  }
  return {
    result: '邮箱格式错误',
    status: false
  }
}

export default isEmail