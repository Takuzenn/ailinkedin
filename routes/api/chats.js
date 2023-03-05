const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema')
const Post = require('../../schemas/PostSchema')
const Chat = require('../../schemas/ChatSchema')
const Message = require('../../schemas/MessageSchema')


var urlencodedParser = bodyParser.urlencoded({ extended: false })


router.post("/", urlencodedParser, async (req, res, next) => {
    if (!req.body.users) {
        console.log("no users!");
        return res.sendStatus(400);
    }

    var users = JSON.parse(req.body.users);

    if (users.length == 0) {
        console.log("users array is zero");
        return res.sendStatus(400);
    }

    users.push(req.session.user);

    var chatData = {
        users: users,
        isGroupChat: true
    }

    Chat.create(chatData)
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.get("/", urlencodedParser, async (req, res, next) => {

    Chat.find({ users: { $elemMatch: { $eq: req.session.user._id } }})
    .populate("users")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async results => {

        if(req.query.unreadOnly !== undefined && req.query.unreadOnly == "true") {
            results = results.filter(r => {
                if(r.latestMessage && r.latestMessage.readBy){
                     return  !r.latestMessage.readBy.includes(req.session.user._id)
                }        
            })
        }

        results = await User.populate(results, { path: "latestMessage.sender" });
        res.status(200).send(results);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

})

router.get("/:chatId", urlencodedParser, async (req, res, next) => {

    Chat.findOne({ _id: req.params.chatId, users: { $elemMatch: { $eq: req.session.user._id } }})
    .populate("users")
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

})

router.put("/:chatId", urlencodedParser, async (req, res, next) => {

    Chat.findByIdAndUpdate(req.params.chatId, req.body)
    .then(results => res.sendStatus(204))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

})

router.get("/:chatId/messages", urlencodedParser, async (req, res, next) => {

    Message.find({ chat: req.params.chatId })
    .populate("sender")
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

})

module.exports = router;