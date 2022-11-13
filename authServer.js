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
    title: "Versace",
  },
  {
    username: "Gambhira",
    title: "Dolce & Gabanna",
  }
]



// Make sure app can use JSON from the body that gets passed inside a request
app.use(express.json());


// POST request through Login route for User Authentication, token
app.post("/login", (req, res) => {
  // Authenticate the User

  const username = req.body.username;
  const user = { name: username };

  // jwt.sign(payload, secret); secret helps to serialize the token.
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

  // Pass our accessToken as our JSON, assuming user is authenticated. Access token will have user information saved inside of it
  res.json({ accessToken: accessToken });

});


// Bind and listen the connections on the specified host and port.
app.listen(4000);
