'use strict'

const { Client } = require('pg');
const client = new Client();
client
  .connect()
  .then(() => console.log('connected'))
  .catch((err) => console.error('connection error', err.stack))

module.exports.handler = async event => {
  console.log('####### yeahhh!!')
  
  const accountNumber = '1111';
  const query = {
    name: 'fetch-account-sumary',
    text: 'SELECT sum(amount) as total FROM account_activity WHERE account_number = $1',
    values: [accountNumber]
  }
  
  await client
    .query(query)
    .then(result => console.log(result.rows))
    .catch(e => console.error(e.stack))

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
};
