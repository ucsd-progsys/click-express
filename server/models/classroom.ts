
export class ClassRoom {
    
    public name            : string;
    public description     : string;
    public instructorSocket: SocketIO.Socket;
    public studentSockets  : Map<SocketIO.Socket>;
    public activeQuiz      : IQuiz;
    
    
    public startQuiz(q: IQuiz) {
        this.activeQuiz = q;        
    }
    
    public studentEnters(studentId: string) {
        
        // If there is an active quiz, send it over
        if (this.activeQuiz) {
                     
        }
        
        // create new socket        
        
    }
    
    public studentLeaves() {
        
    }
    
    constructor(_name: string, _description: string) {
        this.name        = _name;
        this.description = _description;        
    }
       
}