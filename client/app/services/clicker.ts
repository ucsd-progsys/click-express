
import * as t   from 'types';
import * as url from '../shared/url';

// TODO: get this asynchronously
// http://blog.ninja-squad.com/2015/05/28/angularjs-promises/
//
declare let username: t.UserName;

export interface IClickerService {
    username: t.UserName;
    socket: SocketIOClient.Socket;
    getSocket(): SocketIOClient.Socket;
    registerSocket(socket: SocketIOClient.Socket): void;
    getCourse(): t.CourseId;
    getQuiz(): t.QuizId;
    connectSocket(course: t.CourseId): void;
    // onSocket: any;
}

export function clickerService($http: angular.IHttpService, $location: angular.ILocationService, $routeParams, $rootScope): IClickerService {


    return {
        username : username,
        socket   : io.connect(url.getServerURL()),

        registerSocket: (socket: SocketIOClient.Socket) => { this.socket = socket; },
        getCourse     : () => $routeParams.courseId,
        getQuiz       : () => $routeParams.quizId,

        getSocket     : () => this.socket,
        connectSocket : (course: t.CourseId) => {
                            console.log('Setting service socket to', url.getServerURL() + '/' + course);
                            this.socket = io.connect(url.getServerURL() + '/' + course);
                        }

    };
}
