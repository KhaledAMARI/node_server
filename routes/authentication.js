const express = require("express");
const router = express.Router();

const authenticateUser = require("../Middlewares/auth");

const {
  register,
  confirmMail,
  login,
  changePWDRequest,
  isConfirmationTokenValid,
  resetPWD,
  savePhoneNumber,
} = require("../Controllers/authentication");

router.post("/register", register);
router.post("/confirm_email", authenticateUser, confirmMail);
router.post("/login", login);
router.post("/change-pwd-request", changePWDRequest);
router.post("/valid-resetPWD-token", isConfirmationTokenValid);
router.post("/reset-account-password", authenticateUser, resetPWD);
router.post("/save-phone-number", authenticateUser, savePhoneNumber);

module.exports = router;