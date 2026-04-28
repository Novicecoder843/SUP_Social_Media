const cron = require("node-cron");
const pool = require("../config/db");

cron.schedule("0 * * * *", async () => {
  await pool.query(
    "DELETE FROM stories WHERE expires_at < NOW()"
  );
});