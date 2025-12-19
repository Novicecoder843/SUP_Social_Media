const express = require("express");
const pool = require("./db");

async function getUsers() {
  try {
    const result = await pool.query(
      "SELECT * FROM user_schema.users"
    );

    console.log("Users List:");
    console.table(result.rows);
  } catch (error) {
    console.error("Database Error:", error.message);
  } finally {
    pool.end();
  }
}

getUsers();
