/// <reference path='../typings/tsd.d.ts' />
import t = require('./types');
import models = require('./models');

declare var io: SocketIO.Server;

export let onConnection = (io: SocketIO.Server) => (socket: SocketIO.Socket) => {

    // Disconnect
    socket.on('disconnect', () => console.log('bye-bye user: ' + socket.id));

    // Instructor started a quiz - broadcast it!
    socket.on(t.QUIZ_START, (quiz: IQuiz) => {
        io.emit(t.QUIZ_START, quiz);
        console.log('Broadcasting quiz with ID: ', quiz._id);
    });

    // Instructor stopped a quiz - broadcast it!
    socket.on(t.QUIZ_STOP, (data: any) => {
        io.emit(t.QUIZ_STOP, data);
    });

    // Student sent a click
    socket.on(t.QUIZ_ANS, (click: IClick) => {
        new models.Click(click).save((err, _) => {
            if (err) console.log(err);
        });
    });

    function toTagged<A>(tag: number, x: A): Tagged<A> {
        return { tag: tag, data: x }
    }
    // function mkQuiz(id: string, data: IQuizContent): IQuiz {
    //     return { id: id, data: data };
    // }

    // Save Quiz submitted by instructor
    socket.on(t.QUIZ_SAVE, (taggedQuizContent: Tagged<IQuizContent>) => {
        let tag         = taggedQuizContent.tag;
        let quizContent = taggedQuizContent.data;
        new models.Quiz(quizContent).save((err: any, quiz: IQuiz) => {
            if (err) {
                console.log(err);
            }
            else {               
                // Reply to instructor with a *tagged* version of the quiz
                socket.emit(t.QUIZ_SAVED, toTagged(tag, quiz));        
            }
        });
    });

};
