declare var userName: string;
var debug = false;

////////////////////////////////////////////////////////////////////
// Auxiliary ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function makeQuiz(scope): IQuizContent {
    if (emptyInputQuiz(scope)) {
        // TODO: handle error case
        return undefined;
    }
    return {
        courseId   : scope.CommonData.courseName,
        description: scope.textarea,
        options    : scope.choices.map(c => c.text),
        correct    : scope.correctChoice.index,
        author     : scope.CommonData.userName,
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

let __saveTag = 0;
let __pendingTags = [];
function newSaveTag() {
    let x = __saveTag++;
    __pendingTags.push(x);
    return x;
}

function toTagged<A>(x: A): Tagged<A> {
    return { tag: newSaveTag(), data: x };
}

////////////////////////////////////////////////////////////////////
// Instructor Controller ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function createQuizCtrl($scope, $http, $location, $timeout, Data) {

    // Populate CommonData
    $scope.CommonData = Data;
    $scope.CommonData.socket = socket;
    $scope.CommonData.userName = userName;

    // Auxiliary functions
    $scope.charFromInt = charFromInt;

    // Choices
    $scope.choices = [];
    $scope.choiceStyle = [];

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

    $scope.correctChoice = { index: -1 };

    // Setting the correct choice
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

    function onEdit() {}

    // Clear forms
    $scope.clearForms = () => {
        // acceptStates(['quizReady', 'quizStale', 'quizEmpty']);
        $scope.textarea = "";
        $scope.choices = [];
        $scope.correctChoice.index = -1;
    }

    // Save the quiz
    function saveQuiz() {
                
        // acceptStates(['quizStale']);
        let quiz = makeQuiz($scope);
        // socket.emit(QUIZ_SAVE, toTagged(quiz));
        


         $http
            .post(getSaveQuizURL(), quiz)
            .success((data, status) => {
                console.log(data);
            })
            .error((data, status) => {
                serverError($scope, data, status, "click");
            });
    }

    $scope.saveQuiz  = saveQuiz;

    ////////////////////////////////////////////////////////////////////
    // Preview /////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    $scope.preview = () => fullQuestionToHtml($scope.textarea, $scope.choices.map(c => c.text));

}

click.controller('createQuizCtrl', createQuizCtrl);
