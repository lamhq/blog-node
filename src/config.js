const config = {
  appName: 'Rest Boilerplate',
  appSecret: 'react blog secret',
  port: process.env.PORT || 3000,
  accessTokenLifeTime: '3h',
  webUrl: process.env.WEB_URL,
  db: {
    uri: process.env.DB_URI,
    debug: process.env.MONGOOSE_DEBUG === 'true',
  },
  mail: {
    transport: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PWD,
      },
    },
    autoEmail: 'noreply@demo.com',
  },
  awsConfig: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_BUCKET,
    websiteEndpoint: process.env.AWS_BUCKET_ENDPOINT,
    objectKeyPrefix: 'upload/',
  },
};

module.exports = config;
