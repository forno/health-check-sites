import fetch from 'node-fetch'

//! TARGETSはカンマ区切りの検証対象URL
const targets = process.env.TARGETS.split(',')
//! WEBHOOK_URLはSlackのWebhook URL
const webhookurl = process.env.WEBHOOK_URL

/**
 * A Lambda function that check health of some sites
 */
export const healthCheckSites = async () => {
  await Promise.all(targets.map(async (target) => // 全てのURLに対して
    fetch(target).catch(e => // GETを送信して問題があれば
      fetch( // slackに通知を送信する
        webhookurl,
        {
          method: 'post',
          body: JSON.stringify({ text: `Error: url; ${target} detail: ${e}` })
        })
    )
  ))
}
