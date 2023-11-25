const AWS = require('aws-sdk');

require('dotenv').config(); 
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,  
});

const s3 = new AWS.S3();
const imageUploader = (image) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: image.originalname,
        Body: image.buffer,
        ContentType: 'image/jpeg', 
    };
    
    return s3.upload(params).promise();
}

module.exports = imageUploader;