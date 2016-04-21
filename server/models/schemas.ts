

/**
 * https://github.com/Appsilon/styleguide/wiki/mongoose-typescript-models
 */

import * as plmongoose from 'passport-local-mongoose';
import * as mongoose   from 'mongoose';
import * as m          from 'models';

let Schema   = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

// Schemas

let accountSchema: mongoose.PassportLocalSchema = new Schema({
    username: { type: String, index: true, unique: true },
    password: String,
    email: String
}).plugin(plmongoose);

let quizSchema = new Schema({
    courseId: String,
    description: String,
    options: [String],
    correct: Number,
    author: String,
    timeCreated: Date
});

let courseSchema = new Schema({
    name: String,
    description: String,
    instructor: String
});

let clickSchema = new Schema({
    username: String,
    quizId: ObjectId,
    choice: Number,
    submitTime: Date
});

let enrollSchema = new Schema({
    userId: String,
    courseId: String
});


// Models

export let Account  = mongoose.model<m.IAccountModel>('Account', accountSchema);
export let Quiz     = mongoose.model<m.IQuizModel>   ('Quiz'   , quizSchema);
export let Course   = mongoose.model<m.ICourseModel> ('Course' , courseSchema);
export let Click    = mongoose.model<m.IClickModel>  ('Click'  , clickSchema);
export let Enroll   = mongoose.model<m.IEnrollModel> ('Enroll' , enrollSchema);
