const jwt = require("jsonwebtoken");
const key = require("../../config/keys").secretOrKey;
const User = require("../models/User");
const Message = require("../models/Message");

const addMessage = async (data, context) => {
  const token = context.token;
  const { body } = data;

  const decoded = jwt.verify(token, key);
  const { id } = decoded;
  
  if (id) {
    const message = await new Message({
      user_id: id,
      // channel_id,
      body,
    }).save();
    // context.pubsub.publish(NEW_MESSAGE, message);
    context.io.sockets.emit("NEW_MESSAGE", message);
    // console.log(context.io);
    return message;
  } else {
    throw new Error (
      "Sorry, you need to be logged in to send a message."
    );
  }
};

const updateMessage = async ({ id, body }) => {
  
  const updateObj = {};

  if (id) updateObj.id = id;
  if (body) updateObj.body = body;

  return Message.findOneAndUpdate({ _id: id }, { $set: updateObj }, { new: true }, (err, message) => {
    return message;
  });
};

module.exports = { addMessage, updateMessage };
