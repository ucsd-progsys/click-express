
// Mongoose query

type KeyMap = { [x: string]: any };

export class QueryFields {
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

