const express = require("express");
const router = express.Router();
const { createRole, getRoles } = require("../controller/role.controller");

router.post("/createrole", createRole);
router.get("/getroles", getRoles);

module.exports = router;