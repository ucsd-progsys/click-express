/// <reference path='../../typings/tsd.d.ts' />

import * as express  from 'express';
import * as passport from 'passport';

import * as t        from 'types';
import * as m        from 'models';

import * as Account  from '../models/account';
import * as Quiz     from '../models/quiz';
import * as Click    from '../models/click';
import * as Course   from '../models/course';


////////////////////////////////////////////////////////////////////////
// Messages ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

let msgUserExists = {
    kind: t.Message.UserExists,
    info: 'Sorry, that username already exists. Try again.'
};


////////////////////////////////////////////////////////////////////////
// Constants ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

const CLASSES = JSON.stringify(['CSE130', 'CSE230', 'CSE231', 'CSE105']);

////////////////////////////////////////////////////////////////////////
// Register ////////////////////////////////////////////////////////////
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
        () => res.render('register', msgUserExists),
        // Non-error state
        passport.authenticate('local')(req, res, () => res.redirect('/'))
    );
}


////////////////////////////////////////////////////////////////////////
// Login ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export function getLogin(req: express.Request, res: express.Response) {
    res.render('login', { user: req.user });
}

export let postLogin = passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login'
});


////////////////////////////////////////////////////////////////////////
// Authenticated Zone //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected.
// If the request is authenticated (typically via a persistent login
// session), the request will proceed.
// Otherwise, the user will be redirected to the login page.

export function auth(req: express.Request, res: express.Response, next: Function): void {
    if (req.isAuthenticated()) {
        return next();
    }
    res.render('index');
}

// INVARIANT: AUTH
export function redirectHome(req: express.Request, res: express.Response): void {
    res.redirect('/home');
}

export function home(url: string): express.RequestHandler {
    // Redirect user to pick a course
    return (req: express.Request, res: express.Response, next: any) => {
        if (courseNotSelected()) {
            res.redirect('course');
        }
    };
    function courseNotSelected() { return true; }
}

export function logout(req: express.Request, res: express.Response) {
    req.logout();
    res.redirect('/');
}

// Select course
export function courseSelect(req: express.Request, res: express.Response) {
    let user = req.user;
    // console.log('courseSelect: user is set', user);
    res.render('courses', { user });
}

// Render a course
export function course(req: express.Request, res: express.Response, next: any) {
    let course = req.params.course_id;
    let user = req.user;
    console.log('matched', course);
    Course.exists(course).then((exists) => {
        if (exists) {
            res.render('course', { user, course });
        } else {
            next();
        }
    });
}

function isInstructorReq(req: express.Request) {
    return req.user.username === 'instructor';
}

// function instructorHome(serverURL: string, req: express.Request, res: express.Response) {
//     let course = 'CSE130';
//     let user   = req.user;
//     let courseList = CLASSES;   // TODO: get from DB
//     Quiz.find(course)
//         .then((qs: m.IQuizModel[]) => {
//             res.render('instructor', {
//                 user,
//                 isInstructor: true,
//                 serverURL,
//                 courseList,
//                 questionPool: JSON.stringify(qs)
//             });
//         })
//         .catch((err: any) => {
//             // TODO
//         });
// }
// 
// function studentHome(serverURL: string, req: express.Request, res: express.Response) {
//     let courseList = CLASSES;   // TODO: get from DB
//     let user = req.user;
//     res.render('student', { user: user, isInstructor: false, serverURL, courseList });
// }


////////////////////////////////////////////////////////////////////////
// View Click History //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export function history(req: express.Request, res: express.Response) {
    res.render('history', {
        courseList: CLASSES,      // TODO: get them from the db
        isInstructor: isInstructorReq(req),
    });
}


////////////////////////////////////////////////////////////////////////
// Data Requests (JSON) ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export function historyData(req: express.Request, res: express.Response) {
    let username = req.user.username;
    Click.find({ quizId: username })
         .then((clicks: t.IClick[]) => {
             res.json(clicks);
         })
         .catch((reason) => {
             res.render('history', {
                 error: reason.toString(),
                 courseList: CLASSES      // TODO: get them from the db
             })
         });
}

// Request class list
export function courseList(req: express.Request, res: express.Response) {
    Course.getAll()
          .then((courses: t.ICourse[]) => {
              res.json(JSON.stringify(courses.map(c => c.name)));
          })
          .catch((reason) => {
              console.log('error at recovering classes!!!');
              res.json(JSON.stringify([]));
          });
}


////////////////////////////////////////////////////////////////////////
// Create Quiz /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export function createQuiz(req: express.Request, res: express.Response) {
    res.render('create', {
        user: req.user,
        isInstructor: isInstructorReq(req),
        courseList: CLASSES     // TODO: get them from the db
    });
}

export function saveQuiz(req: express.Request, res: express.Response) {

    console.log(req.body);

    Quiz.add(req.body);
}
