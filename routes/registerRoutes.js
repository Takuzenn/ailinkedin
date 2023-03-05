const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../schemas/UserSchema')
const bcrypt = require("bcrypt")


app.set("view engine", "pug");
app.set("views", "views");


var urlencodedParser = bodyParser.urlencoded({ extended: false })


router.get("/", (req, res, next) => {

    res.status(200).render("register");
})

router.post('/', urlencodedParser, async (req, res, next) => {

    var email = req.body.email.trim();
    var username = req.body.username.trim();
    var name = req.body.name.trim();
    var school = req.body.school.trim();
    var industry = req.body.industry.trim();

    // var password = req.body.password;
    var payload = req.body;

    if (email && school && industry && username && name) {
        console.log(req.body);
        var user = await User.findOne({
            $or: [
                { email: email},
                { username: username}
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "database's findone went wrong";
            res.status(200).render("register", payload);
        })


        if(user == null) {
            // No user found
            var data = req.body;

            // data.password = await bcrypt.hash(password, 10)

            User.create(data)
            .then((user) => {
                req.session.user = user;
                return res.redirect("/login");
            })
        }
        else {
            // User found
            if (email == user.email) {
                payload.errorMessage = "email already in use.";
                res.status(200).render("register", payload);
            } else {
                payload.errorMessage = "Username already in use.";
                res.status(200).render("register", payload);
            }

        }

    } else {
        payload.errorMessage = "make sure you input all required value"
        res.status(200).render("register", payload);
    }

})

module.exports = router;