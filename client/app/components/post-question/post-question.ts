
var debug = false;
var socket = io();

////////////////////////////////////////////////////////////////////
// Auxiliary ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function makeQuiz(scope): IQuizContent {
    let text: string = scope.textarea;
    let options: Options = scope.choices;
    if (emptyInputQuiz(scope)) {
        // TODO: handle error case
        return undefined;
    }
    return {
        courseId    : 'CSE130',
        description : text,
        options     : options,
        correct     : 'TODO-correct',
        author      : 'TODO-author',
        startTime   : new Date()
    };
}

function emptyInputQuiz(scope: any) {
    let text = scope.textarea;
    let options = scope.choices;
    return (typeof text === 'undefined') || (text === '') ||
        (typeof options === 'undefined') || (options.length < 2);
}

////////////////////////////////////////////////////////////////////
// Instructor Controller ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function instructorClickCtrl($scope, $http, $location, $timeout) {


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
    $scope.choices = [];

    // Create Quiz
    // http://mrngoitall.net/blog/2013/10/02/adding-form-fields-dynamically-in-angularjs/
    let charFromInt = (n) => String.fromCharCode(65 + n);

    // Load existing question
    function loadQuestion() {
        acceptStates(['quizReady', 'quizStale', 'quizEmpty']);
        let newQuestion: IQuizContent = JSON.parse($scope.selectedQuestion);
        $scope.textarea = newQuestion.description;
        $scope.textarea = newQuestion.options;
        // // OLD: Add the new ones
        // $scope.choices = [];
        // newQuestion.options.forEach(v => {
        //     $scope.addNewChoice(v.index, v.text);
        // });
        // Update state
        setQuizReady();
    }
    $scope.loadQuestion = loadQuestion;


    // The default values are for when the button is used
    $scope.addNewChoice = () => {
        $scope.choices.push({
            index: charFromInt($scope.choices.length),
            text: ""
        });
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
        $scope.choices = []; // .forEach(c => { c.text = ""; });
        setQuizEmpty();
    }

    ////////////////////////////////////////////////////////////////////
    // Preview /////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    $scope.preview = () => fullQuestionToHtml($scope.textarea, $scope.choices);

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
