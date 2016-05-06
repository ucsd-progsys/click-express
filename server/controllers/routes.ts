import * as path        from 'path';

import * as express     from 'express';
import * as passport    from 'passport';
import * as t           from 'types';

import * as Account     from '../models/account';
import * as Quiz        from '../models/quiz';
import * as Click       from '../models/click';
import * as Course      from '../models/course';

import { arrangeGrid
       , quizToHtml  }  from '../../shared/misc';

import * as Socket      from '../controllers/sockets';


////////////////////////////////////////////////////////////////////////
// Admin ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export function registerWith(z: Object): express.RequestHandler {
    return (req, res, next) => res.render('register', z);
}

export function register(req: express.Request, res: express.Response) {
    Account.register(
        req.body.username,
        req.body.email,
        req.body.password,
        // Error state
        () => res.render('register', {
            kind: t.Message.UserExists,
            info: 'Sorry, that username already exists. Try again.'
        }),
        // Non-error state
        passport.authenticate('local')(req, res, () => res.redirect('/'))
    );
}

export function getLogin(req: express.Request, res: express.Response) {
    console.log('Returning login');
    res.render('login', { user: req.user, loginScreen: true });
}

export let postLogin = passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login'
});


// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected.
// If the request is authenticated (typically via a persistent login
// session), the request will proceed.
// Otherwise, the user will be redirected to the login page.

export function auth(req: express.Request, res: express.Response, next: Function): void {
    if (req.isAuthenticated()) {
        return next();
    }
    // res.sendFile(path.join(__dirname + '../../../client/public/login.html'));
    res.render('login', { loginScreen: true });
}

export function redirectHome(req: express.Request, res: express.Response): void {
    res.redirect('/home');
}

// TODO: do we need the server port?
export function home(url: string): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: any) => {
        let role = (isInstructor(req)) ? 'instructor' : 'student';
        let user = req.user;
        res.render('index', { role, user });
    };
}

export function logout(req: express.Request, res: express.Response) {
    req.logout();
    res.redirect('/');
}


////////////////////////////////////////////////////////////////////////
// Quiz API ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export function quizNew(req: express.Request, res: express.Response, next: any) {
    // TODO: require instructor
    if (req && req.user && req.user.username === 'instructor') {
        let user = req.user;
        let course = req.params.course_id;
        res.render('quiz-create', { user, course });
    }
}

export function quizNewSubmit(req: express.Request, res: express.Response) {
    let course = req.params.course_id;
    let quiz: t.IQuiz = req.body;
    quiz.courseId = course;
    res.json(Quiz.add(quiz));
}

export function quizHome(req: express.Request, res: express.Response, next: any) {
    let qid = req.params.quiz_id;
    let user = req.user;
    let course = req.params.course_id;
    Quiz.findWithId(qid).then(quiz => {
        res.render('quiz-instructor', { user, course, quizRender: quizToHtml(quiz, false) });
    }).catch(err => {
        res.render('404');
    });
}

export function quizEdit(req: express.Request, res: express.Response, next: any) {
    res.render('503');
}

export function quizEditSubmit(req: express.Request, res: express.Response, next: any) {
    res.render('503');
}

export function quizDelete(req: express.Request, res: express.Response, next: any) {
    let quizId   = req.params.quiz_id;
    let courseId = req.params.course_id;
    // console.log('Deleting', qid);
    Quiz.delete_(quizId).then(_ => {
        res.status(200).send(courseId);
    }).onReject(err => {
        res.status(500).send(courseId);
    });
}

export function quizStart(io: SocketIO.Server) {
    return (req: express.Request, res: express.Response, next: any) => {

        console.log('Quiz Started');

        let quizId   = req.params.quiz_id;
        let courseId = req.params.course_id;
        // TODO: mask result
        Quiz.findWithId(quizId).then(quiz => {
            console.log('emitting quiz on', courseId);
            io./*of(courseId).*/emit('quiz_start', quiz);
        }).catch(err => {
            console.log(err);
        });
    };
}

export function quizStop(io: SocketIO.Server) {
    return (req: express.Request, res: express.Response, next: any) => {
        let quizId   = req.params.quiz_id;
        let courseId = req.params.course_id;

    };
}


////////////////////////////////////////////////////////////////////////
// Course API //////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

function isInstructor(req: express.Request) {
    return req.user.username === 'instructor';
}

export function courseHome(io: SocketIO.Server) {
    return (req: express.Request, res: express.Response, next: any) => {
        let course = req.params.course_id;
        let user = req.user;

        // Socket
        if (isInstructor(req)) {
            Socket.initSocketConnection(course, io);
        } else {
            Socket.initStudentConnection(course, io);
        }

        // Get Course info
        Quiz.findWithCourse(course).then(qs => {
            res.render('classroom', {
                user,
                course,
                isInstructor: isInstructor(req),
                quizRows: arrangeGrid(qs, 3)
            });
        }).catch(err => {
            console.log(err);
        });

    };
}

// TODO
export function courseStudents(req: express.Request, res: express.Response, next: any) {
    res.render('503');
}

export function courseHistory(req: express.Request, res: express.Response, next: any) {
    res.render('503');
}

////////////////////////////////////////////////////////////////////////
// User API ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export function userHome(req: express.Request, res: express.Response) {
    // TODO: only get the courses that the 'user' is subscribed to
    let user = req.user;
    Course.getAll().then((courses: t.ICourse[]) => {
        res.render('course-select', {
            user,
            courseList: courses
        });
    }).catch((reason) => {
        console.log('[ERROR] Cannot access classes.');
    });
}

export function userHistory(req: express.Request, res: express.Response) {
    res.render('503');
}


////////////////////////////////////////////////////////////////////////
// Data Requests (JSON) ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// Deprecated
export function historyData(req: express.Request, res: express.Response) {
    let username = req.user.username;
    Click.find({ quizId: username }).then((clicks: t.IClick[]) => {
        res.json(clicks);
    }).catch((reason) => {
        res.render('history', {
            error: reason.toString()
        });
    });
}

export function getQuizzes(req: express.Request, res: express.Response) {
    let course = req.params.course_id;
    Quiz.findWithCourse(course).then((qs) => {
        let jqs = JSON.stringify(qs);
        res.json(jqs);
    });
}

export function getQuiz(req: express.Request, res: express.Response) {
    let quizId = req.params.quiz_id;
    Quiz.findWithId(quizId).then(q => {
        res.json(JSON.stringify(q));
    });
}



// Get HTML
export function selectCourseHTML(req: express.Request, res: express.Response) {
    res.sendFile(path.join(__dirname + '../../../client/public/shared/select-course.html'));
}

export function instructorCourseHTML(req: express.Request, res: express.Response) {
    res.sendFile(path.join(__dirname + '../../../client/public/instructor/course.html'));
}

export function instructorQuizHTML(req: express.Request, res: express.Response) {
    res.sendFile(path.join(__dirname + '../../../client/public/instructor/quiz.html'));
}

export function instructorCreateHTML(req: express.Request, res: express.Response) {
    res.sendFile(path.join(__dirname + '../../../client/public/instructor/create.html'));
}

export function studentCourseHTML(req: express.Request, res: express.Response) {
    res.sendFile(path.join(__dirname + '../../../client/public/student/course.html'));
}


export function courses(req: express.Request, res: express.Response) {
    Course.getAll().then(cs => {
        res.json(JSON.stringify(cs));
    });
}


// Quiz select
