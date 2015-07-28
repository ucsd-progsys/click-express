
import mongoose = require('mongoose');
var plm         = require('passport-local-mongoose');
var Schema      = mongoose.Schema;
var ObjectId    = Schema.Types.ObjectId;

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

export var Account = mongoose.model('Account', AccountS);
export var Problem = mongoose.model('Problem', ProblemS);
export var Course  = mongoose.model('Course' , CourseS );
export var Click   = mongoose.model('Click'  , ProblemS);
export var Enroll  = mongoose.model('Enroll' , EnrollS);

/*
export type ClickModel = mongoose.Model<mongoose.Document>;

export interface ClickModels {
  Account: ClickModel;
  Problem: ClickModel;
  Course : ClickModel;
  Click  : ClickModel;
  Enroll : ClickModel;
}

export var models : ClickModels = {
    Account : mongoose.model('Account', AccountS)
  , Problem : mongoose.model('Problem', ProblemS)
  , Course  : mongoose.model('Course' , CourseS )
  , Click   : mongoose.model('Click'  , ProblemS)
  , Enroll  : mongoose.model('Enroll' , EnrollS)
}
*/
