/*
    Assume the db is a key-value store.
*/


/*
    Generic Query to a key value store:
 
    For each method `r` denotes an object matching the predicate 
    described by the query.
    
 */
interface IQuery {

    /*@ is<V>(k: string, v: V): void || post: { offset(r, k) = v } */
    is<V>(k: string, v: V): void;

    /*@ between<V>(k: string, v1: V, v2: V): void; || post: { offset(r, k) > v1 && ... } */
    between<V>(k: string, v1: V, v2: V): void;

}

// Mongoose query

type KeyMap = { [x: string]: any };

/*
    For the implementation of  
 */
export class MgQuery implements IQuery {
    private _fields: KeyMap = {};

    public toFields() {
        return this._fields;
    }

    public is<V>(k: string, v: V | undefined): void {
        if (v) {
            this._fields[k] = v;
        }
    }

    public between<V>(k: string, v1: V | undefined, v2: V | undefined): void {
        if (v1 && v2) {
            this._fields[k] = { '$gte': v1, '$lt': v2 };
        } else if (v1) {
            this._fields[k] = { '$gte': v1 };
        } else if (v2) {
            this._fields[k] = { '$lt': v2 };
        }
    }
}

