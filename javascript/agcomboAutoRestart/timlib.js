'use strict'

const sjcl = require('sjcl')
const request = require('request');

const GATEWAY = 'http://192.168.1.1'


/// --- Tool functions ---------

/**
 * This is the encription used by router to perform user login
 * @param {String} pwd User password
 * @param {String} challenge Router response challenge
 */
function encrypt (pwd, challenge) {
  const hashed = pwd + challenge
  return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(hashed))
}

function getLoginHeader () {
  return {
    Connection: 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

function getSessionIdHeader(username, sessionId) {
  return {
    Connection: 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    Cookie: `username=${username}; session_id=${sessionId}`,
    DNT: 1
  }
}


/// --- Network functions ---------

async function getChallenge (url) {
  let res
  await new Promise((resolve, reject) => {
    request.get(url, function (error, response, body) {
      if (!response || response.statusCode !== 200) { reject(error) }
      resolve(body)
    })
  }).then((response) => {
      res = response
  })

  return JSON.parse(res)[0].challenge
}

async function login(url, header, form) {
  let res
  await new Promise((resolve, reject) => {
    request.post({
      url,
      form,
      header
    }, function (error, response, body) {
      if (response.statusCode !== 200 && body !== '1') { reject(error) }
      
      const sessionId = response.headers['set-cookie'][0].split(';')[0].split('=')[1]
      resolve(sessionId)
    })
  }).then((response) => {
    res = response
  })

  return res
}

async function getToken (url, headers) {
  let res
  await new Promise((resolve, reject) => {
    request.get({
        url,
        method: 'GET',
        headers,
    }, function (error, response, body) {
      if (response.statusCode !== 200) { reject(error) }
      resolve(body)
    })
  }).then((response) => {
      res = response
  })

  return res
}

async function restart(url, randomToken, token, headers) {
  let res
  await new Promise((resolve, reject) => {
    request.post({
      url,
      qs: {
        '_': randomToken,
        'csrf_token': token
      },
      form: { 'restart_device': 1 },
      headers: headers
    }, function (error, response, body) {
      if (response.statusCode !== 200) { reject(error) }
      resolve(body)
    })
  }).then((response) => {
    res = response
  })

  return res
}


/// --- Script ---------

async function agcomboRestart (username, pwd) {
  // 1. Get challenge
  const challenge = await getChallenge(`${GATEWAY}/data/login.json`)
  const hashed = encrypt(pwd, challenge)

  // 2. Login
  const form = {
    LoginName: username,
    LoginPWD: hashed,
  }
  const sessionId = await login(`${GATEWAY}/data/login.json`, getLoginHeader(), form)

  // 3. Get overview.html page to get a valid token
  const html = await getToken(`${GATEWAY}/overview.html`, getSessionIdHeader(username, sessionId))
  const init = html.search('csrf_token')
  const token = html.substr(init + 14, 20)

  // 4. Restart router
  const randomToken = Math.floor(Math.random() * 10000000000000)
  const restartUrl = `${GATEWAY}/data/statussupportrestart.json`
  return restart(restartUrl, randomToken, token, getSessionIdHeader(username, sessionId))
}


module.exports = {
  agcomboRestart,
}
