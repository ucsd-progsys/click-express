
import { Schema, model } from 'mongoose';

import * as t       from 'types';
import * as m       from 'models';
import { MgQuery }  from '../lib/db';

let ObjectId = Schema.Types.ObjectId;

// Schema

let clickSchema = new Schema({
    username: String,
    quizId: ObjectId,
    choice: Number,
    submitTime: Date
});

// Model

export let Click = model<m.IClickModel>  ('Click'  , clickSchema);


// API

export async function find(o: { quizId?: t.QuizId; startTime?: Date; stopTime?: Date }): Promise<m.IClickModel[]> {
    let query = new MgQuery();
    query.is('quizId', o.quizId);
    query.between('submitTime', o.startTime, o.stopTime);
    return Click.find(query.toFields()).exec();
}

export function add(click: t.IClick) {
    new Click(click).save();
}

