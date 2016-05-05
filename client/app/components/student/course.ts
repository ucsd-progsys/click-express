import * as url           from '../../shared/url';
import * as t             from 'types';

import { IClickerService } from '../../services/clicker';
import { charFromInt
       , questionToHtml } from '../../../../shared/misc';

function makeClick(scope: any, quiz: t.IQuiz, answer: number): t.IClick {
    return {
        username   : scope.CommonData.username,
        quizId     : "", // quiz._id,
        choice     : answer,
        submitTime : new Date()
    }
}

// export function studentCtrl($scope: any, $http: angular.IHttpService, $location: angular.ILocationService, $timeout: angular.ITimeoutService) {

export function courseCtrl($scope, socketService: IClickerService) {
   
    let course = url.getCurrentURL().split('/').reverse()[0];
    let namespacePath = url.getServerURL() + '/' + course;    
    let socket = io(namespacePath);
    console.log('Connecting on', namespacePath);
    socketService.registerSocket(socket);

    $scope.quizStarted = false;
        
    socket.on('quiz_start', (q: t.IQuiz) => {
        console.log('quiz_start on socket');
        // let quizHtml = questionToHtml(q.description, q.options);
        $scope.quizStarted = true;
        // $scope.quizHtml = quizHtml;
    });

}


// OLD STUFF ---
    // $scope.response = { rsp: 'ERROR_RESPONCE' };
    // socket.on("QUIZ_START", (quiz: t.IMaskedQuiz) => {
    // // TODO: add the graphic here
    // //         let modalInstance = $uibModal.open({
    // //             animation: true,
    // //             templateUrl: 'myModalContent.html',
    // //             controller: 'ModalInstanceCtrl',
    // //             resolve: {
    // //                 question: () => quizDescriptionToHtml(quiz),
    // //                 options : () => quiz.options,
    // //                 response: () => $scope.response
    // //             },
    // //             backdrop: 'static',
    // //             keyboard: false
    // //         });
    // //
    // //         $scope.currentModal = modalInstance;
    // //
    // //         modalInstance.result.then(
    // //             (answer: number) => {
    // //                 let click = makeClick($scope, quiz, answer);
    // //                 console.log(click);
    // //                 // return the selection through the socket
    // //                 socket.emit(QUIZ_ANSWER, click);
    // //             },
    // //             () => {
    // //                 console.log('Question dismissed at: ' + new Date())
    // //             }
    // //         );
    //     // $scope.counter.cnt = quiz.time;
    //     // $scope.countdown();

    // });
    // // If instructor calls stop -> dismiss the modal instance
    // socket.on("QUIZ_STOP", (data: any) => {
    //     // TODO: Submit selected answer
    //     if ($scope.currentModal)
    //         $scope.currentModal.dismiss('cancel');
    // });

// function modalInstanceCtrl($scope, $uibModalInstance, question, options, /*counter, */ response) {
//     $scope.quiz     = { val: question };
//     $scope.options  = { val: options.map((o, i) => { return { ii: charFromInt(i), text: o } }) };
//     // $scope.counter  = { val: counter };
//     $scope.response = { val: 'ERROR_RESPONCE' };
//     $scope.ok       = () => { $uibModalInstance.close($scope.response.rsp); };
//     $scope.cancel   = () => { $uibModalInstance.dismiss('cancel'); }
// };

// click.controller('studentClickCtrl', studentClickCtrl);
// click.controller('ModalInstanceCtrl', modalInstanceCtrl);
