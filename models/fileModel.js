const db = require("../config/db");

exports.saveFile = async (file) => {
    const query = `
    INSERT INTO files (filename, filepath, mimetype, size)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `;
   const values = [
    file.filename,
    file.path,
    file.mimetype,
    file.size,
   ];

   const result = await db.query(query, values);
   return result.rows[0];
};