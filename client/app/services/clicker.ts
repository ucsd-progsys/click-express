
import * as t             from 'types';

// TODO: get this asynchronously
// http://blog.ninja-squad.com/2015/05/28/angularjs-promises/
//
declare let username: t.UserName;

export interface IClickerService {
    username: t.UserName;
    getSocket(): SocketIOClient.Socket;
    registerSocket(socket: SocketIOClient.Socket): void;
    getCourse(): t.CourseId;
    getQuiz(): t.QuizId;
}

export function clickerService($http: angular.IHttpService, $location: angular.ILocationService, $routeParams): IClickerService {
    return {
        getSocket: () => {
            return this.socket;
        },
        registerSocket: (socket: SocketIOClient.Socket) => {
            this.socket = socket;
        },
        getCourse: () => $routeParams.courseId,
        getQuiz  : () => $routeParams.quizId,
        username : username
    };
}
