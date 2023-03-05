const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const Chat = require('../../schemas/ChatSchema');
const Message = require('../../schemas/MessageSchema');
const Notification = require('../../schemas/NotificationSchema');


var urlencodedParser = bodyParser.urlencoded({ extended: false })


router.post("/", urlencodedParser, async (req, res, next) => {
    if (!req.body.content || !req.body.chatId) {
        console.log("Invalid data passed in");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.session.user._id,
        content: req.body.content,
        chat: req.body.chatId
    };

    Message.create(newMessage)
    .then(async results => {
        results = await results.populate(["sender"]);
        results = await results.populate(["chat"]);
        results = await User.populate(results, { path: "chat.users" });

        
        var chat = await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: results })
        .catch(error => console.log(error));

        insertNotifications(chat, results);

        res.status(201).send(results);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

function insertNotifications(chat, message) {
    chat.users.forEach(async userId => {
        if (userId == message.sender._id.toString()) return;

        await Notification.insertNotification(userId, message.sender._id, "newMessage", message.chat._id);
    })
}

module.exports = router;