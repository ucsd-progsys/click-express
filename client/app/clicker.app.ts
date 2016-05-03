
import * as ng from 'angular';

import { SocketService      } from './services/socket';
import { ClassSelectionCtrl } from './components/classSelection';
import { createQuizCtrl     } from './components/create';           // TODO --> TS
import { quizCtrl           } from './components/quiz';
import { studentClickCtrl   } from './components/student';
import * as url               from './shared/url';

let socket = io(url.getServerURL());

// 'ngSanitize',     --> Markdown html sanitization
// 'ng.bs.dropdown'  --> dropdown

export let click = angular
    .module    ('click'             , ['ngSanitize', 'ng.bs.dropdown'])
    .factory   ('socketService'     , () => new SocketService(socket))
    .controller('classSelectionCtrl', ClassSelectionCtrl)   
    .controller('createQuizCtrl'    , createQuizCtrl)
    .controller('quizCtrl'          , quizCtrl)
    .controller('studentClickCtrl'  , studentClickCtrl);
