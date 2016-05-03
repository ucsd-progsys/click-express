
import * as t             from 'types';
import { ISocketService } from '../services/socket';
import { charFromInt
       , questionToHtml } from '../../../shared/misc';

function makeClick(scope: any, quiz: t.IQuiz, answer: number): t.IClick {
    return {
        username   : scope.CommonData.username,
        quizId     : "", // quiz._id,
        choice     : answer,
        submitTime : new Date()
    }
}

export function studentClickCtrl($scope, socketService: ISocketService) {

    $scope.quizInProgress = false;

    let socket = socketService.getSocket();

    socket.on('quiz_start', (q: t.IQuiz) => {
        $scope.quizInProgress = true;
        $scope.quizHtml = questionToHtml(q.description, q.options);
        console.log('quiz_start on socket');
        // console.log(data);
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
