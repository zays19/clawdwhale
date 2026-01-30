const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;

const app = express();

/* ========= STATIC FILES ========= */
app.use(express.static(path.join(__dirname, "public")));

/* ========= SESSION ========= */
app.use(
  session({
    secret: "clawdwhale_secret",
    resave: false,
    saveUninitialized: true,
  })
);

/* ========= PASSPORT ========= */
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    (token, tokenSecret, profile, done) => {
      return done(null, profile);
    }
  )
);

/* ========= ROUTES ========= */
app.get("/auth/x", passport.authenticate("twitter"));

app.get(
  "/auth/x/callback",
  passport.authenticate("twitter", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.get("/me", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in" });
  res.json(req.user);
});

/* ========= START ========= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});
