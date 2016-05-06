
import * as t             from 'types';

// TODO: get this asynchronously
// http://blog.ninja-squad.com/2015/05/28/angularjs-promises/
//
declare let username: t.UserName;
    
export interface IClickerService {
    getSocket(): SocketIOClient.Socket;
    registerSocket(socket: SocketIOClient.Socket): void;
    course: t.CourseId;
    username: t.UserName;
}

export function clickerService($http: angular.IHttpService): IClickerService {    
    
    console.log('!!!!! initializing service !!!!!');
        
    return {
        getSocket: () => {
            return this.socket;
        },
        registerSocket: (socket: SocketIOClient.Socket) => {
            this.socket = socket;
        },        
        course: '',
        username: username
    };
}
