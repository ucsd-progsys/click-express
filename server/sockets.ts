/// <reference path='../typings/tsd.d.ts' />

import t = require('./types');
import models = require('./models');

////////////////////////////////////////////////////////////////////
// Auxiliary ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function toTagged<A>(tag: number, x: A): Tagged<A> {
    return { tag: tag, data: x }
}

// Maps classrooms to active questions
// Clicks after time has run out should be disregarded.
let openQuestions: { [x: string]: IQuiz } = { };

////////////////////////////////////////////////////////////////////
// Setup Instructor ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function maskCorrectAnswer(q: IQuiz): IMaskedQuiz {
    let clone: IQuiz = JSON.parse(JSON.stringify(q));   //fast cloning
    clone.correct = -1; 
    return clone;
}

function setupInstructor(io: SocketIO.Server, socket: SocketIO.Socket, classRoom: string) {

    socket.on(t.QUIZ_START, (quiz: IQuiz) => {
        console.log('[room:', classRoom, '] Quiz start (id: ', quiz._id, ')');
        openQuestions[classRoom] = quiz;
        io.to(classRoom).emit(t.QUIZ_START, maskCorrectAnswer(quiz));
    });

    socket.on(t.QUIZ_STOP, (data: any) => {
        io.to(classRoom).emit(t.QUIZ_STOP, data);
        openQuestions[classRoom] = undefined;        
    });

    // socket.on(t.QUIZ_SAVE, (taggedQuizContent: Tagged<IQuizContent>) => {
    //     let tag = taggedQuizContent.tag;
    //     let quizContent = taggedQuizContent.data;

    //     new models.Quiz(quizContent).save((err: any, quiz: IQuiz) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //         else {
    //             // Reply to instructor with a *tagged* version of the quiz
    //             socket.emit(t.QUIZ_SAVED, toTagged(tag, quiz));
    //         }
    //     });
    // });
}

////////////////////////////////////////////////////////////////////
// Setup Student ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function setupStudent(io: SocketIO.Server, socket: SocketIO.Socket, classRoom: string) {

    socket.on(t.QUIZ_ANSWER, (click: IClick) => {
        if (openQuestions[classRoom]._id === click.quizId) {
            new models.Click(click).save((err, _) => {
                if (err) { 
                    console.log(err);
                }
                else {
                    console.log('click from ', click.username, ' saved.');
                }
            });
        }
        else {
            console.log('click from ', click.username, ' is invalid.');
        }
    });

}

export function setup(io: SocketIO.Server) {

    io.on('connection', (socket: SocketIO.Socket) => {
        let userName = socket.handshake.query.userName;
        console.log('>>> ', userName, ' just connected');

        socket.on('disconnect', () => { 
            console.log('bye-bye user: ' + socket.id)
        });

        socket.on(t.JOIN_CLASSROOM, (className: string) => {
            // Leave previous room
            socket.leaveAll();           // sync
            // Join classroom
            socket.join(className, (err) => {
                if (err) {
                    console.log('Could not joing classroom.')
                    console.log(err);
                    return;
                }
                
                console.log('[room:', className, '] ', userName, 'just joined');
                
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