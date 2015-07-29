var mongoose = require('mongoose');
var plm = require('passport-local-mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var AccountS = new Schema({ username: String,
    password: String,
    email: String });
AccountS.plugin(plm);
var ProblemS = new Schema({ userId: ObjectId,
    description: String });
var CourseS = new Schema({ userId: ObjectId,
    descripton: String });
var ClickS = new Schema({ userId: ObjectId,
    choice: Number,
    submitTime: Date,
    courseId: ObjectId,
    problemId: ObjectId });
var EnrollS = new Schema({ courseId: ObjectId,
    studentId: ObjectId });
exports.Account = mongoose.model('Account', AccountS);
exports.Problem = mongoose.model('Problem', ProblemS);
exports.Course = mongoose.model('Course', CourseS);
exports.Click = mongoose.model('Click', ProblemS);
exports.Enroll = mongoose.model('Enroll', EnrollS);
