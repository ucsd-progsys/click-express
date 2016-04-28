
import * as t from 'types';

import { IFactoryService } from '../services/factory';

// declare let username: string;
declare let io      : any;

declare let charFromInt: any;
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
    // function setQuizStarted() { setFlag('quizStarted') }
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
    





    // updateQuestionPool(questions: any) {
    //     this.$scope.questionPool = questions;
    // }
    // $scope.updateQuestionPool = updateQuestionPool;

    // function getQuestion(index: number) {
    //     return $scope.questionPool[index];
    // }

    // // Add a binding to the shared data for the navbar to access
    // $scope.CommonData.updateQuestionPool = updateQuestionPool;



    // ////////////////////////////////////////////////////////////////////
    // // Current Question ////////////////////////////////////////////////
    // ////////////////////////////////////////////////////////////////////

    // $scope.createQuestion = function() {
    //     $window.location.href = replaceEndSlash(window.location.pathname) + '/create';    
    // }



    // ////////////////////////////////////////////////////////////////////
    // // Current Question ////////////////////////////////////////////////
    // ////////////////////////////////////////////////////////////////////

    // // selectedQuestion: IQuiz
    // $scope.selectedQuestion = undefined;

    // // show correct answer
    // $scope.showCorrectAnswer = false;
    // function showAnswer() { return $scope.showCorrectAnswer; }

    // // Load existing question
    // function loadQuestion(index: number) {
    //     acceptStates(['quizReady', 'quizStale', 'quizEmpty']);
    //     let question = getQuestion(index);
    //     setCurrentQuiz(question);
    //     setQuizReady();
    // }

    // $scope.loadQuestion = loadQuestion;

    // function setCorrectChoiceStyle() {
    //     $scope.choices.forEach((_, i) => { $scope.choiceStyle[i] = {} });
    //     $scope.choiceStyle[$scope.correctChoice.index] = { 'background-color': '#cdf1c0' };
    // }

    // ////////////////////////////////////////////////////////////////////
    // // Current quiz ////////////////////////////////////////////////////
    // ////////////////////////////////////////////////////////////////////

    // function setCurrentQuiz(q: t.IQuiz) {
    //     $scope.selectedQuestion = q;
    // }
    // function unsetCurrentQuiz() {
    //     $scope.selectedQuestion = undefined;
    // }
    // function getCurrentQuiz(): t.IQuiz {
    //     return $scope.selectedQuestion;
    // }

    // ////////////////////////////////////////////////////////////////////
    // // Preview /////////////////////////////////////////////////////////
    // ////////////////////////////////////////////////////////////////////

    // $scope.preview = () => quizToHtml(getCurrentQuiz(), showAnswer());

    // ////////////////////////////////////////////////////////////////////
    // // Running the Quiz ////////////////////////////////////////////////
    // ////////////////////////////////////////////////////////////////////

    // // Timer    
    // function prettyTime(secs: number) {
    //     let res = "";
    //     let div = Math.floor(secs / 60);
    //     if (div > 0) {
    //         res += (div + " min(s) ");
    //     }
    //     res += ((secs % 60) + " sec(s) ");
    //     return res;
    // }            
    
    // $scope.counter = 0;
    // function resetTimeCounter() {
    //     $scope.counter = 0;
    // }
    
    // function resumeTimeCounter() {
    //     $timeout(() => {
    //         if (!$scope.quizStarted) return;
    //         $scope.counter++;
    //         $scope.counterString = prettyTime($scope.counter);
    //         resumeTimeCounter();
    //     }, 1000 /* 1 sec */);
    // }
    // function startTimeCounter() {
    //     resetTimeCounter();
    //     resumeTimeCounter();
    // }

    // // Quiz start/stop
    // function startQuiz() {
    //     acceptStates(['quizReady']);
    //     let q = getCurrentQuiz()
    //     if (q) {
    //         socket.emit('QUIZ_START', q);
    //         startTimeCounter();
    //         resetAnswerCounters();
    //         setQuizStarted();
    //         return;
    //     }
    //     console.log('ERROR: quiz not found!');
    // }

    // function stopQuiz() {
    //     acceptStates(['quizStarted']);
    //     socket.emit('QUIZ_STOP', {});
    //     resetTimeCounter();
    //     setQuizReady();
    // }

    // $scope.startQuiz = startQuiz;
    // $scope.stopQuiz = stopQuiz;

    // // Number of students that have answered
    // $scope.connectedStudentIds = [];

    // socket.on('CONNECTED_STUDENTS', (data: { connectedStudentIds: string[] }) => {
    //     $scope.totalStudentsInRoom = Object.keys(data.connectedStudentIds).length;
    // });

    // $scope.studentsAnsweredCount = -1;
    // $scope.totalStudentsInRoom   = -1;

    // function resetAnswerCounters() {
    //     $scope.studentsAnsweredCount        = 0;
    //     $scope.totalStudentsInRoom          = 0;
    //     $scope.studentsAnsweredCorrectCount = 0;
    //     $scope.studentsAnsweredWrongCount   = 0;
    // }           

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
