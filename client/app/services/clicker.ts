
import * as t             from 'types';

export interface IClickerService {
    getSocket(): SocketIOClient.Socket;
    registerSocket(socket: SocketIOClient.Socket): void;
    course: t.CourseId;
    // getCourse(): t.CourseId;    
    // setCourse(course: t.CourseId): void;
}

export class ClickerService implements IClickerService {

    constructor() {
        console.log('initing service')
    }

    private socket: SocketIOClient.Socket;
    public  course: t.CourseId;
    
    getSocket() { 
        return this.socket; 
    }
    
    registerSocket(socket: SocketIOClient.Socket) {
        this.socket = socket;
    }
    
    // getCourse() {
    //     return this.course;
    // }
    
    // setCourse(course: t.CourseId): void {
    //     this.course = course;
    // }
    
}
