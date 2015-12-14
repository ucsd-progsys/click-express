////////////////////////////////////////////////////////////////////////
// Globally Useful Type Definitions ////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export type MessageDscr = string;

export const QUIZ_CREATE = "QUIZ_CREATE";
export const QUIZ_BCAST  = "QUIZ_BCAST";
export const QUIZ_STOP   = "QUIZ_STOP";
export const QUIZ_ANS    = "QUIZ_ANS";


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
    message: string;    // Question (TODO: in Markdown) 
}

export interface QuizAnswer {
    quizId: number;
    userId: string;
    answer: string;		// ['A'..'E']
    time: Date;
}
