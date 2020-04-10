'use strict'

const { Client } = require('pg');
const client = new Client();
client.connect();

module.exports.handler = async event => {
  console.log('####### yeahhh!')
  await client.end();

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
