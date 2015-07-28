
import mongoose = require('mongoose');
var plm         = require('passport-local-mongoose');
var Schema      = mongoose.Schema;
var ObjectId    = mongoose.Types.ObjectId;

////////////////////////////////////////////////////////////////////////
// Schemas//////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

var AccountS = new Schema({ username: String
                         , password: String
                         , email   : String });
AccountS.plugin(plm);

var ProblemS = new Schema({ userId     : ObjectId
                         , description: String });

var CourseS  = new Schema({ userId     : ObjectId
                         , descripton : String });

var ClickS   = new Schema({ userId     : ObjectId
                         , choice     : Number // {v:number | 1 <= v <= 5}
                         , submitTime : Date
                         , courseId   : ObjectId
                         , problemId  : ObjectId });

var EnrollS  = new Schema({ courseId   : ObjectId
                         , studentId  : ObjectId });

////////////////////////////////////////////////////////////////////////
// Models //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

module.exports = { Account : mongoose.model('Account', AccountS)
                 , Problem : mongoose.model('Problem', ProblemS)
                 , Course  : mongoose.model('Course' , CourseS )
                 , Click   : mongoose.model('Click'  , ProblemS)
                 , Enroll  : mongoose.model('Enroll' , EnrollS) }
