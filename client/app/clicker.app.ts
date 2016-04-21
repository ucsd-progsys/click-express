
/// <reference path='typings/tsd.d.ts' />

declare var serverURL: string;

////////////////////////////////////////////////////////////////////////
// App Declaration /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

let click = angular.module('click', [
    'ngAnimate',           // Modal element (optional)
    'ui.bootstrap',        // Modal element
    'ngSanitize',          // Markdown html sanitization
    'ng.bs.dropdown'       // dropdown
    ]);


click.factory('Data', function () {
    return { 
        courseName: '',
        userName  : '',
        socket    : undefined
    };
});
