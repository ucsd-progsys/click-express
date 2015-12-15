////////////////////////////////////////////////////////////////////////
// Globally Useful Type Definitions ////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export type MessageDscr = string;

export const QUIZ_START = "QUIZ_START";
export const QUIZ_STOP  = "QUIZ_STOP";
export const QUIZ_ANS   = "QUIZ_ANS";


export enum Message {
    QuizCreate,
    QuizBCast,    
    QuizStop,
    QuizAck,
    UserExists,
    ClickFail,
    ClickOk
}

export enum Status {
    Off,
    Quiz,
    Clicked
}

export interface SocketEvent {
    kind: MessageDscr,
    info: any
}

export interface QuizPost {
    id: number;
    name: string;       // Instructors name
    message: string;    // Question
    time: number;       // of seconds 
}

export interface QuizAnswer {
    quizId: number;
    userId: string;
    answer: string;		// ['A'..'E']
    submissionTime: Date;
}
