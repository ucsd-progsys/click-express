
import * as ng  from 'angular';

import { navbarCtrl       } from './components/shared/navbar';
import { selectCourseCtrl } from './components/shared/select-course';

import { clickerService   } from './services/clicker';
import { homeCtrl         } from './components/student/home';
import { courseCtrl       } from './components/student/course';

// 'ngSanitize',     --> Markdown html sanitization

export let click = angular
    .module    ('click'           , ['ngSanitize', 'ngRoute'])
    .factory   ('clickerService'  , clickerService)
    .controller('navbarCtrl'      , navbarCtrl)
    .controller('selectCourseCtrl', selectCourseCtrl)
    .controller('courseCtrl'      , courseCtrl)
    
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/', {
                   templateUrl: 'select-course.html',
                    controller: 'selectCourseCtrl'
                }).
                when('/course/:courseId', {
                    templateUrl: 'student-course.html',
                    controller: 'courseCtrl'
                });
        }]);
