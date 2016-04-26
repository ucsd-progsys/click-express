
import * as m      from 'mongoose';
import * as t      from 'types';
import { MgQuery } from '../lib/db';

let ObjectId = m.Schema.Types.ObjectId;

// Schema
let clickSchema = new m.Schema({
    username: String,
    quizId: ObjectId,
    choice: Number,
    submitTime: Date
});


// Model
interface IClickModel extends t.IClick, m.Document {}
export let Click = m.model<IClickModel>  ('Click'  , clickSchema);


// API

export async function find(o: { quizId?: t.QuizId; startTime?: Date; stopTime?: Date }): Promise<t.IClick[]> {
    let query = new MgQuery();
    query.is('quizId', o.quizId);
    query.between('submitTime', o.startTime, o.stopTime);
    return Click.find(query.toFields()).exec();
}

export function add(click: t.IClick) {
    new Click(click).save();
}

