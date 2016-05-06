
// URL API 

export function getServerURL() {
    return window.location.protocol + "//" + window.location.host;
}

function getHistoryURL() {
    return getServerURL() + '/history';
}

export function getPostQuizURL(course: string) {
    return getServerURL() + '/course/' + course + '/quiz/new';
}

export function getCurrentURL() {
    return window.location.href;
}

function isHomeURL() {
    return (window.location.pathname === '/home');
}

function getQuestionsURL() {
    return getServerURL() + '/questions';
}

function getSelectClassURL() {
    return getServerURL() + '/select';
}

function getCourseURL(course: string) {
    return getServerURL() + '/course/' + course;
}

