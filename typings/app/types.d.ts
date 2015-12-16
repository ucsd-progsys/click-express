
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

// TODO: fix ?
declare const enum Status {
    Off,
    Quiz,
    Clicked
}

interface SocketEvent {
    kind: MessageDscr,
    info: any
}

declare type Option  = { index: string, text: string };
declare type Options = Option[];

interface QuizContent {
    courseId  : string;
    descr     : string;         // Text descrription
    options   : Options;        // Available options
    correct   : string;         // The correct answer
    author    : string;    
}

interface Quiz {
    id        : string;    
    data      : QuizContent;
}

interface Click {
    userId    : string;
    quizId    : string;
    choice    : string;		   // ['A'..]
    submitTime: Date;
}
