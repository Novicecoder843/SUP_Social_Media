module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues.map(e => ({
        field: e.path[0],
        message: e.message
      }))
    });
  }

  next();
};