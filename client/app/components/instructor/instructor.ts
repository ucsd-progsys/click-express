declare var userName: string;
var debug = false;

var socket = io({ query: 'userName=' + userName });

////////////////////////////////////////////////////////////////////
// Instructor Controller ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function instructorClickCtrl($scope, $http, $location, $timeout, Data) {

    // Populate CommonData
    $scope.CommonData = Data;
    $scope.CommonData.socket = socket;
    $scope.CommonData.userName = userName;
    
    // Auxiliary functions
    $scope.charFromInt = charFromInt;

    ////////////////////////////////////////////////////////////////////
    // State Flags /////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    const stateFlags = ['quizEmpty', 'quizStale', 'quizReady', 'quizStarted'];
    function setFlag(f: string) {
        stateFlags.forEach(s => { $scope[s] = false; });
        $scope[f] = true;
    }
    function setQuizEmpty()   { setFlag('quizEmpty')   }
    function setQuizStale()   { setFlag('quizStale')   }
    function setQuizReady()   { setFlag('quizReady')   }
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
            var e = new Error('dummy');
            var stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
                .replace(/^\s+at\s+/gm, '')
                .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
                .split('\n');
            console.log(stack);
            console.log('BUG: state(s) ', xs.join(' or '), ' expected, but ', s, ' found.');
        }
    }
    
    ////////////////////////////////////////////////////////////////////
    // Init ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    
    $scope.instructorInit = function() {
        console.log('Instructor init ', $scope.CommonData.courseName);
    }
    
    ////////////////////////////////////////////////////////////////////
    // Input question //////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    // // Select time
    // $scope.times = [15, 30, 60];
    // $scope.selectedTime = $scope.times[2];  // default


    $scope.questionPool = [];
    
    function updateQuestionPool(questions: any) {
        $scope.questionPool = questions;                
    }
    $scope.updateQuestionPool = updateQuestionPool; 
    
    // Add a binding to the shared data for the navbar to access
    $scope.CommonData.updateQuestionPool = updateQuestionPool;

    // Select from sample questions
    $scope.selectedQuestion = undefined;
    $scope.textarea = "";

    // .choices: { id: number; text: string; }
    $scope.choices = [];

    // Create Quiz
    // http://mrngoitall.net/blog/2013/10/02/adding-form-fields-dynamically-in-angularjs/

    function updateForms(q: IQuizContent) {
        $scope.textarea = q.description;
        $scope.choices  = q.options.map((o, i) => { return { id: i, text: o }; });
        $scope.correctChoice.index = q.correct;
        setCorrectChoiceStyle();
    }

    // Load existing question
    function loadQuestion() {
        acceptStates(['quizReady', 'quizStale', 'quizEmpty']);
        let loadedQuiz: IQuiz = JSON.parse($scope.selectedQuestion);
        updateForms(loadedQuiz);
        setCurrentQuiz(loadedQuiz);
        setQuizReady();
    }

    $scope.loadQuestion = loadQuestion;

    function setCorrectChoiceStyle() {
        $scope.choices.forEach((_,i) => { $scope.choiceStyle[i] = {} });
        $scope.choiceStyle[$scope.correctChoice.index] = { 'background-color':'#cdf1c0' };
    }


    ////////////////////////////////////////////////////////////////////
    // Current quiz ////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    var currentQuiz: IQuiz = undefined;        // The quiz to be delivered

    function setCurrentQuiz(q: IQuiz) {
        currentQuiz = q;
    }
    function unsetCurrentQuiz() {
        currentQuiz = undefined;
    }
    function getCurrentQuiz() {
        return currentQuiz;
    }


    ////////////////////////////////////////////////////////////////////
    // Preview /////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    $scope.preview = () => fullQuestionToHtml($scope.textarea, $scope.choices.map(c => c.text));

    ////////////////////////////////////////////////////////////////////
    // Running the Quiz ////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    // Timer
    $scope.counter = 0;
    function resetCounter() {
        $scope.counter = 0;
    }
    function resumeCounter() {
        $timeout(() => {
            if (!$scope.quizStarted) return;
            $scope.counter ++;
            resumeCounter();
        }, 1000 /* 1 sec */);
    }
    function startCounter() {
        resetCounter();
        resumeCounter();
    }

    // Quiz start/stop
    function startQuiz() {
        acceptStates(['quizReady']);
        let q = getCurrentQuiz()
        if (q) {
            socket.emit(QUIZ_START, q);
            startCounter();
            setQuizStarted();
            console.log('started quiz: ' + currentState());
            return;
        }
        console.log('Cannot run unsaved test!');
    }

    function stopQuiz() {
        acceptStates(['quizStarted']);
        socket.emit(QUIZ_STOP, {});
        resetCounter();
        setQuizReady();
    }       

    $scope.startQuiz = startQuiz;
    $scope.stopQuiz  = stopQuiz;

}

click.controller('instructorClickCtrl', instructorClickCtrl);
