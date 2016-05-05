
import * as t             from 'types';

export interface IClickerService {
    getSocket(): SocketIOClient.Socket;
    registerSocket(socket: SocketIOClient.Socket): void;
    course: t.CourseId;
    username: t.UserName;
}

export class ClickerService implements IClickerService {
    private socket: SocketIOClient.Socket;
    public course: t.CourseId;
    public username: t.UserName;

    getSocket() {
        return this.socket;
    }

    registerSocket(socket: SocketIOClient.Socket) {
        this.socket = socket;
    }
}
