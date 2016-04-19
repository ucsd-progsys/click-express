
import { Request, RequestH, Response }  from '../helper/types';
import { Quiz }                         from '../models/schemas';

// export var getQuestions: RequestH = (req, res) => {
//     Quiz.find({ 'courseId': req.body.courseName }, (err: any, quizzes: IQuiz[]) => {
//         if (err) {
//             console.log('ERROR: Could not find questions for class ', req.body.courseName);
//         }
//         res.json({ questionPool: JSON.stringify(quizzes) });
//     });
// }





export function findAll(courseId: string): IQuiz[] {
    Quiz.find({ 'courseId': courseId }, (err: any, quizzes: IQuiz[]) => {
        if (err) {
            console.log('ERROR: Could not find questions for class ', courseId);
        }
        res.json({ questionPool: JSON.stringify(quizzes) });
    }).exec(cb).complete;
}




export function getQuestions(courseId: string): any {
    Quiz.find({ 'courseId': courseId }, (err: any, quizzes: IQuiz[]) => {
        if (err) {
            console.log('ERROR: Could not find questions for class ', courseId);
        }
        res.json({ questionPool: JSON.stringify(quizzes) });
    }).exec(cb);
}
