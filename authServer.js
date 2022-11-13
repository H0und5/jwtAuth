// import environment variable functionality on backend
require("dotenv").config();

// import backend technologies
const express = require("express");
const jwt = require("jsonwebtoken");

// Create an instance of the express app
const app = express();

// Make sure app can use JSON from the body that gets passed inside a request
app.use(express.json());

// GET request through Posts route for dummy data
app.get("/posts", authenticateToken, (req, res) => {
  req.user
  res.json(posts.filter(post => post.username === req.user.name));
});


// Create middleware to authenticate token
function authenticateToken(req, res, next) {
  /* 
    Get the user, verify this is correct user, and then return user to whichever route. Call this function as our middleware 
  */
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  // At this point, we know they have a legit token, so we need to verify
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next()
  })
}


// Bind and listen the connections on the specified host and port.
app.listen(4000);
