const fs = require("fs");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("./s3");

const uploadToS3 = async (filePath, fileName) => {
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
  };

  await s3.send(new PutObjectCommand(params));

  console.log("Uploaded:", fileName);
};

module.exports = uploadToS3;