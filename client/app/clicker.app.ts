
import * as ng from 'angular';

import { FactoryService     } from './services/factory';

import { ClassSelectionCtrl } from './components/classSelection';   // TODO --> TS
import { createQuizCtrl     } from './components/create';           // TODO --> TS

// 'ngSanitize',     --> Markdown html sanitization
// 'ng.bs.dropdown'  --> dropdown

export let click = angular
    .module    ('click'             , ['ngSanitize', 'ng.bs.dropdown'])
    .factory   ('Data'              , () => new FactoryService())
    .controller('classSelectionCtrl', ClassSelectionCtrl)   
    .controller('createQuizCtrl'    , createQuizCtrl);
