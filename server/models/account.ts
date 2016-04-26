
import { Account } from '../models/schemas';
import * as t      from 'types';
import { MgQuery } from '../lib/db';


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

    Account.find(query.toFields());
}
