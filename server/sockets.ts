/// <reference path='../typings/tsd.d.ts' />

import t = require('./types');
import models = require('./models');


////////////////////////////////////////////////////////////////////
// Auxiliary ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function toTagged<A>(tag: number, x: A): Tagged<A> {
    return { tag: tag, data: x }
}

////////////////////////////////////////////////////////////////////
// Setup Instructor ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function setupInstructor(io: SocketIO.Server, socket: SocketIO.Socket, classRoom: string) {

    socket.on(t.QUIZ_START, (quiz: IQuiz) => {
        console.log('### broadcasting to room ', classRoom, ' a quiz with id: ', quiz._id);
        io.to(classRoom).emit(t.QUIZ_START, quiz);
    });

    socket.on(t.QUIZ_STOP, (data: any) => {
        io.to(classRoom).emit(t.QUIZ_STOP, data);
    });

    socket.on(t.QUIZ_SAVE, (taggedQuizContent: Tagged<IQuizContent>) => {
        let tag = taggedQuizContent.tag;
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
}

////////////////////////////////////////////////////////////////////
// Setup Student ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function setupStudent(io: SocketIO.Server, socket: SocketIO.Socket, classRoom: string) {

    socket.on(t.QUIZ_ANS, (click: IClick) => {
        new models.Click(click).save((err, _) => {
            if (err) console.log(err);
        });
    });

}

export function setup(io: SocketIO.Server) {

    io.on('connection', (socket: SocketIO.Socket) => {
        let userName = socket.handshake.query.userName;
        console.log('>>> ', userName, ' just connected');

        socket.on('disconnect', () => { 
            console.log('bye-bye user: ' + socket.id)
        });

        socket.on('join class', (className: string) => {

            // Leave previous room
            socket.leaveAll();           // NOT async

            // Join classroom
            socket.join(className, (err) => {
                if (err) {
                    console.log('Could not joing classroom.')
                    console.log(err);
                    return;
                }
                console.log('### ', userName, ' just joined ', className);
                if (userName === 'instructor') {
                    setupInstructor(io, socket, className);
                }
                else {
                    setupStudent(io, socket, className);
                }
            });
        });
    });

}