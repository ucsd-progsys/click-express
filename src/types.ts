////////////////////////////////////////////////////////////////////////
// Globally Useful Type Definitions ////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export const enum Message {
    QuizStart
  , QuizStop
  , QuizAck
  , UserExists
  , ClickFail
  , ClickOk
  }

export const enum Status {
    Off
  , Quiz
  , Clicked
  }

export interface SocketEvent {
    kind: Message
  , info: any
}
