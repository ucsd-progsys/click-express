
/// <reference path='../typings/tsd.d.ts' />
/// <reference path='../../../typings/app/types.d.ts' />
/// <reference path='../../../lib/misc.ts' />
/// <reference path='../../../lib/url.ts' />

import * as t from 'types';

declare let click   : any;
declare let userName: string;
declare let io      : any;

declare function quizToHtml(q: t.IQuiz, showCorrect?: boolean);


let socket = io({ query: 'userName=' + userName });

////////////////////////////////////////////////////////////////////
// Instructor Controller ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function instructorClickCtrl($scope, $http, $uibModal, $location, $timeout, Data) {

    // Populate CommonData
    $scope.CommonData = Data;
    $scope.CommonData.socket = socket;
    $scope.CommonData.userName = userName;

    // Auxiliary functions
    $scope.charFromInt = Misc.charFromInt;

    ////////////////////////////////////////////////////////////////////
    // State Flags /////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    const stateFlags = ['quizEmpty', 'quizStale', 'quizReady', 'quizStarted'];
    function setFlag(f: string) {
        stateFlags.forEach(s => { $scope[s] = false; });
        $scope[f] = true;
    }
    function setQuizEmpty() { setFlag('quizEmpty') }
    function setQuizStale() { setFlag('quizStale') }
    function setQuizReady() { setFlag('quizReady') }
    function setQuizStarted() { setFlag('quizStarted') }
    // IMPORTANT initial state
    setQuizEmpty();

    // DEBUG
    function currentState() {
        return stateFlags.filter(s => !!($scope[s]))[0];
    }

    function acceptStates(xs: string[]) {
        let s = currentState();
        if (xs.indexOf(s) === -1) {
            let e = new Error('dummy');
            let stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
                .replace(/^\s+at\s+/gm, '')
                .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
                .split('\n');
            console.log(stack);
            console.log('BUG: state(s) ', xs.join(' or '), ' expected, but ', s, ' found.');
        }
    }

    ////////////////////////////////////////////////////////////////////
    // Question Pool ///////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    $scope.questionPool = [];

    function updateQuestionPool(questions: any) {
        $scope.questionPool = questions;
    }
    $scope.updateQuestionPool = updateQuestionPool;

    function getQuestion(index: number) {
        return $scope.questionPool[index];
    }

    // Add a binding to the shared data for the navbar to access
    $scope.CommonData.updateQuestionPool = updateQuestionPool;

    ////////////////////////////////////////////////////////////////////
    // Current Question ////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    // selectedQuestion: IQuiz
    $scope.selectedQuestion = undefined;

    // show correct answer
    $scope.showCorrectAnswer = false;
    function showAnswer() { return $scope.showCorrectAnswer; }

    // Load existing question
    function loadQuestion(index: number) {
        acceptStates(['quizReady', 'quizStale', 'quizEmpty']);
        let question = getQuestion(index);
        setCurrentQuiz(question);
        setQuizReady();
    }

    $scope.loadQuestion = loadQuestion;

    function setCorrectChoiceStyle() {
        $scope.choices.forEach((_, i) => { $scope.choiceStyle[i] = {} });
        $scope.choiceStyle[$scope.correctChoice.index] = { 'background-color': '#cdf1c0' };
    }

    ////////////////////////////////////////////////////////////////////
    // Current quiz ////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    function setCurrentQuiz(q: t.IQuiz) {
        $scope.selectedQuestion = q;
    }
    function unsetCurrentQuiz() {
        $scope.selectedQuestion = undefined;
    }
    function getCurrentQuiz(): t.IQuiz {
        return $scope.selectedQuestion;
    }

    ////////////////////////////////////////////////////////////////////
    // Preview /////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    $scope.preview = () => quizToHtml(getCurrentQuiz(), showAnswer());

    ////////////////////////////////////////////////////////////////////
    // Running the Quiz ////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    // Timer    
    function prettyTime(secs: number) {
        let res = "";
        let div = Math.floor(secs / 60);
        if (div > 0) {
            res += (div + " min(s) ");
        }
        res += ((secs % 60) + " sec(s) ");
        return res;
    }            
    
    $scope.counter = 0;
    function resetTimeCounter() {
        $scope.counter = 0;
    }
    function resumeTimeCounter() {
        $timeout(() => {
            if (!$scope.quizStarted) return;
            $scope.counter++;
            $scope.counterString = prettyTime($scope.counter);
            resumeTimeCounter();
        }, 1000 /* 1 sec */);
    }
    function startTimeCounter() {
        resetTimeCounter();
        resumeTimeCounter();
    }

    // Quiz start/stop
    function startQuiz() {
        acceptStates(['quizReady']);
        let q = getCurrentQuiz()
        if (q) {
            socket.emit('QUIZ_START', q);
            startTimeCounter();
            resetAnswerCounters();
            setQuizStarted();
            return;
        }
        console.log('ERROR: quiz not found!');
    }

    function stopQuiz() {
        acceptStates(['quizStarted']);
        socket.emit('QUIZ_STOP', {});
        resetTimeCounter();
        setQuizReady();
    }

    $scope.startQuiz = startQuiz;
    $scope.stopQuiz = stopQuiz;

    // Number of students that have answered
    $scope.connectedStudentIds = [];

    socket.on('CONNECTED_STUDENTS', (data: { connectedStudentIds: string[] }) => {
        $scope.totalStudentsInRoom = Object.keys(data.connectedStudentIds).length;
    });

    $scope.studentsAnsweredCount = -1;
    $scope.totalStudentsInRoom   = -1;

    function resetAnswerCounters() {
        $scope.studentsAnsweredCount        = 0;
        $scope.totalStudentsInRoom          = 0;
        $scope.studentsAnsweredCorrectCount = 0;
        $scope.studentsAnsweredWrongCount   = 0;
    }           

    // Inform about a student answering a question
    socket.on('ANSWER_RECEIVED', (data: { isCorrect: boolean }) => {
        console.log('An answer:', data.isCorrect, 'was received');
        $scope.studentsAnsweredCount++;
        if (data.isCorrect) {
            $scope.studentsAnsweredCorrectCount++;
        }
        else {
            $scope.studentsAnsweredWrongCount++;
        }
    });

    ////////////////////////////////////////////////////////////////////
    // Viewing responses ///////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    function viewResponses() {
        let quiz = getCurrentQuiz();
        let qid = 'TODO' // XXX: quiz.quizId;
        socket.emit('REQ_QUIZ_RESULTS', { qid: qid });
    }

    $scope.viewResponses = viewResponses;

    // ////////////////////////////////////////////////////////////////////
    // // This is just a sample chart

    // let margin = { top: 20, right: 20, bottom: 30, left: 40 },
    //     width = 960 - margin.left - margin.right,
    //     height = 500 - margin.top - margin.bottom;

    // let x = d3.scale.ordinal()
    //     .rangeRoundBands([0, width], .1);

    // let y = d3.scale.linear()
    //     .range([height, 0]);

    // let xAxis = d3.svg.axis()
    //     .scale(x)
    //     .orient("bottom");

    // let yAxis = d3.svg.axis()
    //     .scale(y)
    //     .orient("left")
    //     .ticks(10, "%");

    // let svg = d3.select("#viz").append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // d3.tsv("/assets/data.tsv", type, function(error, data) {
    //     if (error) throw error;

    //     x.domain(data.map((d: any) => d.letter));
    //     y.domain([0, d3.max(data, (d: any) => d.frequency)]);

    //     svg.append("g")
    //         .attr("class", "x axis")
    //         .attr("transform", "translate(0," + height + ")")
    //         .call(xAxis);

    //     svg.append("g")
    //         .attr("class", "y axis")
    //         .call(yAxis)
    //         .append("text")
    //         .attr("transform", "rotate(-90)")
    //         .attr("y", 6)
    //         .attr("dy", ".71em")
    //         .style("text-anchor", "end")
    //         .text("Frequency");

    //     svg.selectAll(".bar")
    //         .data(data)
    //         .enter().append("rect")
    //         .attr("class", "bar")
    //         .attr("x", (d: any) => x(d.letter))
    //         .attr("width", x.rangeBand())
    //         .attr("y", (d: any) => y(d.frequency))
    //         .attr("height", (d: any) => height - y(d.frequency));
    // });

    // function type(d) {
    //     d.frequency = +d.frequency;
    //     return d;
    // }
    // ////////////////////////////////////////////////////////////////////


}

click.controller('instructorClickCtrl', instructorClickCtrl);
