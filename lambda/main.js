'use strict'

const { Client } = require('pg');
const client = new Client();
client
  .connect()
  .then(() => console.log('connected'))
  .catch((err) => console.error('connection error', err.stack))

module.exports.handler = async event => {
  const accountNumber = event.pathParameters.proxy
  
  const fetchBalanceQuery = {
    name: 'fetch-balance-query',
    text: 'SELECT sum(amount) as total FROM account_activity WHERE account_number = $1',
    values: [accountNumber]
  }
  
  const result = {};
  try {
    const query = await client.query(fetchBalanceQuery);
    const balanceAccount = query.rows[0];

    if (balanceAccount && balanceAccount.total) {
      result.statusCode = 200;
      result.headers = {'Content-Type': 'application/json'}
      result.body = JSON.stringify(balanceAccount)
    } else {
      result.statusCode = 404
    }
  } catch (error) {
    console.error(error.stack)
    result.statusCode = 500
  }

  return result;
};
