'use strict'

const { Client } = require('pg');
const client = new Client();
client
  .connect()
  .then(() => console.log('connected'))
  .catch((err) => console.error('connection error', err.stack))

module.exports.handler = async event => {
  const accountNumber = event.pathParameters.proxy
  
  const query = {
    name: 'fetch-account-sumary',
    text: 'SELECT sum(amount) as total FROM account_activity WHERE account_number = $1',
    values: [accountNumber]
  }
  
  try {
    const result = await client.query(query);
    const balanceAccount = result.rows[0];
    if (balanceAccount && balanceAccount.total) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(balanceAccount)
      }
    } else {
      return {
        statusCode: 404
      }  
    }
  } catch (error) {
    console.error(error.stack)
    return {
      statusCode: 500
    }
  }

};
