/// <reference path='../typings/tsd.d.ts' />
import t              = require('./types');
import models         = require('./models');

declare var io: SocketIO.Server;
    
export let onConnection = (io: SocketIO.Server) => (socket: SocketIO.Socket) => {
    
    // Disconnect
    socket.on('disconnect', () => console.log('bye-bye user: ' + socket.id));

    // Instructor started a quiz - broadcast it!
    socket.on(t.QUIZ_START, (quizData: QuizContent) => {
        new models.Quiz({
            courseId: "TODO-courseId",
            descr: quizData.description,
            options: quizData.options,
            correct: quizData.correct,
            author: quizData.author,
            startTime: new Date()
        }).save((err: any, quiz: any) => {
            if (err) {
                console.log(err)
            }
            else {
                let qid = quiz._id.valueOf();
                console.log('new quiz added to store: ' + qid);
                let newQuiz: Quiz = {
                    id: qid,
                    data: quizData
                }
                io.emit(t.QUIZ_START, newQuiz);
            }
        })
    });

    // Instructor stopped a quiz - broadcast it!
    socket.on(t.QUIZ_STOP, (data: any) => {
        io.emit(t.QUIZ_STOP, data);
    });

    // Student sent a click
    socket.on(t.QUIZ_ANS, (click: Click) => {
        new models.Click(click).save((err, _) => {
            if (err) console.log(err);
        });
    });

};
