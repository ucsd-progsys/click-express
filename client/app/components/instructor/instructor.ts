declare var userName: string;
var debug = false;
var socket = io({ query: 'userName=' + userName });

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
    // Question Pool ///////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    $scope.questionPool = [];

    function updateQuestionPool(questions: any) {
        $scope.questionPool = questions;        
    }
    $scope.updateQuestionPool = updateQuestionPool;
    
    function getQuestion(index: number) {
        return $scope.questionPool[index];
    }

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
    function loadQuestion(index: number) {
        acceptStates(['quizReady', 'quizStale', 'quizEmpty']);
        let question = getQuestion(index);
        setCurrentQuiz(question);
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
        console.log('ERROR: quiz not found!');
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
    
    ////////////////////////////////////////////////////////////////////
    // This is just a sample chart    

    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10, "%");

    var svg = d3.select("#viz").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv("/assets/data.tsv", type, function(error, data) {
        if (error) throw error;

        x.domain(data.map((d: any) => d.letter));
        y.domain([0, d3.max(data, (d: any) => d.frequency)]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency");

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", (d: any) => x(d.letter))
            .attr("width", x.rangeBand())
            .attr("y", (d: any) => y(d.frequency))
            .attr("height", (d: any) => height - y(d.frequency));
    });

    function type(d) {
        d.frequency = +d.frequency;
        return d;
    }
    ////////////////////////////////////////////////////////////////////    


}

click.controller('instructorClickCtrl', instructorClickCtrl);
