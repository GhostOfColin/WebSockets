const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const db = require("../config/keys.js").MONGO_URI;
const expressGraphQL = require("express-graphql");
const cors = require('cors');
const User = require("./models/User");
const Channel = require("./models/Channel");
const Message = require("./models/Message");
const schema = require("./schema/schema");
const app = express();
const http = require('http');
const socketIo = require("socket.io");

if (!db) {
  throw new Error("You must provide a string to connect to mLab");
}

const server = http.Server(app);
const io = socketIo(server);

io.on("NEW_MESSAGE", (data) => {
  console.log(data);
});

io.on("connection", (socket) => {
  socket.emit("connection", "connection successful");
});

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(cors());

app.use(
  "/graphql",
  expressGraphQL(req => {
    return {
      schema,
      context: {
        token: req.headers.authorization,
        io: io
      },
      graphiql: true
    };
  })
);


module.exports = server;


