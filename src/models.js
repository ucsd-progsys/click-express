var mongoose = require('mongoose');
var plm = require('passport-local-mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var AccountS = new Schema({ username: String,
    password: String,
    email: String
});
AccountS.plugin(plm);
var ProblemS = new Schema({ userId: String,
    courseId: String,
    startTime: Date
});
var CourseS = new Schema({ userId: String,
    description: String });
var ClickS = new Schema({ userId: String,
    choice: Number,
    submitTime: Date,
    courseId: String,
    startTime: String
});
var EnrollS = new Schema({ userId: String,
    courseId: String
});
exports.Account = mongoose.model('Account', AccountS);
exports.Problem = mongoose.model('Problem', ProblemS);
exports.Course = mongoose.model('Course', CourseS);
exports.Click = mongoose.model('Click', ClickS);
exports.Enroll = mongoose.model('Enroll', EnrollS);
