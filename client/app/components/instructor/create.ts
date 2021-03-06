
import * as t from 'types';
import { charFromInt, questionToHtml } from '../../../../shared/misc';
import { getPostQuizURL }              from '../../shared/url';
import { IClickerService } from '../../services/clicker';


type URL = string;

interface IChoice {
    id: number;
    text?: string;
}

interface IChoiceStyle {
    'background-color'?: string;
}

interface ITab {
    title: string;
    url: URL;
}

interface ICreateQuizScope extends angular.IScope {
    // Auxiliary
    charFromInt: (n: number) => string;

    // Components
    textarea: string;
    tabs: ITab[];

    // State
    saving: boolean;
    currentTab: URL;

    // Quiz
    choices: IChoice[];
    choiceStyle: IChoiceStyle[];
    correctChoice: IChoice;

    // Tab API
    onClickTab: (tab: ITab) => void;
    isActiveTab: (url: URL) => boolean;

    // Choices API
    addNewChoice: () => void;
    removeLastChoice: () => void;
    correctChoiceSelected: (i: number) => void;

    // Preview/Submit
    preview: () => void;
    saveQuiz: () => void;

    // Clear
    clearForms: () => void;
}

export function createQuizCtrl($scope: ICreateQuizScope, $http: angular.IHttpService, $location: angular.ILocationService, clickerService: IClickerService) {

    // Auxiliary
    $scope.charFromInt = charFromInt;

    // Components
    $scope.textarea = '';

    $scope.tabs = [
         { title: 'Edit'   , url: 'edit' },
         { title: 'Preview', url: 'preview' }
    ];

    $scope.currentTab = $scope.tabs[0].url;

    $scope.onClickTab = tab => {
        $scope.currentTab = tab.url;
        // $location.path(['course', clickerService.course, tab.url].join('/'));
    }

    $scope.isActiveTab = tabUrl => {
        return tabUrl === $scope.currentTab;
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

    $scope.correctChoice = { id: -1 };

    // Setting the correct choice
    function setCorrectChoiceStyle() {
        $scope.choices.forEach((_,i) => { $scope.choiceStyle[i] = {} });
        $scope.choiceStyle[$scope.correctChoice.id] = { 'background-color':'#cdf1c0' };
    }

    $scope.correctChoiceSelected = (index: number) => {
        $scope.correctChoice.id = index;
        setCorrectChoiceStyle();
        onEdit();
    }


    function onEdit() {}

    // Clear forms
    $scope.clearForms = () => {
        // acceptStates(['quizReady', 'quizStale', 'quizEmpty']);
        $scope.textarea = "";
        $scope.choices = [];
        $scope.correctChoice.id = -1
        $scope.choiceStyle = [];
    }


    function emptyInputQuiz() {
        let text = $scope.textarea;
        let choices = $scope.choices;
        let correctChoice = $scope.correctChoice.id;
        return (typeof text === 'undefined') || (text === '') ||
            (typeof choices === 'undefined') || (choices.length < 2) ||
            (correctChoice < 0) || (correctChoice >= choices.length);
    }

    function makeQuiz(): t.IQuiz {
        return {
            courseId   : clickerService.getCourse(),
            description: $scope.textarea,
            options    : $scope.choices.map(c => c.text),
            correct    : $scope.correctChoice.id,
            author     : clickerService.username,
            timeCreated: new Date()
        };
    }

    $scope.saveQuiz = () => {
        if (emptyInputQuiz()) {
            // showEmptyQuizNotification();
            return;
        }
        if (!(clickerService.username)) {
            return;
        }

        let quiz = makeQuiz();
        let course = clickerService.getCourse();
        
        $http.post(getPostQuizURL(course), quiz).success((quizId: string) => {
            $location.path(['course', course, 'quiz', quizId].join('/'));
        }).error((data, status) => {
            console.log('ERROR when saving quiz');
        });
    }
    
    $scope.preview = () => questionToHtml($scope.textarea, $scope.choices.map(c => c.text));

}
