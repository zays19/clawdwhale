import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as TwitterStrategy } from "passport-twitter";

const app = express();

app.use(express.static("public"));

app.use(
  session({
    secret: "clawdwhale-secret",
    resave: false,
    saveUninitialized: false,
  })
);

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
      return done(null, {
        id: profile.id,
        username: profile.username,
        name: profile.displayName,
      });
    }
  )
);

// ===== ROUTES =====

app.get("/auth/x", passport.authenticate("twitter"));

app.get(
  "/auth/x/callback",
  passport.authenticate("twitter", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.get("/me", (req, res) => {
  if (!req.user) return res.json({ loggedIn: false });
  res.json({ loggedIn: true, user: req.user });
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
