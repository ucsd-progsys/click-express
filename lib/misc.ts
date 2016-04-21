
module Misc {
    export function serverError(scope: any, data: any, status: any, e: any) {
        let s = "Request failed: " + e;
        scope.label = s;
        let msg = (data || s) + status;
        alert(msg);
    }

    // HTML generation

    export function wrapIn(msg: string, t: string) {
        return ['<' , t, '>', msg, '</', t, '>'].join(''); 
    }

    export function inDiv(s: string) {
        return wrapIn(s, 'div');
    }

    export function inP(s: string) {
        return wrapIn(s, 'p');
    }

    export function inBold(s: string) {
        return wrapIn(s, 'b');
    }

    export function charFromInt(n: number) {
        return String.fromCharCode(65 + n);
    }

}