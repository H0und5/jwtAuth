// import environment variable functionality on backend
require("dotenv").config();

// import backend technologies
const express = require("express");
const jwt = require("jsonwebtoken");

// Create an instance of the express app
const app = express();

// Creating dummy data
const posts = [
  {
    username: "Hounds",
    title: "Tiffany & Co",
  },
  {
    username: "Gambhira",
    title: "Balenciaga",
  }
]



// Make sure app can use JSON from the body that gets passed inside a request
app.use(express.json());

// GET request through Posts route for dummy data
app.get("/posts", authenticateToken, (req, res) => {
  req.user
  res.json(posts.filter(post => post.username === req.user.name));
});


// POST request through Login route for User Authentication, token
app.post("/login", (req, res) => {
  // Authenticate the User

  const username = req.body.username;
  const user = { name: username };

  // jwt.sign(payload, secret); secret helps to serialize the token.
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

  // Pass our accessToken as our JSON, assuming user is authenticated. Access token will have user information saved inside of it
  res.json({ accessToken: accessToken });

})

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
app.listen(3000);
