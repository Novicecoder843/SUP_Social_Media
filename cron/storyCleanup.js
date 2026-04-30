const cron = require("node-cron");

const db = require("../config/db");

cron.schedule(

    "0 * * * *",

    async () => {

        try {

            const result =
                await db.query(

                    `
                    DELETE FROM user_schema.stories

                    WHERE expires_at < NOW()
                    `
                );

            console.log(
                "Expired stories deleted:",
                result.rowCount
            );

        } catch (err) {

            console.log(err.message);
        }
    }
);