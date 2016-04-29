
import * as ng from 'angular';

import { FactoryService     } from './services/factory';

import { ClassSelectionCtrl } from './components/classSelection';
import { createQuizCtrl     } from './components/create';           // TODO --> TS
import { InstructorCtrl     } from './components/instructor';
import { quizCtrl           } from './components/quiz';

// 'ngSanitize',     --> Markdown html sanitization
// 'ng.bs.dropdown'  --> dropdown

export let click = angular
    .module    ('click'             , ['ngSanitize', 'ng.bs.dropdown'])
    .factory   ('Data'              , () => new FactoryService())
    .controller('classSelectionCtrl', ClassSelectionCtrl)   
    .controller('createQuizCtrl'    , createQuizCtrl)
    .controller('instructorCtrl'    , InstructorCtrl)
    .controller('quizCtrl'          , quizCtrl);
