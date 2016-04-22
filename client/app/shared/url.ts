
// URL API 

function getServerURL() {
    return window.location.protocol + "//" + window.location.host;
}

function getHistoryURL() {
    return getServerURL() + '/history';
}

function getSaveQuizURL() {
    return getServerURL() + '/savequiz';
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

