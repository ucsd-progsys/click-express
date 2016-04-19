
/**
 *  In memory classroom
 */

// State
let quizInProgress: IQuiz | undefined;
let classRooms: Map<CourseId, Set<StudentId>>;


export function initialize(): void {
    quizInProgress = undefined;
    classRooms = {};
}

export function startQuiz(q: IQuiz): void {
    quizInProgress = q;
}

export function stopQuiz(): void {
    quizInProgress = undefined;
}

export function getQuizInProgress(): IQuiz | undefined {
    return quizInProgress;
}

/**
 * Requires:
 *  - Initialized classroom
 *  - Student is not present in another classroom
 */
export function addStudent(course: CourseId, student: StudentId) {
    if (classRooms[course]) {
        classRooms[course] = {};
    }
    classRooms[student] = true;
}

export function removeStudent(course: CourseId, student: StudentId) {
    delete classRooms[student];
}

