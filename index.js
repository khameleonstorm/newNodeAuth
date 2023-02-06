const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
require('dotenv').config()
const app = express();

if(!process.env.JWT_PRIVATE_KEY){
  console.log("Fatal Error: jwtPrivateKey is required")
  process.exit(1);
}

mongoose.connect("mongodb://localhost/forexbroker")
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log("Error connecting to MongoDB"))


// middlewares
app.use(express.json());
app.use("/api/users", users);

const PORT = !process.env.PORT ? 5000 : process.env.PORT
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))