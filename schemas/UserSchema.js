const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true, trim: true, unique: true},
    username: { type: String, required: true, trim: true},
    name: { type: String, required: true, trim: true},
    school: { type: String, required: true, trim: true},
    industry: { type: String, required: true, trim: true},
    // userName: { type: String, required: true, trim: true, unique: true},
    // email: { type: String, required: true, trim: true, unique: true},
    // password: { type: String, required: true},
    // profilePic: { type: String, default: "/images/elon.jpg"},
    // coverPhoto: { type: String},
    // likes: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    // retweets: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    // following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    // followers: [{ type: Schema.Types.ObjectId, ref: 'User' }]

}, {timestamps: true});

var User = mongoose.model('User',  UserSchema)
module.exports = User;
