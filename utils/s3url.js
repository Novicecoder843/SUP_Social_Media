exports.getImageUrl = (path) => {
  if (!path) return null;

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${path}`;
};
