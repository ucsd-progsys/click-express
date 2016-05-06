
import { clickerService      } from './services/clicker';

import { navbarCtrl         } from './components/shared/navbar';
import { selectCourseCtrl   } from './components/shared/select-course';
import { courseCtrl         } from './components/instructor/course';
import { createQuizCtrl     } from './components/instructor/create';
import { quizCtrl           } from './components/instructor/quiz';

// 'ngSanitize',     --> Markdown html sanitization

export let click = angular
    .module    ('click'           , ['ngSanitize', 'ngRoute', 'ngMaterial'])
    .factory   ('clickerService'  , clickerService)
    .controller('navbarCtrl'      , navbarCtrl)
    .controller('selectCourseCtrl', selectCourseCtrl)
    .controller('courseCtrl'      , courseCtrl)
    .controller('createQuizCtrl'  , createQuizCtrl)
    .controller('quizCtrl'        , quizCtrl)   

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/', {
                   templateUrl: 'select-course.html',
                    controller: 'selectCourseCtrl'
                }).
                when('/course/:courseId', {
                    templateUrl: 'instructor-course.html',
                    controller: 'courseCtrl'
                }).
                when('/course/:courseId/quiz/:quizId', {
                    templateUrl: 'instructor-quiz.html',
                    controller: 'quizCtrl'
                }).
                when('/course/:courseId/new', {
                    templateUrl: 'instructor-create.html',
                    controller: 'createQuizCtrl'  
                });
        }]);
