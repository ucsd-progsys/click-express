/// <reference path='../typings/tsd.d.ts' />

import t      = require('./types');
import models = require('./models');

export function setup(io: SocketIO.Server) {

    ////////////////////////////////////////////////////////////////////
    // Auxiliary ///////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    function toTagged<A>(tag: number, x: A): Tagged<A> {
        return { tag: tag, data: x }
    }
    
    ////////////////////////////////////////////////////////////////////
    // Socket.io: Pushing Questions to Clients /////////////////////////
    ////////////////////////////////////////////////////////////////////
    
    io.on('connection', (socket: SocketIO.Socket) => {
    
        ////////////////////////////////////////////////////////////////////
        // Common //////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////
        
        socket.on('disconnect', () => console.log('bye-bye user: ' + socket.id));
    
        ////////////////////////////////////////////////////////////////////
        // Instructor //////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////
        
        socket.on(t.QUIZ_START, (quiz: IQuiz) => {
            console.log('BROADCAST');
            io.emit(t.QUIZ_START, quiz);
            console.log('Broadcasting quiz with ID: ', quiz._id);
        });
    
        socket.on(t.QUIZ_STOP, (data: any) => {
            io.emit(t.QUIZ_STOP, data);
        });
    
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
        
        ////////////////////////////////////////////////////////////////////
        // Student /////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////
            
        socket.on(t.QUIZ_ANS, (click: IClick) => {
            new models.Click(click).save((err, _) => {
                if (err) console.log(err);
            });
        });
    
    
    });       
    
}