
// URL API 

module Url {
    export function getServerURL() {
        return window.location.protocol + "//" + window.location.host;
    }

    export function getHistoryURL() {
        return getServerURL() + '/history';
    }

    export function getSaveQuizURL() {
        return getServerURL() + '/savequiz';
    }

    export function isHomeURL() {
        return (window.location.pathname === '/home');
    }

    export function getQuestionsURL() {
        return getServerURL() + '/questions';
    }
}