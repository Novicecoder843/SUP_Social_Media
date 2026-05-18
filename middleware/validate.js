module.exports = (schema) => {
  return (req, res, next) => {
    try {
        console.log(req.body, "body");

      schema.parse(req.body);

      next();
    } catch (error) {
        console.log(error);
        
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }
  };
};