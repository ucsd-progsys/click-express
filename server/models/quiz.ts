
import { Schema, model } from 'mongoose';
import * as t            from 'types';
import * as m            from 'models';
import { MgQuery }       from '../lib/db';

type onFulFillTy = (m: m.IQuizModel[]) => void;
type onErrorTy   = (err: any) => void;

// Schema
let quizSchema = new Schema({
    courseId: String,
    description: String,
    options: [String],
    correct: Number,
    author: String,
    timeCreated: Date
});

// Model
export let Quiz = model<m.IQuizModel>   ('Quiz'   , quizSchema);



/*@ find ::
    pre: USER == 'instructor'  
    (course?: CourseId): Promise<t.IQuiz[]> 
 */
export async function find(course?: t.CourseId): Promise<t.IQuiz[]> {
    let query = new MgQuery();
    query.is('courseId', course);
    return Quiz.find(query.toFields()).exec();
}

export function add(quiz: t.IQuiz) {
    console.log('about to save');
    new Quiz(quiz).save(function (err, res) {
        if (err) {
            console.log('error saving');
        } else {
            console.log('save successfully!');
        }
    });
}
