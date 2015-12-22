
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

// declare type Option  = { index: string, text: string };
declare type Options = string[];    // Option[]

// Corresponds to the QuizS schema
interface IQuizContent {
    courseId   : string;
    description: string;         // Text description
    options    : string[];       // was Options;        // Available options
    correct    : number;         // The correct answer
    author     : string;
    timeCreated: Date;
}

interface ICourse {
    name       : string;
    description: string;
    instructor : string;
}

interface IQuiz extends IQuizContent {
    _id         : string;       // Object Id for QuizContent
}

interface IMaskedQuiz extends IQuiz {
    correct     : number;       // { v = -1 }    
}

interface IClick {
    username   : string;
    quizId     : string;        // The quiz ObjecId
    choice     : number;
    submitTime : Date;
}

interface Tagged<A> {
    tag: number;
    data: A;
}
