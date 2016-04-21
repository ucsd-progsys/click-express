
function serverError(scope: any, data: any, status: any, e: any) {
    let s = "Request failed: " + e;
    scope.label = s;
    let msg = (data || s) + status;
    alert(msg);
}

// HTML generation

function wrapIn(msg: string, t: string) {
    return ['<' , t, '>', msg, '</', t, '>'].join(''); 
}

function inDiv(s: string) {
    return wrapIn(s, 'div');
}

function inP(s: string) {
    return wrapIn(s, 'p');
}

function inBold(s: string) {
    return wrapIn(s, 'b');
}

function charFromInt(n: number) {
    return String.fromCharCode(65 + n);
}
