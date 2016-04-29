
import * as t from 'types';

function serverError(scope: any, data: any, status: any, e: any) {
    let s = "Request failed: " + e;
    scope.label = s;
    let msg = (data || s) + status;
    alert(msg);
}

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

export function charFromInt(n: number) {
    return String.fromCharCode(65 + n);
}

export function quizToHtml(q: t.IQuiz, showCorrect?: boolean) {
    return (q) ? questionToHtml(q.description, q.options, showCorrect ? q.correct : undefined) : "";
}

function quizDescriptionToHtml(q: t.IQuiz) {
    return marked(q.description);
}

export function questionToHtml(msg: string, opts: string[], correct?: number) {    
    let withUndef = o => (o) ? o : "";
    let optStrs = opts.map((o, i) => 
        (i === correct) ? inBold(charFromInt(i) + '. ' + withUndef(o)) :
                        inBold(charFromInt(i) + '. ') + withUndef(o));    
    let sep = "<hr>"
    return marked([msg, sep].concat(optStrs).join('\n\n'));
}
