const express = require ("express");
const {register, login, getCurrentUser } = require("../controllers/authController");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/current", authenticateUser, getCurrentUser);


module.exports = router;