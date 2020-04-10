'use strict'

let qs = require('querystring')

const { Client } = require('pg');
const client = new Client();
client
  .connect()
  .then(() => console.log('connected'))
  .catch((err) => console.error('connection error', err.stack))

module.exports.handler = async event => {
  const body = qs.parse(event.body)
  const accountNumber = body.text
  
  const fetchBalanceQuery = {
    name: 'fetch-balance-query',
    text: 'SELECT sum(amount) as total FROM account_activity WHERE account_number = $1',
    values: [accountNumber]
  }
  
  const result = {
    'statusCode': 200,
    'headers': {'Content-Type': 'application/json'}
  }
  const slackBody = {
    'blocks': [{
      'type': 'section',
      'text': {
        'type': 'mrkdwn',
        'text': ''
      }
    }]
  }
  try {
    const query = await client.query(fetchBalanceQuery);
    const balanceAccount = query.rows[0];
    
    if (balanceAccount && balanceAccount.total) {
      slackBody.blocks[0].text.text = ':moneybag: Total balance R$'+ balanceAccount.total + ' for account number ' + accountNumber
    } else {
      slackBody.blocks[0].text.text = ':see_no_evil: Ops, account not found'
    }
  } catch (error) {
    console.error(error.stack)
    slackBody.blocks[0].text.text = ':scream: Sorry, something terrible happened'
  }

  result.body = JSON.stringify(slackBody)
  return result;
};
