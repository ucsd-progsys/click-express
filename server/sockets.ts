/// <reference path='../typings/tsd.d.ts' />
import t              = require('./types');
import models         = require('./models');

declare var io: SocketIO.Server;

export let onConnection = (io: SocketIO.Server) => (socket: SocketIO.Socket) => {

    // Disconnect
    socket.on('disconnect', () => console.log('bye-bye user: ' + socket.id));

    // Instructor started a quiz - broadcast it!
    // socket.on(t.QUIZ_START, (quizData: QuizContent) => {
    socket.on(t.QUIZ_START, (quiz: Quiz) => {
        
        io.emit(t.QUIZ_START, quiz);
        
        // new models.Quiz({
        //     courseId: "TODO-courseId",
        //     descr: quizData.description,
        //     options: quizData.options,
        //     correct: quizData.correct,
        //     author: quizData.author,
        //     startTime: new Date()
        // }).save((err: any, quiz: any) => {
        //     if (err) {
        //         console.log(err)
        //     }
        //     else {
        //         let qid = quiz._id.valueOf();
        //         console.log('new quiz added to store: ' + qid);
        //         let newQuiz: Quiz = {
        //             id: qid,
        //             data: quizData
        //         }
        //         io.emit(t.QUIZ_START, newQuiz);
        //     }
        // })
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



    function toTagged<A,B>(box: Tagged<A>, x: B): Tagged<B> {
        return { tag: box.tag, data: x }
    }
    function mkQuiz(id: string, data: QuizContent): Quiz {
        return { id: id, data: data };
    }

    // Save Quiz submitted by instructor
    socket.on(t.QUIZ_SAVE, (tquiz: Tagged<QuizContent>) => {
        console.log('About to save:');
        console.log(JSON.stringify(tquiz.data, null, '  '));
        new models.Quiz(tquiz.data).save((err: any, quiz: any) => {
            if (err) {
                console.log(err)
            }
            else {
                let qid = quiz._id.valueOf();
                console.log('New quiz with id ' + qid + ' to store.');
                let newQuiz = mkQuiz(qid, tquiz.data);
                // Reply to instructor with the new quiz
                socket.emit(t.QUIZ_SAVED, toTagged(tquiz, newQuiz));        // Payload: Tagged<Quiz>
            }
        });
    });

};
