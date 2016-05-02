
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
export async function findWithCourse(course?: t.CourseId): Promise<t.IQuiz[]> {
    let query = new MgQuery();
    query.is('courseId', course);
    return Quiz.find(query.toFields()).exec();
}

export async function findWithId(id: string): Promise<t.IQuiz[]> {
    let query = new MgQuery();
    query.is('_id', id);
    return Quiz.find(query.toFields()).exec();
}


/**
 * @param quiz The quiz to save
 * @returns    The quiz '_id' assigned when saving 
 */
export function add(quiz: t.IQuiz): t.QuizId {
    console.log('about to save');
    let q = new Quiz(quiz);
    q.save(function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(q._id, 'saved successfully!');
        }
    });
    return q._id;
}

export function delete_(quizId: t.QuizId): m.Promise<any> {
    let query = new MgQuery();
    query.is('_id', quizId);
    return Quiz.remove(query.toFields()).exec();
}
