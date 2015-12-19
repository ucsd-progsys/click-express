
var debug = false;
var socket = io();

////////////////////////////////////////////////////////////////////
// Auxiliary ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function makeQuiz(scope): IQuizContent {    
    if (emptyInputQuiz(scope)) {
        // TODO: handle error case
        return undefined;
    }
    return {
        courseId   : 'CSE130', 
        description: scope.textarea,
        options    : scope.choices.map(c => c.text),
        correct    : scope.correctChoice.index,
        author     : 'rjhala',
        startTime  : new Date()
    };
}

function emptyInputQuiz(scope: any) {
    let text         : string   = scope.textarea;
    let choices      : string[] = scope.choices;
    let correctChoice: number   = scope.correctChoice.index;
    return (typeof text    === 'undefined') || (text === '')        ||
           (typeof choices === 'undefined') || (choices.length < 2) || 
           (correctChoice < 0) || (correctChoice >= choices.length);
}

////////////////////////////////////////////////////////////////////
// Instructor Controller ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function instructorClickCtrl($scope, $http, $location, $timeout) {

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
    //IMPORTANT initial state
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
    // Pending quesion /////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    let __saveTag = 0;
    let __pendingTags = [];
    function newSaveTag() {
        let x = __saveTag++;
        __pendingTags.push(x);
        return x;
    }
    function removeTag(x) {
        __pendingTags = __pendingTags.filter(e => e !== x);
    }
    function toTagged<A>(x: A): Tagged<A> {
        return { tag: newSaveTag(), data: x };
    }

    $scope.savePopupVisible = false;


    ////////////////////////////////////////////////////////////////////
    // Input question //////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    // // Select time
    // $scope.times = [15, 30, 60];
    // $scope.selectedTime = $scope.times[2];  // default

    // Select from sample questions
    $scope.questionPool = [];
    $scope.selectedQuestion = undefined;
    $scope.textarea = "";
    
    // .choices: { id: number; text: string; }
    $scope.choices = [];

    // Create Quiz
    // http://mrngoitall.net/blog/2013/10/02/adding-form-fields-dynamically-in-angularjs/
    
    // Load existing question
    function loadQuestion() {
        acceptStates(['quizReady', 'quizStale', 'quizEmpty']);
        let newQuestion: IQuiz = JSON.parse($scope.selectedQuestion);        
        $scope.textarea = newQuestion.description;
        $scope.choices  = newQuestion.options.map((o, i) => { return { id: i, text: o }; });
        $scope.correctChoice.index = newQuestion.correct;
        setCorrectChoiceStyle();       
        setQuizReady();
    }
    $scope.loadQuestion = loadQuestion;

    // The default values are for when the button is used
    $scope.addNewChoice = () => {
        let len = $scope.choices.length;
        $scope.choices.push({ id: len, text: ""});
        $scope.choiceStyle.push({});   
        onEdit();
    };
    $scope.removeLastChoice = () => {
        $scope.choices.pop();
        onEdit();
    };

    // Input changed (textarea)
    $scope.onDescriptionChange = () => {
        onEdit();
    }

    // Input changed (any of the choices)
    $scope.onChoiceChange = () => {
        onEdit();
    }
            
    // Correct choice index            
    $scope.correctChoice = { index: -1 };
    $scope.choiceStyle = [];
    
    function setCorrectChoiceStyle() {        
        $scope.choices.forEach((_,i) => { $scope.choiceStyle[i] = {} });        
        $scope.choiceStyle[$scope.correctChoice.index] = { 'background-color':'#cdf1c0' };      
    }
            
    function correctChoiceSelected(index: number) {
        $scope.correctChoice.index = index;   
        setCorrectChoiceStyle();       
        onEdit();
    }
    
    $scope.correctChoiceSelected = correctChoiceSelected;
    
    
    // On ANY edit
    function onEdit() {
        acceptStates(['quizReady', 'quizStale', 'quizEmpty']);
        if (emptyInputQuiz($scope)) setQuizEmpty();
        else                        setQuizStale();
    }

    // Clear forms
    $scope.clearForms = () => {
        acceptStates(['quizReady', 'quizStale', 'quizEmpty']);
        $scope.textarea = "";
        $scope.choices = [];
        $scope.correctChoice.index = -1;
        setQuizEmpty();
    }

    ////////////////////////////////////////////////////////////////////
    // Preview /////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    $scope.preview = () => fullQuestionToHtml($scope.textarea, $scope.choices.map(c => c.text));

    ////////////////////////////////////////////////////////////////////
    // Running the Quiz ////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    var currentQuiz: IQuiz = undefined;        // The quiz to be delivered

    function setCurrentQuiz(q: IQuiz) {
        currentQuiz = q;
    }
    function unsetCurrentQuiz() {
        currentQuiz = undefined;
    }
    function getCurrentQuiz() { return currentQuiz; }

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

    // Save the quiz
    function saveQuiz() {
        acceptStates(['quizStale']);
        let quiz = makeQuiz($scope);
        socket.emit(QUIZ_SAVE, toTagged(quiz));
    }

    function showSaveNotification() {
        $scope.savePopupVisible = true;
        $timeout(() => { $scope.savePopupVisible = false; }, 6000 /* 6 seconds */);        
    }

    function saveSuccessful(quiz: Tagged<IQuiz>) {
        acceptStates(['quizStale']);
        console.log('Successfully saved: ', quiz.data._id);
        showSaveNotification();
        setCurrentQuiz(quiz.data);
        setQuizReady();
    }

    socket.on(QUIZ_SAVED, saveSuccessful);

    $scope.startQuiz = startQuiz;
    $scope.stopQuiz  = stopQuiz;
    $scope.saveQuiz  = saveQuiz;

}

click.controller('instructorClickCtrl', instructorClickCtrl);
