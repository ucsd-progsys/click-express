
import * as url           from '../../shared/url';
import * as t             from 'types';

import { IClickerService } from '../../services/clicker';
import { charFromInt
       , questionToHtml } from '../../../../shared/misc';


interface ICourseScope extends angular.IScope {
    
}

export function courseCtrl($scope: ICourseScope, clickerService: IClickerService) {

    let course = url.getCurrentURL().split('/').reverse()[0];

    clickerService.getSocket().on('quiz_start', (q: t.IQuiz) => {


        console.log('quiz_start on socket');


        // let quizHtml = questionToHtml(q.description, q.options);
        // $scope.quizHtml = quizHtml;


    });

    // function makeClick(scope: any, quiz: t.IQuiz, answer: number): t.IClick {
    //     return {
    //         username   : scope.CommonData.username,
    //         quizId     : "", // quiz._id,
    //         choice     : answer,
    //         submitTime : new Date()
    //     }
    // }


}
