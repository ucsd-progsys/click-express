
import * as t   from 'types';

// In memory classroom

let quizInProgress: t.IQuiz | undefined;
let classRooms: { [x: string]: Set<t.StudentId> } = {};


export function initialize(): void {
    quizInProgress = undefined;
    classRooms = {};
}

export function startQuiz(course: t.CourseId, q: t.IQuiz): void {
    quizInProgress = q;
}

export function stopQuiz(): void {
    quizInProgress = undefined;
}

export function getQuizInProgress(): t.IQuiz | undefined {
    return quizInProgress;
}

/**
 * Requires:
 *  - Initialized classroom
 *  - Student is not present in another classroom
 */
export function addStudent(course: t.CourseId, student: t.StudentId) {
    if (classRooms[course]) {
        classRooms[course] = new Set();
    }
    classRooms[course].add(student);
}

export function removeStudent(course: t.CourseId, student: t.StudentId) {
    delete classRooms[student];
}
