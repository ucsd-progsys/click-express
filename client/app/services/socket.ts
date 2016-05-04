
export interface ISocketService {
    getSocket(): SocketIOClient.Socket;
    registerSocket(socket: SocketIOClient.Socket): void;
}

export class SocketService implements ISocketService {

    private socket: SocketIOClient.Socket
    
    getSocket() { 
        return this.socket; 
    }
    
    registerSocket(socket: SocketIOClient.Socket) {
        console.log('registering socket');
        this.socket = socket;
    }
    
}
