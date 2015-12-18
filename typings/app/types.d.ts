
////////////////////////////////////////////////////////////////////////
// Globally Useful Type Definitions ////////////////////////////////////
////////////////////////////////////////////////////////////////////////

declare type MessageDscr = string;

// TODO: fix ?
declare const enum Message {
    QuizCreate,
    QuizBCast,
    QuizStop,
    QuizAck,
    UserExists,
    ClickFail,
    ClickOk
}

interface SocketEvent {
    kind: MessageDscr,
    info: any
}

declare type Option  = { index: string, text: string };
declare type Options = Option[];

// Corresponds to the QuizS schema
interface QuizContent {
    courseId   : string;
    description: string;         // Text description
    options    : Options;        // Available options
    correct    : string;         // The correct answer
    author     : string;
    startTime  : Date;
    // TODO: 
    // explanation: string;
}

interface Course {
    name       : string;
    description: string;
    instructor : string;
}

interface Quiz {
    id         : string;         // Object Id for QuizContent
    data       : QuizContent;
}

interface Click {
    username   : string;
    quizId     : string;        // The quiz ObjecId
    choice     : string;	    // ['A'..]
    submitTime : Date;
}

interface Tagged<A> {
    tag: number;
    data: A;
}
