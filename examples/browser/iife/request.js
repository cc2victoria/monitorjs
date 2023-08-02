console.log(Monitor)
Monitor.start({
  aid: 'pms.zheniaoa.com',
  bt: 'common',
  pf: 'pc',
  sid: 'test sid',
})

// fetch('http://login.zhenaioa.com/login/api/is_login')

// navigator.sendBeacon('http://login.zhenaioa.com/login/api/is_login?1')

// setTimeout(() => {
// runXHR('dgszyjnxcaipwzy.jpg')
// runXHR('http://login-test.zhenaioa.com/login/api/is_login')
// runXHR('https://somewhere.org/i-dont-exist')
// runXHR('/dgszyjnxcaipwzy.jpg').abort();
// }, 1000)

function runXHR(url) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.send()
  return xhr
}

fetch(`http://login-test.zhenaioa.com/login/api/is_login?${Date.now()}`, {
  method: 'GET',
})

Z.ajax({ url: 'http://login-test.zhenaioa.com/login/api/is_login', type: 'GET' })
Z.ajax({
  url: 'http://login-test.zhenaioa.com/login/api/is_login',
  type: 'POST',
  data: {
    name: 'yanjiao',
  },
})
