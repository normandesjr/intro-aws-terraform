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

  let text;
  try {
    const query = await client.query(fetchBalanceQuery);
    const balanceAccount = query.rows[0];
    
    if (balanceAccount && balanceAccount.total) {
      text = ':moneybag: Total balance R$'+ balanceAccount.total + ' for account number ' + accountNumber
    } else {
      text = ':see_no_evil: Ops, account not found'
    }
  } catch (error) {
    console.error(error.stack)
    text = ':scream: Sorry, something terrible happened'
  }

  return {
    'statusCode': 200,
    'headers': {'Content-Type': 'application/json'},
    'body': JSON.stringify({'blocks': [{
      'type': 'section',
      'text': {
        'type': 'mrkdwn',
        'text': text
      }
    }]})
  }
};
