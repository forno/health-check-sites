import fetch from 'node-fetch'

const targets = process.env.TARGETS.split(',')
const webhookurl = process.env.WEBHOOK_URL

/**
 * A Lambda function that check health of some sites
 */
export const healthCheckSites = async () => {
  await Promise.all(targets.map(async (target) =>
    fetch(target).catch(e =>
      fetch(
        webhookurl,
        {
          method: 'post',
          body: JSON.stringify({ text: `Error: url; ${target} detail: ${e}` })
        })
    )
  ))
}
