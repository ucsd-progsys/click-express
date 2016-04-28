
import * as express  from 'express';
import * as passport from 'passport';
import * as t        from 'types';
import * as Account  from '../models/account';
import * as Quiz     from '../models/quiz';
import * as Click    from '../models/click';
import * as Course   from '../models/course';


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
    res.render('login', { user: req.user });
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
    res.render('index');
}

export function redirectHome(req: express.Request, res: express.Response): void {
    res.redirect('/home');
}

export function home(url: string): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: any) => {
        let path = '/user/' + req.user.username;
        res.redirect(path);
    };
}

export function logout(req: express.Request, res: express.Response) {
    req.logout();
    res.redirect('/');
}


////////////////////////////////////////////////////////////////////////
// Quiz API ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// TODO
export function quizSelect(req: express.Request, res: express.Response, next: any) {
    res.render('503');
}

// GET
export function quizNew(req: express.Request, res: express.Response, next: any) {
    res.render('503');
}

// POST - TODO: fix?
export function quizNewSubmit(req: express.Request, res: express.Response) {
    console.log('saveQuiz');
    console.log(req.body);
    Quiz.add(req.body);
    res.end('success');
}

export function newQuiz(req: express.Request, res: express.Response) {
    if (req && req.user && req.user.username === 'instructor') {
        let user         = req.user;
        let course       = req.params.course_id;
        let isInstructor = true;
        res.render('create', { user, isInstructor, course });
    } else {
        res.redirect('login');
    }
}

export function quizHome(req: express.Request, res: express.Response, next: any) {
    res.render('503');
}

// GET
export function quizEdit(req: express.Request, res: express.Response, next: any) {
    res.render('503');
}

// POST
export function quizEditSubmit(req: express.Request, res: express.Response, next: any) {
    res.render('503');
}


////////////////////////////////////////////////////////////////////////
// Course API //////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export function courseHome(req: express.Request, res: express.Response, next: any) {
    let course       = req.params.course_id;
    let user         = req.user;
    let isInstructor = user.username === 'instructor';
    Quiz.find(course)
        .then(quizList => {
            res.render('course', {
                user,
                isInstructor,
                quizList: quizList.map((q, i) => {
                    return {
                        id: i + 1,
                        hash: q._id,
                        text: q.description.substring(0, 80)
                    };
                })
            });
        })
        .catch(err => {
            console.log(err);
            console.log('No course found.');
        });
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
    Course.getAll()
        .then((courses: t.ICourse[]) => {
            res.render('user', {
                user,
                courseList: courses
            });
        })
        .catch((reason) => {
            console.log('error at accessing classes!!!');
            res.json(JSON.stringify([]));
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
    Click.find({ quizId: username })
         .then((clicks: t.IClick[]) => {
             res.json(clicks);
         })
         .catch((reason) => {
             res.render('history', {
                 error: reason.toString()
             });
         });
}

export function questions(req: express.Request, res: express.Response) {
    let course = req.params.course_id;
    Quiz.find(course).then((qs) => {
        let jqs = JSON.stringify(qs);
        res.json(jqs);
    });
}
