// module.exports = (schema) => {
//   return (req, res, next) => {
//     try {
//         console.log(req.body, "body");

//       schema.parse(req.query);

//       next();
//     } catch (error) {
//         console.log(error);
        
//       return res.status(400).json({
//         success: false,
//         message: "Validation failed",
//         errors: error.issues.map((err) => ({
//           field: err.path[0],
//           message: err.message,
//         })),
//       });
//     }
//   };
// };
const validate = (schema) => {
  return (req, res, next) => {
    try {

      // MERGE BODY + PARAMS + QUERY
      const data = {
        ...req.body,
        ...req.params,
        ...req.query,
      };

      schema.parse(data);

      next();

    } catch (error) {
      console.log(error);

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors || error,
      });
    }
  };
};

module.exports = validate;