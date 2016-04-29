
import * as t from 'types';
import { charFromInt, questionToHtml } from '../shared/misc';
import { getPostQuizURL }              from '../shared/url';

declare let username: string;
// declare let socket  : any;

// import these correctly
declare let serverError: any;

////////////////////////////////////////////////////////////////////
// Auxiliary ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

let __saveTag = 0;
let __pendingTags = [];
function newSaveTag() {
    let x = __saveTag++;
    __pendingTags.push(x);
    return x;
}

function toTagged<A>(x: A): t.Tagged<A> {
    return { tag: newSaveTag(), data: x };
}

////////////////////////////////////////////////////////////////////
// Create Quiz Controller //////////////////////////////////////////
////////////////////////////////////////////////////////////////////

export function createQuizCtrl($scope, $http: angular.IHttpService, $location, $timeout, $window: angular.IWindowService, Data) {

    // Populate CommonData
    $scope.CommonData = Data;
    // $scope.CommonData.socket = socket;
    $scope.CommonData.username = username;

    // Auxiliary functions
    $scope.charFromInt = charFromInt;

    function getUserName(): string {
        return $scope.CommonData.username;
    }
    function getCourseName(): string {
        return $scope.CommonData.courseName;
    }

    // States
    $scope.saving = false;
    function setSaving() { $scope.saving = true; }
    function unsetSaving() { $scope.saving = false; }


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
        $scope.correctChoice.index = -1
        $scope.choiceStyle = [];
    }


    ////////////////////////////////////////////////////////////////////
    // Create Quiz Controller //////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    function showNotification(n: string) {
        $scope[n] = true;
        $timeout(() => { $scope[n] = false; }, 6000 /* 6 seconds */);
    }
    function dismissNotification(n: string) {
        $scope[n] = false;
        $timeout(() => { $scope.saveSuccessfulVisible = false; }, 6000 /* 6 seconds */);
    }

    function showSaveNotification()         { dismissAllNotifications(); showNotification('saveSuccessfulVisible'); }
    function showEmptyQuizNotification()    { dismissAllNotifications(); showNotification('saveEmptyQuizVisible'); }
    function showNoUserNameNotification()   { dismissAllNotifications(); showNotification('saveNoCourseNameVisible'); }
    // function showNoCourseNameNotification() { dismissAllNotifications(); showNotification('saveNoCourseNameVisible'); }

    function dismissSaveNotification()         { dismissNotification('saveSuccessfulVisible'); }
    function dismissEmptyQuizNotification()    { dismissNotification('saveEmptyQuizVisible'); }
    function dismissNoUserNameNotification()   { dismissNotification('saveNoCourseNameVisible'); }
    // function dismissNoCourseNameNotification() { dismissNotification('saveNoCourseNameVisible'); }

    function dismissAllNotifications() {
        dismissSaveNotification();
        dismissEmptyQuizNotification();
        dismissNoUserNameNotification();
        // dismissNoCourseNameNotification();
    }

    function emptyInputQuiz() {
        let text: string = $scope.textarea;
        let choices: string[] = $scope.choices;
        let correctChoice: number = $scope.correctChoice.index;
        return (typeof text === 'undefined') || (text === '') ||
            (typeof choices === 'undefined') || (choices.length < 2) ||
            (correctChoice < 0) || (correctChoice >= choices.length);
    }

    function makeQuiz(): t.IQuiz {
        return {
            courseId   : getCourseName(),
            description: $scope.textarea,
            options    : $scope.choices.map(c => c.text),
            correct    : $scope.correctChoice.index,
            author     : getUserName(),
            timeCreated: new Date()
        };
    }

    function saveQuiz() {
        if (emptyInputQuiz()) {
            showEmptyQuizNotification();
            return;
        }
        if (!getUserName()) {
            showNoUserNameNotification();
            return;
        }

        setSaving();

        $http.post(getPostQuizURL(), makeQuiz()).success((quizId: string) => {
            showSaveNotification();
            unsetSaving();
            $window.location.href = quizId;
        }).error((data, status) => {
            serverError($scope, data, status, "click");
            unsetSaving();
        });
    }

    $scope.saveQuiz  = saveQuiz;

    ////////////////////////////////////////////////////////////////////
    // Preview /////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    $scope.preview = () => questionToHtml($scope.textarea, $scope.choices.map(c => c.text));

}

