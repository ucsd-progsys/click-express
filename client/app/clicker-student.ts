
import * as ng  from 'angular';

import { ClickerService } from './services/clicker';
import { homeCtrl       } from './components/student/home';
import { courseCtrl     } from './components/student/course';

// 'ngSanitize',     --> Markdown html sanitization

export let click = angular
    .module    ('click'             , ['ngSanitize', 'ngRoute'])
    .factory   ('socketService'     , () => new ClickerService())
    
    .controller('homeCtrl'          , homeCtrl)
    .controller('courseCtrl'        , courseCtrl)

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/course', {
                    templateUrl: 'courseSelect.html',
                    controller: 'courseSelectCtrl'
                }).
                when('/course/:courseId', {
                    templateUrl: 'course.html',
                    controller: 'courseCtrl'
                });
        }]);
