const express = require("express");
const path = require("path");

const app = express();

/* =========================
   STATIC FILES
   ========================= */
app.use("/public", express.static(path.join(__dirname, "public")));

/* =========================
   HOME PAGE
   ========================= */
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ClawdCat</title>
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
      max-width: 380px;
      padding: 24px;
    }
    img {
      width: 200px;
      max-width: 90%;
      margin-bottom: 20px;
    }
    h1 {
      margin: 10px 0;
      font-size: 28px;
    }
    p {
      opacity: 0.9;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    button {
      background: #a855f7;
      color: #fff;
      border: none;
      padding: 14px 22px;
      border-radius: 12px;
      font-size: 16px;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <div class="box">
    <img src="/public/logo.png" alt="ClawdCat Logo">
    <h1>Clawdwhale</h1>
    <p>
      Clawdwhale (CLAWD) is a hybrid ocean-themed Web3 token that symbolizes the strength of a whale and the toughness of a crab's claws in one decentralized ecosystem. Inspired by the concept of the "whale" in the world
    </p>
    <button onclick="location.href='/login'">Connect Twitter</button>
  </div>

</body>
</html>
  `);
});

/* =========================
   LOGIN PLACEHOLDER
   ========================= */
app.get("/login", (req, res) => {
  res.send("Twitter login will be implemented here.");
});

/* =========================
   SERVER LISTEN (RAILWAY SAFE)
   ========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", function () {
  console.log("WEB JALAN PORT " + PORT);
});
