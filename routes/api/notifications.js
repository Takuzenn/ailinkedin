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


router.get("/", urlencodedParser, async (req, res, next) => {

    var searchObj = { userTo: req.session.user._id, notificationType: { $ne: "newMessage" }}


    
    if(req.query.unreadOnly !== undefined && req.query.unreadOnly == "true") {
        searchObj.opened = false;
    }

    Notification.find(searchObj)
    .populate("userTo")
    .populate("userFrom")
    .sort({ createdAt: -1 })
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

})

router.get("/latest", urlencodedParser, async (req, res, next) => {


    Notification.findOne({ userTo: req.session.user._id })
    .populate("userTo")
    .populate("userFrom")
    .sort({ createdAt: -1 })
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

})

router.put("/:id/markAsOpened", urlencodedParser, async (req, res, next) => {

    Notification.updateMany({ userTo: req.session.user._id }, { opened: true })
    .then( () => res.sendStatus(204))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

})

router.put("/markAsOpened", urlencodedParser, async (req, res, next) => {

    Notification.findByIdAndUpdate(req.params.id, { opened: true })
    .then( () => res.sendStatus(204))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

})

module.exports = router;