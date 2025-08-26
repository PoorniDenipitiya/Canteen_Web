const { Signup, Login } = require('../Controllers/AuthController')
const { userVerification } = require('../Middlewares/AuthMiddleware');
const router = require('express').Router()

router.post('/signup', Signup)
router.post('/login', Login)
router.post('/verify-cookie',userVerification)

// Social Login/Signup endpoints
const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");

// Helper to create JWT and set cookie
function setAuthCookie(res, user) {
  const token = jwt.sign({ id: user._id }, process.env.TOKEN_KEY, { expiresIn: "7d" });
  res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
}

const verifyGoogleToken = require("../util/verifyGoogleToken");

// Social Login
router.post("/social-login", async (req, res) => {
  const { provider } = req.body;
  let userInfo;
  try {
    if (provider === "google") {
      // Verify Google token and extract user info
      userInfo = await verifyGoogleToken(req.body.credential);
    } 
    /*else if (provider === "facebook") {
      // Facebook user info comes directly from frontend
      const { email, username, providerId } = req.body;
      if (!email || !providerId) return res.status(400).json({ error: "Missing Facebook login info" });
      userInfo = { email, username, provider: "facebook", providerId };*/
    else {
      return res.status(400).json({ error: "Invalid provider" });
    }
    let user = await User.findOne({ email: userInfo.email });
    if (!user) {
      user = await User.create(userInfo);
    }
    setAuthCookie(res, user);
    res.json({ success: true, message: "Social login successful" });
  } catch (err) {
    res.status(400).json({ success: false, message: "Social login failed. Please try again.", error: err.message });
  }
});

// Social Signup (same as login, but can add extra logic if needed)
router.post("/social-signup", async (req, res) => {
  const { provider } = req.body;
  let userInfo;
  try {
    if (provider === "google") {
      userInfo = await verifyGoogleToken(req.body.credential);
    } /*else if (provider === "facebook") {
      const { email, username, providerId } = req.body;
      if (!email || !providerId) return res.status(400).json({ error: "Missing Facebook signup info" });
      userInfo = { email, username, provider: "facebook", providerId };
    }*/ else {
      return res.status(400).json({ error: "Invalid provider" });
    }
    let user = await User.findOne({ email: userInfo.email });
    if (!user) {
      user = await User.create(userInfo);
    }
    setAuthCookie(res, user);
    res.json({ success: true, message: "Social signup successful" });
  } catch (err) {
    res.status(400).json({ success: false, message: "Social signup failed. Please try again.", error: err.message });
  }
});

module.exports = router
