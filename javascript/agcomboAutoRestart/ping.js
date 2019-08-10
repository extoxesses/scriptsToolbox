'use strict'

const request = require('request')


async function ping(url) {
  const startDate = new Date();
  return await new Promise((resolve, reject) => {
    request.get({
      url,
      method: 'GET',
    }, function (error, response, body) {
      if (response){
        resolve(response.statusCode)
      } else {
        reject()
      }
    })
  }).then((response) => {
    return (new Date()) - startDate.getTime()
  }).catch(() => {
    return undefined
  })
}

async function pingCLI(url) {
  return await ping(url).then((response) => {
    return response
      ? `${url} responses in ${response} ms`
      : `${url}: Destination Host Unreachable`
  })
}


module.exports = {
  ping,
  pingCLI
}
