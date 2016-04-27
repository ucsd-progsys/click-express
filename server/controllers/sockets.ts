
import * as t        from 'types';
import * as c        from '../../shared/consts';


////////////////////////////////////////////////////////////////////
// Auxiliary ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

// function toTagged<A>(tag: number, x: A): t.Tagged<A> {
//     return { tag: tag, data: x }
// }

// Maps classrooms to active questions
// Clicks after time has run out should be disregarded.
let openQuestions: { [x: string]: t.IQuiz } = { };


function instructor() {
    // TODO
    return true;
}

// We only have one server instance per class.

export function onConnect(socket: SocketIO.Socket) {

    let io = socket.server;

    let userName = socket.handshake.query.userName;

    socket.on('disconnect', () => {
        console.log('bye-bye user: ' + socket.id);
    });


    // Starting the quiz
    socket.on(c.QUIZ_START, (quizId: t.QuizId) => {

        // TODO: ensure this is the instructor

        // console.log('[room:', classRoom, '] Quiz start (id: ', quiz._id, ')');

// TODO: notify class

//         // Students connected to classroom
//         let allIds = Object.keys(io.to(classRoom).connected);
//         let studentIds = _.reject(allIds, (i => i === socket.id));
//
//         // Update the 'openquestions' global variable
//         openQuestions[classRoom] = quiz;
//
//         // Broadcast question in classroom
//         io.to(classRoom).emit(c.QUIZ_START, maskCorrectAnswer(quiz));
//
//         // Inform instructor about connected students
//         socket.emit(c.CONNECTED_STUDENTS, { connectedStudentIds: studentIds })
    });







// XXX: Is this needed?
//
//     socket.on(c.JOIN_CLASSROOM, (className: string) => {
//
//         // Leave previous room
//         socket.leaveAll();
//
//         // Join classroom
//         socket.join(className, (err) => {
//             if (err) {
//                 console.log('ERROR: Could not join classroom.')
//                 console.log(err);
//                 return;
//             }
//
//             console.log('[room:', className, '] ', userName, 'just joined');
//
//             if (userName === 'instructor') {
//                 setupInstructor(className);
//             } else {
//                 setupStudent(className);
//             }
//
//         });
//     });



//     let instructorSockets: { [x: string]: SocketIO.Socket } = {};
// 
//     function maskCorrectAnswer(q: t.IQuiz): t.IMaskedQuiz {
//         let clone: t.IQuiz = JSON.parse(JSON.stringify(q));   //fast cloning
//         clone.correct = -1;
//         return clone;
//     }
// 
//     function setupInstructor(classRoom: string) {
// 
//         // Register the instructor's socket
//         instructorSockets[classRoom] = socket;
// 
// 
//         // Stopping the quiz
//         socket.on(c.QUIZ_STOP, (data: any) => {
//             io.to(classRoom).emit(c.QUIZ_STOP, data);
//             delete openQuestions[classRoom];
//         });
// 
//         // Get the results for a quiz
//         socket.on(c.REQ_QUIZ_RESULTS, (data: { qid: string}) => {
//             let oqid = new mongoose.Types.ObjectId(data.qid);
// 
//             Click.find({ "quizId": oqid }, (err: any, clicks: any) => {
//                 // console.log('REQ_QUIZ_RESULTS');
//                 // console.log(err)
//                 // console.log(clicks);
//                 socket.emit(c.RES_QUIZ_RESULTS, { quiz: data.qid, clicks: clicks });
//             });
// 
//         })
//     }

//     function setupStudent(classRoom: string) {
//
//         // Student answered the *current* question
//         socket.on(c.QUIZ_ANSWER, (click: t.IClick) => {
//             let currentQuiz = openQuestions[classRoom];
//
//             if (currentQuiz && currentQuiz._id === click.quizId) {
//
//                 // Save the click
//                 new models.Click(click).save((err, _) => {
//                     if (err) console.log(err);
//                 });
//
//                 // Notify the instructor
//                 let instructorSocket = instructorSockets[classRoom];
//                 if (instructorSocket) {
//                     instructorSocket.emit(c.ANSWER_RECEIVED, {
//                         isCorrect: currentQuiz.correct === click.choice
//                     });
//                 }
//             } else {
//                 console.log('ERROR: click from ', click.username, ' is invalid.');
//             }
//         });
//
//     }


}

