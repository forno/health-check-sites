import fetch from 'node-fetch'

const targets = process.env.TARGETS.split(',')
const webhookurl = process.env.WEBHOOK_URL

/**
 * A Lambda function that check health of some sites
 */
export const healthCheckLambda = async (event, context) => {
  console.debug(event, targets, webhookurl)
  targets.map(async (target) => {
    await fetch(webhookurl, {method: 'post', body: JSON.stringify({text: target})})
  })
}
