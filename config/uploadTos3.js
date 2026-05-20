const fs = require("fs");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("./s3");

const uploadToS3 = async (filePath, fileName, mimetype) => {
  try {

    const fileContent = fs.readFileSync(filePath);

    // unique key
    const key = `images/${Date.now()}-${fileName}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    console.log("Uploaded:", key);

    // return full s3 url
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  } catch (error) {
    console.log("S3 Upload Error:", error);
    throw error;
  }
};

module.exports = uploadToS3;