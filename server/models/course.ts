
import * as m      from 'mongoose';
import * as t      from 'types';
import { MgQuery } from '../lib/db';

// Schema
let courseSchema = new m.Schema({
    name: String,
    description: String,
    instructor: String
});


// Model
interface ICourseModel extends t.ICourse, m.Document {}
export let Course = m.model<ICourseModel> ('Course' , courseSchema);


// API

export async function getAll(): Promise<t.ICourse[]> {
    let query = new MgQuery();
    return Course.find(query.toFields()).exec();
}

export async function names(): Promise<t.CourseId[]> {
    return (await getAll()).map(c => c.name);
}

export async function exists(course: string): Promise<boolean> {
    return (await names()).some((n) => n === course);
}
