
import * as t       from 'types';
import * as m       from 'models';
import { Click }    from '../models/schemas';
import { MgQuery }  from '../lib/db';


export async function find(o: { quizId?: t.QuizId; startTime?: Date; stopTime?: Date }): Promise<m.IClickModel[]> {
    let query = new MgQuery();
    query.is('quizId', o.quizId);
    query.between('submitTime', o.startTime, o.stopTime);
    return Click.find(query.toFields()).exec();
}

export function add(click: t.IClick) {
    new Click(click).save();
}
