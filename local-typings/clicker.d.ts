
declare module 'types' {

    namespace e {

        const enum Message {
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


        // Type aliases

        type MessageDscr = string;
        type UserId = string; //  mongoose.Types.ObjectId;
        type CourseId = string; //  mongoose.Types.ObjectId;
        type QuizId = string; //  mongoose.Types.ObjectId;
        type StudentId = string;
        type UserName = string;

        // Model types

        interface IAccount {
            username: string;
            password: string;
            email: string;
        }

        interface IQuiz {
            courseId: string;
            description: string;
            options: string[];
            correct: number;
            author: string;
            timeCreated: Date;
        }

        interface ICourse {
            name: string;
            description: string;
            intstructor: string;
        }

        interface IClick {
            username: string;
            quizId: QuizId;
            choice: number;
            submitTime: Date;
        }

        interface IEnroll {
            userId: UserId;
            courseId: CourseId;
        }

        interface IMaskedQuiz extends IQuiz {
            correct: number;       // { v = -1 }    
        }

        interface Tagged<A> {
            tag: number;
            data: A;
        }

        interface Map<K, V> { [x: string]: V }

    }

    export = e;

}