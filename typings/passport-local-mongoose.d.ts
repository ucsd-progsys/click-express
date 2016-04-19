
// Taken from here http://stackoverflow.com/questions/31829109/header-files-for-mongoose-plugin-method-extending-via-methods-and-statics/31976813#31976813

declare module 'mongoose' {
    // methods
    export interface PassportLocalDocument extends Document {
        setPassword(pass: string, cb: (err: any) => void): void;
    }

    // statics
    export interface PassportLocalModel<T extends PassportLocalDocument> extends Model<T> {
        authenticate(username: string, password: string, cb: (err: any) => void): void;
        register(username: T, password: string, cb: (err: any) => void): void;    
    }

    // plugin options
    export interface PassportLocalOptions {
        usernameField?: string;
        usernameLowerCase?: boolean;
    }

    export interface PassportLocalSchema extends Schema {
        plugin(
            plugin: (schema: PassportLocalSchema, options?: PassportLocalOptions) => void,
            options?: PassportLocalOptions): Schema;
    }

    export function model<T extends PassportLocalDocument>(
        name: string,
        schema?: PassportLocalSchema,
        collection?: string,
        skipInit?: boolean): PassportLocalModel<T>;
}

declare module 'passport-local-mongoose' {
    import mongoose = require('mongoose');
    var _: (schema: mongoose.Schema, Options?: Object) => void;
    export = _;
}