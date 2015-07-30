
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

var ProblemS = new Schema({ userId     : String
                          , description: String });

var CourseS  = new Schema({ userId     : String
                          , descripton : String });

var ClickS   = new Schema({ userId     : String
                          , choice     : Number // {v:number | 1 <= v <= 5}
                          , submitTime : Date
                          , courseId   : String
                          , problemId  : String
                          });

var EnrollS  = new Schema({ userId     : String
                          , courseId   : String
                          });

////////////////////////////////////////////////////////////////////////
// Models //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export var Account = mongoose.model('Account', AccountS);
export var Problem = mongoose.model('Problem', ProblemS);
export var Course  = mongoose.model('Course' , CourseS );
export var Click   = mongoose.model('Click'  , ClickS);
export var Enroll  = mongoose.model('Enroll' , EnrollS);

export type UserId    = string; //  mongoose.Types.ObjectId;
export type CourseId  = string; //  mongoose.Types.ObjectId;
export type ProblemId = string; //  mongoose.Types.ObjectId;

export interface ClickI {
    userId     : UserId
  , choice     : number // {v:number | 1 <= v <= 5}
  , submitTime : number// Date
  , courseId   : CourseId
  , problemId  : ProblemId
}
