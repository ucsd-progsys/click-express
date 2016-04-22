
/// <reference path='typings/tsd.d.ts' />
/// <reference path='./shared/misc.ts' />

let click = angular.module('click', [
    'ngAnimate',           // Modal element (optional)
    'ui.bootstrap',        // Modal element
    'ngSanitize',          // Markdown html sanitization
    'ng.bs.dropdown'       // dropdown
    ])

// Creating a custom 'Data' service, that can be accessed by 
// controllers of the 'click' app.
click.factory('Data', function clickFactory () {
    return { 
        courseName: '',
        userName  : '',
        socket    : undefined,
        courseList: []
    };
});
