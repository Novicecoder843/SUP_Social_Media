const pool = require("../db/db");

const onlineUsers = new Map();

module.exports = (io) => {

    io.on("connection", (socket) => {

        console.log("User Connected:", socket.id);

        // JOIN
        socket.on("join", (userId) => {

            socket.userId = userId;

            onlineUsers.set(userId, socket.id);

            socket.join(userId);

            console.log(`User ${userId} joined`);

            io.emit("online_users", [...onlineUsers.keys()]);
        });

        // SEND MESSAGE
        socket.on("send_message", async (data) => {

            try {

                const { sender_id, receiver_id, message } = data;

                // SAVE MESSAGE
                const result = await pool.query(
                    `
                    INSERT INTO messages
                    (sender_id, receiver_id, message)
                    VALUES ($1,$2,$3)
                    RETURNING *
                    `,
                    [sender_id, receiver_id, message]
                );

                // SEND TO RECEIVER
                io.to(receiver_id.toString()).emit("receive_message", result.rows[0]);

                // ALSO SEND BACK TO SENDER
                io.to(sender_id.toString()).emit("receive_message", result.rows[0]);

            } catch (err) {

                console.log(err);

            }

        });

        socket.on("disconnect", () => {

            onlineUsers.delete(socket.userId);

            io.emit("online_users", [...onlineUsers.keys()]);

            console.log("User Disconnected");

        });

    });

};