
import mongoose = require('mongoose');
var plm         = require('passport-local-mongoose');
var Schema      = mongoose.Schema;
var ObjectId    = Schema.Types.ObjectId;

////////////////////////////////////////////////////////////////////////
// Schemas//////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

var AccountS = new Schema({ username: String
                          , password: String
                          , email   : String
                          });

AccountS.plugin(plm);

var ProblemS = new Schema({ userId     : String
                          , courseId   : String
                          , startTime  : Date
                          });

var CourseS  = new Schema({ userId     : String
                          , description: String });

var ClickS   = new Schema({ userId     : String                              
                          , choice     : String
                          , submitTime : Date
                          , courseId   : ObjectId       // Ref to course's _id
                          , quizId     : ObjectId       // Ref to quiz's _id   
                          });

var EnrollS  = new Schema({ userId     : String
                          , courseId   : String
                          });

////////////////////////////////////////////////////////////////////////
// Models //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export var Account   = mongoose.model('Account', AccountS);
export var Problem   = mongoose.model('Problem', ProblemS);
export var Course    = mongoose.model('Course' , CourseS );
export var Click     = mongoose.model('Click'  , ClickS);
export var Enroll    = mongoose.model('Enroll' , EnrollS);

export type UserId   = string; //  mongoose.Types.ObjectId;
export type CourseId = string; //  mongoose.Types.ObjectId;
export type QuizId   = string; //  mongoose.Types.ObjectId;

export interface ClickI {
    userId     : UserId
  , choice     : string
  , submitTime : number         // Date
  , courseId   : CourseId
  , quizId     : QuizId
}