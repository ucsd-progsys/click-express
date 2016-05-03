
export interface ISocketService {
    getSocket(): SocketIOClient.Socket;
}

export class SocketService implements ISocketService {

    constructor(private socket: SocketIOClient.Socket) {
        
    }
    
    getSocket() { 
        return this.socket; 
    }
    
}
