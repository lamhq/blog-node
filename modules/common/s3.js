const cryptoJs = require('crypto-js');
const { awsConfig } = require('../../config');

const defOptions = {
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  bucket: awsConfig.bucket,
  region: awsConfig.region,
  keyPrefix: awsConfig.objectKeyPrefix,
  websiteEndpoint: awsConfig.websiteEndpoint,
  service: 's3',
  duration: 10, // minutes
  // expiration: '2018-12-12T00:00:00.000Z',
  // date: '20181212',
};

function getStringToSign(params) {
  const {
    bucket,
    accessKeyId,
    region,
    service,
    expiration,
    date,
    keyPrefix,
  } = params;
  const policy = {
    expiration,
    conditions: [
      { bucket },
      { success_action_status: '200' },
      ['starts-with', '$key', keyPrefix],
      { acl: 'public-read' },
      ['starts-with', '$Content-Type', 'image/'],
      { 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
      { 'x-amz-credential': `${accessKeyId}/${date}/${region}/${service}/aws4_request` },
      { 'x-amz-date': `${date}T000000Z` },
    ],
  };
  return Buffer.from(JSON.stringify(policy), 'utf-8').toString('base64');
}

function getSignature(params) {
  const {
    region,
    service,
    secretAccessKey,
    date,
  } = params;
  const base64Policy = getStringToSign(params);
  const dateKey = cryptoJs.HmacSHA256(date, `AWS4${secretAccessKey}`);
  const regionKey = cryptoJs.HmacSHA256(region, dateKey);
  const serviceKey = cryptoJs.HmacSHA256(service, regionKey);
  const signatureKey = cryptoJs.HmacSHA256('aws4_request', serviceKey);
  return cryptoJs.HmacSHA256(base64Policy, signatureKey).toString(cryptoJs.enc.Hex);
}

/**
 * get form params for uploading to s3 using http post
 * https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-post-example.html
 */
function getUploadParams() {
  const {
    accessKeyId,
    region,
    service,
    duration,
    keyPrefix,
    bucket,
  } = defOptions;
  const expireAt = new Date();
  expireAt.setMinutes(expireAt.getMinutes() + duration);
  const date = expireAt.toISOString().substr(0, 10).replace(/-/g, '');

  const params = {
    ...defOptions,
    expiration: expireAt.toISOString(),
    date,
    keyPrefix,
    'x-amz-date': `${date}T000000Z`,
    'x-amz-credential': `${accessKeyId}/${date}/${region}/${service}/aws4_request`,
  };

  // convert the link from https to http because s3 static web host does not support https
  const fileUrl = `${params.websiteEndpoint}/${params.keyPrefix}{filename}`.replace('https', 'http');

  return {
    uploadUrl: `https://${bucket}.s3.amazonaws.com/`,
    fileUrl,
    key: `${params.keyPrefix}{filename}`,
    acl: 'public-read',
    success_action_status: '200',
    policy: getStringToSign(params),
    'x-amz-signature': getSignature(params),
    'x-amz-credential': params['x-amz-credential'],
    'x-amz-date': params['x-amz-date'],
    'x-amz-algorithm': 'AWS4-HMAC-SHA256',
  };
}

module.exports = {
  getUploadParams,
};
