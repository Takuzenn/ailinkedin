const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../schemas/UserSchema')
const bcrypt = require("bcrypt")
const path = require("path");


var urlencodedParser = bodyParser.urlencoded({ extended: false })


router.get("/images/:path", (req, res, next) => {

    res.sendFile(path.join(__dirname, "../uploads/images/" + req.params.path))
})




module.exports = router;