
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

var QuizS    = new Schema({ courseId   : String         // Foreign key
                          , descr      : String
                          , options    : [{ id: String, name: String }]
                          , correct    : String
                          , author     : String         // Foreign key
                          , startTime  : Date
                          });

var CourseS  = new Schema({ name       : String
                          , description: String
                          , instructor : String         // Foreign key
                          });

var ClickS   = new Schema({ userId     : String
                          , quizId     : String         // Foreign key                                                       
                          , choice     : String
                          , submitTime : Date
                          });

var EnrollS  = new Schema({ userId     : String
                          , courseId   : String
                          });

////////////////////////////////////////////////////////////////////////
// Models //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export var Account   = mongoose.model('Account', AccountS);
export var Quiz      = mongoose.model('Quiz'   , QuizS);
export var Course    = mongoose.model('Course' , CourseS );
export var Click     = mongoose.model('Click'  , ClickS);
export var Enroll    = mongoose.model('Enroll' , EnrollS);

export type UserId   = string; //  mongoose.Types.ObjectId;
export type CourseId = string; //  mongoose.Types.ObjectId;
export type QuizId   = string; //  mongoose.Types.ObjectId;
