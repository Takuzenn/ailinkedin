const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../schemas/UserSchema')
const bcrypt = require("bcrypt")



app.set("view engine", "pug")
app.set("views", "views")

var urlencodedParser = bodyParser.urlencoded({ extended: false })


router.get("/", (req, res, next) => {

    res.status(200).render("login");
})

router.post("/", urlencodedParser, async (req, res, next) => {

    var payload = req.body;

    if (req.body.loginUsername && req.body.loginPassword) {
        var user = await User.findOne({
            $or: [
                { userName: req.body.loginUsername}, 
                { email: req.body.loginUsername}
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "something went wrong";
            res.status(200).render("login", payload);
        })

        if (user != null) {

            var result = await bcrypt.compare(req.body.loginPassword, user.password)

            if (result == true) {
                req.session.user = user;
                return res.redirect("/");
            }

        }

        payload.errorMessage = "username or password incorrect";
        return res.status(200).render("login", payload);

    }

    res.status(200).render("login");
})

module.exports = router;