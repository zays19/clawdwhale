const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;

const app = express();

/* =========================
   STATIC FILES
========================= */
app.use("/public", express.static(path.join(__dirname, "public")));

/* =========================
   SESSION & PASSPORT
========================= */
app.use(session({
  secret: "clawdwhale-secret",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

/* =========================
   TWITTER (X) STRATEGY
========================= */
passport.use(new TwitterStrategy(
  {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  (token, tokenSecret, profile, done) => {
    return done(null, profile);
  }
));

/* =========================
   HOME PAGE
========================= */
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Clawdwhale</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
body {
  margin: 0;
  min-height: 100vh;
  background: linear-gradient(180deg,#ff8a00,#ff4d00);
  font-family: Arial, sans-serif;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  text-align: center;
  max-width: 420px;
  padding: 24px;
}

.logo {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  background: #fff;
  padding: 12px;
  box-shadow:
    0 0 30px rgba(168,85,247,0.6),
    0 0 60px rgba(168,85,247,0.4);
  margin-bottom: 20px;
}

.badge {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  padding: 6px 16px;
  border-radius: 999px;
  font-weight: bold;
  margin-bottom: 12px;
}

h1 {
  margin: 10px 0;
  font-size: 32px;
}

p {
  opacity: 0.95;
  line-height: 1.6;
  margin-bottom: 26px;
}

.cta {
  background: #000;
  color: #fff;
  border: none;
  padding: 14px 28px;
  border-radius: 14px;
  font-size: 16px;
  cursor: pointer;
}

.cta:hover {
  opacity: 0.85;
}
</style>
</head>

<body>
  <div class="box">
    <img src="/public/logo.png" class="logo" alt="Clawdwhale Logo">

    <div class="badge">$CLAWD</div>

    <h1>Clawdwhale</h1>

    <p>
      <strong>Clawdwhale (CLAWD)</strong> is a hybrid ocean-themed Web3 token
      that symbolizes the strength of a whale and the toughness of a crab’s
      claws within one decentralized ecosystem. Inspired by the concept of
      the “whale” in the world of crypto, Clawdwhale represents power,
      resilience, and community-driven growth.
    </p>

    <button class="cta" onclick="location.href='/auth/x'">
      Connect X
    </button>
  </div>
</body>
</html>
`);
});

/* =========================
   AUTH ROUTES
========================= */
app.get("/auth/x", passport.authenticate("twitter"));

app.get(
  "/auth/x/callback",
  passport.authenticate("twitter", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

/* =========================
   PROFILE PAGE
========================= */
app.get("/profile", (req, res) => {
  if (!req.user) return res.redirect("/");

  const avatar = req.user.photos?.[0]?.value || "";

  res.send(`
    <body style="font-family:Arial;text-align:center;padding:40px">
      <h1>Connected as @${req.user.username}</h1>
      <img src="${avatar}" style="border-radius:50%;width:120px"><br><br>
      <a href="/">Back to Home</a>
    </body>
  `);
});

/* =========================
   SERVER (RAILWAY)
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("WEB JALAN PORT " + PORT);
});
