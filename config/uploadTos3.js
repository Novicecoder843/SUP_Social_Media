const fs = require("fs");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("./s3");

const uploadToS3 = async (filePath, fileName) => {
  try {
    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `images/${fileName}`,
      Body: fileContent,
      ContentType: "image/jpeg",
    };

    await s3.send(new PutObjectCommand(params));

    console.log("Uploaded:", `images/${fileName}`);

    return `images/${fileName}`;
  } catch (error) {
    console.log("S3 Upload Error:", error);
    throw error;
  }
};

module.exports = uploadToS3;