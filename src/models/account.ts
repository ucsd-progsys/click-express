
import mongoose = require('mongoose');
var plm         = require('passport-local-mongoose');
var Schema      = mongoose.Schema;

var Account = new Schema({ username: String
                         , password: String });

Account.plugin(plm);

module.exports = mongoose.model('Account', Account);
