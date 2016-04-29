

import { quizToHtml } from '../../../shared/misc';


function quizCtrl($scope, $uibModal, $location, $timeout, Data) {
 
 
    // show correct answer
    $scope.showCorrectAnswer = false;
    function showAnswer() { 
        return $scope.showCorrectAnswer; 
    }


    function setCorrectChoiceStyle() {
        $scope.choices.forEach((_, i) => { $scope.choiceStyle[i] = {} });
        $scope.choiceStyle[$scope.correctChoice.index] = { 'background-color': '#cdf1c0' };
    }
    
    
}
