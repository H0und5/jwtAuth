// import environment variable functionality on backend
require("dotenv").config();

// import backend technologies
const express = require("express");
const jwt = require("jsonwebtoken");

// Create an instance of the express app
const app = express();


// Make sure app can use JSON from the body that gets passed inside a request
app.use(express.json());

// Don't have it on your server, everytime it restarts, this will be emptied out
// typically you store the refreshToken in the database or redis cache.
let refreshTokens = [];


// Create new token
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccesstoken({ name: user.name});
    res.json({ accessToken: accessToken });
  })

});

// POST request through Login route for User Authentication, token
app.post("/login", (req, res) => {
  // Authenticate the User

  const username = req.body.username;
  const user = { name: username };

  // jwt.sign(payload, secret); secret helps to serialize the token.
  const accessToken = generateAccesstoken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

  refreshTokens.push(refreshToken);

  // Pass our accessToken as our JSON, assuming user is authenticated. Access token will have user information saved inside of it
  res.json({ accessToken: accessToken, refreshToken: refreshToken });

});

function generateAccesstoken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
};

// Bind and listen the connections on the specified host and port.
app.listen(4000);
