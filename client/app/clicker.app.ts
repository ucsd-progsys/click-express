
import * as ng from 'angular';

import { FactoryService     } from './services/factory';
import { navCtrl            } from './components/navigation';

import { classSelectionCtrl } from './components/classSelection';   // TODO --> TS
import { createQuizCtrl     } from './components/create';           // TODO --> TS

// 'ngSanitize',     --> Markdown html sanitization
// 'ng.bs.dropdown'  --> dropdown

export let click = angular
    .module    ('click'             , ['ngSanitize', 'ng.bs.dropdown'])
    .factory   ('Data'              , () => new FactoryService())
    .controller('navCtrl'           , navCtrl)
    .controller('classSelectionCtrl', classSelectionCtrl)   
    .controller('createQuizCtrl'    , createQuizCtrl);
