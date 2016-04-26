
declare module 'types' {

    export const enum Message {
        QuizCreate,
        QuizBCast,
        QuizStop,
        QuizAck,
        UserExists,
        ClickFail,
        ClickOk
    }

    export interface SocketEvent {
        kind: MessageDscr,
        info: any
    }


    // Type aliases

    export type MessageDscr = string;
    export type UserId      = string; //  mongoose.Types.ObjectId;
    export type CourseId    = string; //  mongoose.Types.ObjectId;
    export type QuizId      = string; //  mongoose.Types.ObjectId;
    export type StudentId   = string;
    export type UserName    = string;

    // Model types

    export interface IAccount {
        username: string;
        password: string;
        email: string;
    }

    export interface IQuiz {
        courseId: string;
        description: string;
        options: string[];
        correct: number;
        author: string;
        timeCreated: Date;
    }

    export interface ICourse {
        name: string;
        description: string;
        intstructor: string;
    }

    export interface IClick {
        username: string;
        quizId: QuizId;
        choice: number;
        submitTime: Date;
    }

    export interface IEnroll {
        userId: UserId;
        courseId: CourseId;
    }

    export interface IMaskedQuiz extends IQuiz {
        correct: number;       // { v = -1 }    
    }

    export interface Tagged<A> {
        tag: number;
        data: A;
    }

    export interface Map<K, V> { [x: string]: V }


}