/**
 * Created by Administrator on 2017/4/15 0015.
 */
var mongoose = require('mongoose');
var config = require('../config/config');
mongoose.connect(config.mongodb);

var UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String
});
//这里会数据库会创建一个users集合
var User = mongoose.model('User', UserSchema);
module.exports = User;