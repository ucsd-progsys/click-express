
import * as t      from 'types';
import * as _      from 'underscore';
import * as marked from 'marked';


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

export function quizToHtml(q: t.IQuiz, showCorrect: boolean) {
    let cor = showCorrect ? q.correct : undefined;
    return (q) ? questionToHtml(q.description, q.options, cor) : '';
}

function quizDescriptionToHtml(q: t.IQuiz) {
    return marked(q.description);
}

export function questionToHtml(msg: string, opts: string[], correct?: number) {
    let withUndef = (o: any) => (o) ? o : '';
    let optStrs = opts.map((o, i) =>
        (i === correct) ?
            inBold(charFromInt(i) + '. ' + withUndef(o)) :
            inBold(charFromInt(i) + '. ') + withUndef(o)
    );
    let sep = '<hr>';
    return marked([msg, sep].concat(optStrs).join('\n\n'));
}


type GridElt = { id: number, hash: string, text: string };
type Grid    = { quizCols: GridElt[] }[];

export function arrangeGrid(qs: t.IQuiz[], rowLen: number): Grid  {
    let l = qs.length;
    let rows: Grid = [];
    let row: GridElt[] = [];
    _.range(l).forEach(i => {
        let j = i % rowLen;
        row.push(gridElt(i, qs[i]));
        if (j === rowLen - 1) {
            rows.push({ quizCols: row });
            row = [];
        }
    });
    if (row.length > 0) {
        rows.push({ quizCols: row });
    }
    return rows;
}

function gridElt(i: number, q: t.IQuiz): GridElt {
    return {
        id: i + 1,
        hash: q._id,
        text: q.description.substring(0, 80)
    };
}