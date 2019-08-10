'use strict'

const { agcomboRestart } = require('./timlib.js')
const { ping } = require('./ping.js')

const GOOGLE = 'http://www.google.com'
const DEFAULT_TIMES = 5


async function main (username, password, times) {
  let millis = 0, count = 0
  for (let i = 0; i < times; i++) {
    await ping(GOOGLE).then((response) => {
      if (response) {
        millis = millis + response
        count++
      }
    })
  }
  const latency = millis/count
  const lostPackets = times - count

  if (!latency || (lostPackets > 0.2 * times)) {
    agcomboRestart(username, password)
      .then(response => {
        console.log(`AgCombo router reponse ${response}`)
      })
  }
}


const user = process.argv[2]
const pwd = process.argv[3]
const times = process.argv[4] ? process.argv[4] : DEFAULT_TIMES
main(user, pwd, times)
