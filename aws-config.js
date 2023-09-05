// aws-config.js

const AWS = require('aws-sdk');

// Configure AWS SDK with your credentials
AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: 'us-east-1', // Specify your desired AWS region
});

module.exports = AWS;
