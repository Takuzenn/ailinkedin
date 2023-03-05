const mongoose = require('mongoose');
mongoose.set("strictQuery", false);



class Database {

    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect("mongodb+srv://Takuzen:Ll352513@twitterclone.cs8hbun.mongodb.net/?retryWrites=true&w=majority")
        .then(() => {
            console.log("Database connected success!")
        })
        .catch(err => {
            console.log("err")
        })
    }

}


module.exports = new Database();
