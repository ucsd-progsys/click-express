
import { Schema, model } from 'mongoose';

import * as t       from 'types';
import * as m       from 'models';
import { MgQuery }  from '../lib/db';

// Schema

let courseSchema = new Schema({
    name: String,
    description: String,
    instructor: String
});


// Model
export let Course = model<m.ICourseModel> ('Course' , courseSchema);


// API

export async function getAll(): Promise<m.ICourseModel[]> {
    let query = new MgQuery();
    return Course.find(query.toFields()).exec();
}

export async function names(): Promise<t.CourseId[]> {
    return (await getAll()).map(c => c.name);
}

export async function exists(course: string): Promise<boolean> {
    return (await names()).some((n) => n === course);
}
