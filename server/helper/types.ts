
////////////////////////////////////////////////////////////////////////
// Globally Useful Constant Definitions ////////////////////////////////
////////////////////////////////////////////////////////////////////////

export const QUIZ_START         = "QUIZ_START";
export const QUIZ_STOP          = "QUIZ_STOP";
export const QUIZ_ANSWER        = "QUIZ_ANSWER";
export const ANSWER_RECEIVED    = "ANSWER_RECEIVED";
export const REQ_QUIZ_RESULTS   = "REQ_QUIZ_RESULTS";
export const RES_QUIZ_RESULTS   = "RES_QUIZ_RESULTS";
export const JOIN_CLASSROOM     = "JOIN_CLASSROOM";
export const CONNECTED_STUDENTS = "CONNECTED_STUDENTS";


class CMap<A> {
    
    private _m: { [x: string]: A } = {};

    public insert(key: string, value: A) {
        if (this._m[key]) {
            console.log('WARNING: key', key, 'already in map');            
        }
        this._m[key] = value;
    }
    
    public remove(key: string) {
        
        
        // TODO: check this
        delete this._m[key];
    }
        
    
}