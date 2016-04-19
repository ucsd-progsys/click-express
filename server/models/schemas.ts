
import mongoose = require('mongoose');
var plm         = require('passport-local-mongoose');
var Schema      = mongoose.Schema;
var ObjectId    = Schema.Types.ObjectId;

////////////////////////////////////////////////////////////////////////
// Schemas//////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

var AccountS = new Schema({ username: { type  : String
                                      , index : true 
                                      , unique: true
                                      }
                          , password: String
                          , email   : String
                          });

AccountS.plugin(plm);

var QuizS    = new Schema({ courseId   : String         // coursename
                          , description: String
                          , options    : [String]       // was: [OptionS]
                          , correct    : Number
                          , author     : String         // username
                          , timeCreated: Date
                          });

var CourseS  = new Schema({ _id        : String
                          , description: String
                          , instructor : String         // username
                          });

var ClickS   = new Schema({ username   : String
                          , quizId     : ObjectId      // quiz id
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

// export var Option    = mongoose.model('Option' , OptionS);

export var Quiz      = mongoose.model('Quiz'   , QuizS);
export var Course    = mongoose.model('Course' , CourseS);
export var Click     = mongoose.model('Click'  , ClickS);
export var Enroll    = mongoose.model('Enroll' , EnrollS);

export type UserId   = string; //  mongoose.Types.ObjectId;
export type CourseId = string; //  mongoose.Types.ObjectId;
export type QuizId   = string; //  mongoose.Types.ObjectId;