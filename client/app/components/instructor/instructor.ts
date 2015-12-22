declare var userName: string;
var debug = false;
var socket = io({ query: 'userName=' + userName });

////////////////////////////////////////////////////////////////////
// Display Quiz Result /////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function setupResultModal(scope: any, uibModal: any) {
    socket.on(RES_QUIZ_RESULTS, (data: { clicks: IClick[] }) => {
        
        let clickMap: { [x: string]: number } = { }
        
        data.clicks.forEach(c => {
            if (!clickMap[c.choice])
                clickMap[c.choice] = 1;                 
            clickMap[c.choice]++;                
        })
        // let clicks = data.clicks.map(c => _.pairs(c => c[1])); // .map(p => p[2]);
        
        // TODO: Get more quiz info 
        
        let pairs = _.pairs(clickMap).map(p => { return { text: charFromInt(parseInt(p[0])), answers: p[1] } });
        
        
        // console.log(clicks);
        let mi = uibModal.open({
            animation: true,
            templateUrl: 'resultsModal.html',
            controller: 'ResultsModalCtrl',
            resolve: {
                options: () => pairs
            },
            backdrop: 'static',
            keyboard: false
        });
        mi.result.then(
            (result) => { console.log("XXX"); },
            () => { console.log('Dismissed', new Date()); }
        );
    });
}

function resultsModalCtrl($scope, $uibModalInstance, options) {
    $scope.options = { val: options };
    $scope.cancel = () => {
        $uibModalInstance.dismiss('cancel');
    }
}
click.controller('ResultsModalCtrl', resultsModalCtrl);



////////////////////////////////////////////////////////////////////
// Instructor Controller ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function instructorClickCtrl($scope, $http, $uibModal, $location, $timeout, Data) {

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

    // $scope.instructorInit = function() {
    //     console.log('Instructor init ', $scope.CommonData.courseName);
    // }
    setupResultModal($scope, $uibModal);

    ////////////////////////////////////////////////////////////////////
    // Question Pool ///////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    $scope.questionPool = [];

    function updateQuestionPool(questions: any) {
        $scope.questionPool = questions;
    }
    $scope.updateQuestionPool = updateQuestionPool;

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
    function loadQuestion() {
        acceptStates(['quizReady', 'quizStale', 'quizEmpty']);
        setCurrentQuiz(JSON.parse($scope.selectedQuestion));
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

    function setCurrentQuiz(q: IQuiz) {
        $scope.selectedQuestion = q;
    }
    function unsetCurrentQuiz() {
        $scope.selectedQuestion = undefined;
    }
    function getCurrentQuiz(): IQuiz {
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
    $scope.counter = 0;
    function resetCounter() {
        $scope.counter = 0;
    }
    function resumeCounter() {
        $timeout(() => {
            if (!$scope.quizStarted) return;
            $scope.counter++;
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
    $scope.stopQuiz = stopQuiz;

    ////////////////////////////////////////////////////////////////////
    // Viewing responses ///////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    function viewResponses() {
        let quiz = getCurrentQuiz();
        let qid = quiz._id;
        socket.emit(REQ_QUIZ_RESULTS, { qid: qid });
    }

    $scope.viewResponses = viewResponses;


}

click.controller('instructorClickCtrl', instructorClickCtrl);
