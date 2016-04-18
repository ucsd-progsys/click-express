
import mongoose   = require('mongoose');
import t          = require('./types');
import models     = require('../models/schemas');
import _          = require('underscore');
import sch        = require('../models/school');

var Click         = models.Click;
var Schema        = mongoose.Schema;
var ObjectId: any = Schema.Types.ObjectId;

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

var instructorSockets: Map<SocketIO.Socket> = {};

function maskCorrectAnswer(q: IQuiz): IMaskedQuiz {
    let clone: IQuiz = JSON.parse(JSON.stringify(q));   //fast cloning
    clone.correct = -1;
    return clone;
}

function setupInstructor(io: SocketIO.Server, socket: SocketIO.Socket, classRoom: string) {

    // Register the instructor's socket
    instructorSockets[classRoom] = socket;

    // Starting the quiz
    socket.on(t.QUIZ_START, (quiz: IQuiz) => {
        console.log('[room:', classRoom, '] Quiz start (id: ', quiz._id, ')');

        // Students connected to classroom
        let allIds = Object.keys(io.to(classRoom).connected);
        let studentIds = _.reject(allIds, (i => i === socket.id));

        // Update the 'openquestions' global variable
        openQuestions[classRoom] = quiz;

        // Broadcast question in classroom
        io.to(classRoom).emit(t.QUIZ_START, maskCorrectAnswer(quiz));

        // Inform instructor about connected students
        socket.emit(t.CONNECTED_STUDENTS, { connectedStudentIds: studentIds })
    });

    // Stopping the quiz
    socket.on(t.QUIZ_STOP, (data: any) => {
        io.to(classRoom).emit(t.QUIZ_STOP, data);
        openQuestions[classRoom] = undefined;
    });

    // Get the results for a quiz
    socket.on(t.REQ_QUIZ_RESULTS, (data: { qid: string}) => {
        let oqid = new mongoose.Types.ObjectId(data.qid);
        Click.find({ "quizId": oqid }, (err: any, clicks: any) => {
            // console.log('REQ_QUIZ_RESULTS');
            // console.log(err)
            // console.log(clicks);
            socket.emit(t.RES_QUIZ_RESULTS, { quiz: data.qid, clicks: clicks });
        });

    })
}

////////////////////////////////////////////////////////////////////
// Setup Student ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function setupStudent(io: SocketIO.Server, socket: SocketIO.Socket, classRoom: string) {

    // Student answered the *current* question
    socket.on(t.QUIZ_ANSWER, (click: IClick) => {
        let currentQuiz = openQuestions[classRoom];

        if (currentQuiz && currentQuiz._id === click.quizId) {

            // Save the click
            new models.Click(click).save((err, _) => {
                if (err) console.log(err);
            });

            // Notify the instructor
            let instructorSocket = instructorSockets[classRoom];
            if (instructorSocket) {
                instructorSocket.emit(t.ANSWER_RECEIVED, {
                    isCorrect: currentQuiz.correct === click.choice
                });
            }
        }
        else {
            console.log('ERROR: click from ', click.username, ' is invalid.');
        }
    });

}

export function setup(school: sch.School, io: SocketIO.Server) {

    io.on('connection', (socket: SocketIO.Socket) => {
        
        let userName = socket.handshake.query.userName;
        
        socket.on('disconnect', () => {
            console.log('bye-bye user: ' + socket.id)
        });
        
        socket.on(t.JOIN_CLASSROOM, (className: string) => {
            
            // Leave previous room
            socket.leaveAll();
            
            // Join classroom
            socket.join(className, (err) => {
                if (err) {
                    console.log('ERROR: Could not join classroom.')
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