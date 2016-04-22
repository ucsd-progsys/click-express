
import * as t           from 'types';
import * as m           from 'models';

import { Quiz }         from '../models/schemas';
import { QueryFields }  from '../lib/db';

type onFulFillTy = (m: m.IQuizModel[]) => void;
type onErrorTy   = (err: any) => void;

export async function find(course?: t.CourseId): Promise<t.IQuiz[]> {
    let query = new QueryFields();
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
