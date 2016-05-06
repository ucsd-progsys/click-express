
/*
    Privacy Properties:

        1. Student A can only access his/her 'Account' info.

        2. Only the instructor can access the quizzes.


    Route authentication:

        /course/:course_id/         --> only allow enrolled students

        /course/:course_id/create   --> only allow instructor of class


        /user/:user_id/history/

        /user/:user_id/history/all

        /user/:user_id/history/:course_id

                |
                V

            exposed through req.params



    State (express.Request):

        - require these parts to be Immutable or Unique (and track evolution)

        - assume to be invariant throughout execution of routing

        USER_ID := req.user.username   --> invariant

        CLASS_ID := req.params.

*/


// package imports

// ES6
import * as express        from 'express';
import * as logger         from 'morgan';
import * as bodyParser     from 'body-parser';
import * as session        from 'express-session';
import * as passport       from 'passport';
import * as mongoose       from 'mongoose';
import * as path           from 'path';
import * as passportLocal  from 'passport-local';
import * as socketIO       from 'socket.io';
import * as handlebars     from 'express-handlebars';
import * as favicon        from 'serve-favicon';
import * as http           from 'http';

import * as cookieParser   from 'cookie-parser';

import * as routes         from './controllers/routes';
import * as sockets        from './controllers/sockets';
import { Account }         from './models/account';

// Passport
let LocalStrategy = passportLocal.Strategy;

// Express app
let app           = express();
let httpServer    = http.createServer(app);

// Socket
let io            = socketIO(httpServer);


////////////////////////////////////////////////////////////////////
// Express /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.set('port', process.env.PORT || 3000);
let serverPort = app.get('port');

////////////////////////////////////////////////////////////////////
// Views ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.set('views', path.join(__dirname, '/../client/views'));
app.engine('.hbs', handlebars({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, '/../client/views/layouts')
}));
app.set('view engine', '.hbs');

////////////////////////////////////////////////////////////////////
// Sessions ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../client/assets/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

// app.use(flash());


////////////////////////////////////////////////////////////////////
// Authentication //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.use(passport.initialize());
app.use(passport.session());

////////////////////////////////////////////////////////////////////
// Static Content //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.use(express.static(path.join(__dirname, '../app/html')));
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, '../node_modules')));



////////////////////////////////////////////////////////////////////
// socket.io ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

io.on('connection', sockets.onConnect);


////////////////////////////////////////////////////////////////////
// Routes //////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

// Order matters here

// Admin API
app.get ('/register',              routes.registerWith({}));
app.post('/register',              routes.register);
app.get ('/'        , routes.auth, routes.redirectHome);
app.get ('/home'    , routes.auth, routes.home(serverPort));
app.get ('/login'   ,              routes.getLogin);
app.post('/login'   ,              routes.postLogin);
app.get ('/logout'  ,              routes.logout);

// Course API
app.get ('/course/:course_id'         ,              routes.courseHome(io));
app.get ('/course/:course_id/students', routes.auth, routes.courseStudents);
app.get ('/course/:course_id/history' , routes.auth, routes.courseHistory);

// Quiz API
app.get ('/course/:course_id/quiz/new'            , routes.auth, routes.quizNew);
app.post('/course/:course_id/quiz/new'            , routes.auth, routes.quizNewSubmit);
app.get ('/course/:course_id/quiz/:quiz_id'       , routes.auth, routes.quizHome);
app.get ('/course/:course_id/quiz/:quiz_id/edit'  , routes.auth, routes.quizEdit);
app.post('/course/:course_id/quiz/:quiz_id/edit'  , routes.auth, routes.quizEditSubmit);
app.get ('/course/:course_id/quiz/:quiz_id/delete', routes.auth, routes.quizDelete);
app.get ('/course/:course_id/quiz/:quiz_id/start' , routes.auth, routes.quizStart(io));
app.get ('/course/:course_id/quiz/:quiz_id/stop'  , routes.auth, routes.quizStop(io));


// Html
app.get ('/select-course.html'       , routes.selectCourseHTML);

app.get ('/student-course.html'      , routes.studentCourseHTML);

app.get ('/instructor-course.html'   , routes.instructorCourseHTML);
app.get ('/instructor-quiz.html'     , routes.instructorQuizHTML);
app.get ('/instructor-create.html'   , routes.instructorCreateHTML);

app.get ('/courses'                  , routes.courses);
app.get ('/course/:course_id/quizzes', routes.getQuizzes);
app.get ('/quiz/:quiz_id'            , routes.getQuiz);

app.get ('/course/:course_id/socket' , sockets.initSocketConnection(io));


// User API
app.get ('/user/:user_id'           , routes.auth, routes.userHome);
app.get ('/user/:user_id/history'   , routes.auth, routes.userHistory);


////////////////////////////////////////////////////////////////////
// Passport config /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

////////////////////////////////////////////////////////////////////
// Mongoose ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

mongoose.connect('mongodb://localhost/click-express-mongoose');



////////////////////////////////////////////////////////////////////
// Start me up /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function handle404(err: any, req: express.Request, res: express.Response, next: Function) {
    res.status(404);
    res.render('404');
}

function handle500(err: any, req: express.Request, res: express.Response, next: Function) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
}

// 404 page
app.use(handle404);

// 500 page
app.use(handle500);

// Go!
httpServer.listen(app.get('port'), () => {
    console.log(
        'Express START: http://localhost:',
        serverPort, // app.get('port')
        'press Ctrl-C to kill.');
});
