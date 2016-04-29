
import * as t from 'types';

import { IFactoryService } from '../services/factory';
import { charFromInt }     from '../../../shared/misc';

// declare let username: string;
declare let io      : any;

declare let serverError: any;
declare let quizToHtml : any; 

// TODO: make this into a service
// let socket = io({ query: 'username=' + username });

export class InstructorCtrl {
        
    // Private fields
    
    questionPool = [];
        
        
    initQuestionPool() {
        function replaceEndSlash(url: string) {     
            return url.replace(/\/$/, "");
        } 
        
        
        this.$http.get(replaceEndSlash(window.location.pathname) + '/questions')
            .then((data: any) => {
                let questions = JSON.parse(data.data);
                // TODO
                // this.$scope.questionPool = questions;
            });
    }
    
        
        
    static $inject = ['$scope', '$http', '$window', '$location', '$timeout', 'FactoryService']; 
    constructor(
        private $scope        : angular.IScope, 
        private $http         : angular.IHttpService, 
        private $window       : angular.IWindowService, 
        private $location     : angular.ILocationService, 
        private $timeout      : angular.ITimeoutService, 
        private FactoryService: IFactoryService) 
    {
        // FactoryService.setSocket(socket);        
        this.initQuestionPool();    
    }

    // // Populate CommonData
    // $scope.CommonData = Data;
    // $scope.CommonData.socket = socket;
    // $scope.CommonData.username = username;

    // Auxiliary functions
    charFromInt(n: number): string { 
        return charFromInt(n); 
    }

    // ////////////////////////////////////////////////////////////////////
    // // State Flags /////////////////////////////////////////////////////
    // ////////////////////////////////////////////////////////////////////

    // const stateFlags = ['quizEmpty', 'quizStale', 'quizReady', 'quizStarted'];
    
    // function setFlag(f: string) {
    //     stateFlags.forEach(s => { $scope[s] = false; });
    //     $scope[f] = true;
    // }
    
    // function setQuizEmpty() { setFlag('quizEmpty') }
    // function setQuizStale() { setFlag('quizStale') }
    // function setQuizReady() { setFlag('quizReady') }
    // // IMPORTANT initial state
    // setQuizEmpty();

    // // DEBUG
    // function currentState() {
    //     return stateFlags.filter(s => !!($scope[s]))[0];
    // }

    // function acceptStates(xs: string[]) {
    //     let s = currentState();
    //     if (xs.indexOf(s) === -1) {
    //         let e = new Error('dummy');
    //         let stack = (<any>e).stack.replace(/^[^\(]+?[\n$]/gm, '')
    //             .replace(/^\s+at\s+/gm, '')
    //             .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
    //             .split('\n');
    //         console.log(stack);
    //         console.log('BUG: state(s) ', xs.join(' or '), ' expected, but ', s, ' found.');
    //     }
    // }

    // ////////////////////////////////////////////////////////////////////
    // // Question Pool ///////////////////////////////////////////////////
    // ////////////////////////////////////////////////////////////////////


    // $scope.selectedTestAccount = null;
    // $scope.testAccounts = [];
    





    // ////////////////////////////////////////////////////////////////////
    // // Preview /////////////////////////////////////////////////////////
    // ////////////////////////////////////////////////////////////////////

    // $scope.preview = () => quizToHtml(getCurrentQuiz(), showAnswer());


    // // Inform about a student answering a question
    // socket.on('ANSWER_RECEIVED', (data: { isCorrect: boolean }) => {
    //     console.log('An answer:', data.isCorrect, 'was received');
    //     $scope.studentsAnsweredCount++;
    //     if (data.isCorrect) {
    //         $scope.studentsAnsweredCorrectCount++;
    //     }
    //     else {
    //         $scope.studentsAnsweredWrongCount++;
    //     }
    // });


}
