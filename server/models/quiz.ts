
import * as m      from 'mongoose';
import * as t      from 'types';
import { MgQuery } from '../lib/db';


// Schema
let quizSchema = new m.Schema({
    courseId: String,
    description: String,
    options: [String],
    correct: Number,
    author: String,
    timeCreated: Date
});

// Model
interface IQuizModel extends t.IQuiz, m.Document {}
export let Quiz = m.model<IQuizModel>('Quiz', quizSchema);

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
