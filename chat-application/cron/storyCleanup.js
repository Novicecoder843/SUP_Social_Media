const cron = require("node-cron");
const db = require("../config/db");

cron.schedule(
  "0 * * * *", // Every hour

  async () => {
    try {

      const result = await db.query(`
        DELETE FROM stories
        WHERE expires_at <= NOW()
      `);

      console.log(
        `🗑 Expired stories deleted: ${result.rowCount}`
      );

    } catch (err) {

      console.log(
        "❌ Story Cleanup Error:",
        err.message
      );
    }
  }
);