import fetch from 'node-fetch'
import { AbortController } from 'node-abort-controller'

//! TARGETSはカンマ区切りの検証対象URL
const targets = process.env.TARGETS.split(',')
//! WEBHOOK_URLはSlackのWebhook URL
const webhookurl = process.env.WEBHOOK_URL

const send2Slack = async text => fetch(webhookurl, {
  method: 'post',
  body: JSON.stringify({ text })
})

/**
 * A Lambda function that check health of some sites
 */
export const healthCheckSites = async () => {
  await send2Slack(`health-check-sites: On invoked, I show targets list
${targets.join('\n')}`)
  const controller = new AbortController()
  const signal = controller.signal
  await Promise.all([
    setTimeout(() => controller.abort(), 500), // timeoutの設定
    Promise.all(targets.map(async (target) => // 全てのURLに対して
      fetch(target, { signal }).catch(e => // GETを送信して問題があれば
        send2Slack(`<!here> Error: url; ${target} detail; ${e}`) // slackに通知する
      )
    ))
  ])
  return {success: true}
}
