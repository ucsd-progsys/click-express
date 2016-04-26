
import * as mongoose   from 'mongoose';
import * as plmongoose from 'passport-local-mongoose';

import * as t          from 'types';
import { MgQuery }     from '../lib/db';

let Schema   = mongoose.Schema;

// Schema

let accountSchema: mongoose.PassportLocalSchema = new Schema({
    username: { type: String, index: true, unique: true },
    password: String,
    email: String
}).plugin(plmongoose);


// Model

export let Account  = mongoose.model<m.IAccountModel>('Account', accountSchema);


// API

export function register(username: t.UserName, email: string, password: string, cbError: () => void, cbSuccess: () => void) {
    let acc = new Account({ username, email });
    // console.log('Creating new account with');
    // console.log('  Username: ' + username);
    // console.log('  Ε-mail  : ' + email);
    // console.log('  Password: ' + password);
    Account.register(acc, password, (err: any) => {
        if (err) {
            cbError();
        }
        cbSuccess();
    });
}

export function view(username: t.UserId) {
    let query = new MgQuery();
    query.is('username', username);
    return Account.find(query.toFields()).exec();
}
