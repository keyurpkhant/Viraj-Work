var questions = [];
var quiz;
var categoryName = localStorage.getItem('categoryname');
class QuestionObject {
    constructor(question, options, answer, userAnswer) {
        this.question = question;
        this.options = options;
        this.answer = answer;
        this.userAnswer = userAnswer;
    }
    isCorrectAnswer(choice) {
        return this.answer === choice;
    }
}



class Quiz {
    constructor(score, questions, questionIndex) {
        this.score = score;
        this.questions = questions;
        this.questionIndex = questionIndex;
    }
    getQuestionIndex() {
        return this.questions[this.questionIndex];
    }
    guess(choice) {
        if (this.getQuestionIndex().isCorrectAnswer(choice)) {
            this.score[this.questionIndex] = 1;
        } else {
            this.score[this.questionIndex] = 0;
        }
    }
    isEnded() {
        return this.questionIndex === this.questions.length;
    }
}


function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

//Display Questoins 
function displayQuiz() {
    if (quiz.isEnded()) {
        showScores();
    }
    else {
        var questionOptions = quiz.getQuestionIndex().options;
        if (quiz.questionIndex == 0) {
            $("#prevQuestion").attr('disabled', true);
        } else {
            $("#prevQuestion").attr('disabled', false);
        }
        if (quiz.questionIndex == quiz.questions.length - 1) {
            $("#nextQuestion").text("Finish");
        } else {
            $("#nextQuestion").text("Next");
        }
        $("#question").html(quiz.getQuestionIndex().question);
        $('#option1').attr('value', questionOptions[0]);
        $('#option2').attr('value', questionOptions[1]);
        $('#option3').attr('value', questionOptions[2]);
        $('#option4').attr('value', questionOptions[3]);
        $('#label1').html(questionOptions[0]);
        $('#label2').html(questionOptions[1]);
        $('#label3').html(questionOptions[2]);
        $('#label4').html(questionOptions[3]);

        if (quiz.getQuestionIndex().userAnswer != null) {
            var id = "#" + quiz.getQuestionIndex().userAnswer;
            $(id).prop("checked", true);
        } else {
            $('input[name="options"]').prop("checked", false);
        }
        showProgress();
    }
}


// show question number like Question 1 of 3
function showProgress() {
    var currentQuestionNumber = quiz.questionIndex + 1;
    $('#progress').html("Question " + currentQuestionNumber + " of " + quiz.questions.length);
}


// showing result as division && post to database
function showScores() {
    $("#showQuestionsDiv").hide();
    $("#showResultDiv").show();
    $("#showAnswersDiv").show();
    var time = $("#time").text();
    var id = "quizresult-" + uuidv4();
    var scoreValue = 0;
    for (var i = 0; i < quiz.score.length; i++) {
        scoreValue += quiz.score[i];
    }
    var totalquestions = quiz.questions.length;
    var sessionData = getUserSessionData();
    var userId = sessionData.userid, email = sessionData.useremail;
    var quizresult = {
        "userid": userId,
        "email": email,
        "id": id,
        "categoryname": categoryName,
        "score": scoreValue,
        "totalquestions": totalquestions,
        "correct": scoreValue,
        "totaltime": time,
        "timestamp": new Date(),
    }
    var per = parseInt((scoreValue / totalquestions) * 100) + " %";
    $("#totalQuestions").text(totalquestions);
    $("#correctQuestions").text(scoreValue);
    $("#wrongQuestions").text(totalquestions - scoreValue);
    $("#percentage").text(per);
    $("#score").text(scoreValue + " out of " + totalquestions);
    var gameOverHTML = "<h1>Result</h1>";
    gameOverHTML += "<h2 id='score'> Your scores: " + scoreValue + "</h2>";
    $("#result").html(gameOverHTML);
    $.each(quiz.questions, function (i, n) {

        var optionsForAnswer = n['options'];
        var label1 = '<label class="option radio btn" id="label1" for="option1">' + optionsForAnswer[0] + '</label><br>';
        var label2 = '<label class="option radio btn" id="label2" for="option2">' + optionsForAnswer[1] + '</label><br>';
        var label3 = '<label class="option radio btn" id="label3" for="option3">' + optionsForAnswer[2] + '</label><br>';
        var label4 = '<label class="option radio btn" id="label4" for="option4">' + optionsForAnswer[3] + '</label><br></div>';
        var questionAnswerShow = '<h4 class="card-subtitle mb-2 text-muted" id="question">' + (i + 1) + ' . ' + n['question'] + '</h4><br><div class="container" role="group" aria-label="Basic radio toggle button group">'

        var userAnswerIndex = -1;
        if (n.userAnswer != undefined) {
            userAnswerIndex = parseInt(n.userAnswer.charAt(6)) - 1;
        }

        var index = 0;
        $.each(n.options, function (j, m) {
            if (m == n.answer) {
                index = j;
            }
        })


        if (index == userAnswerIndex) {
            if (index == 0) {
                label1 = '<label class="option radio btn" id="label1" for="option1" style="background-color:#92f081;">' + optionsForAnswer[0] + '</label><br>';
            } else if (index == 1) {
                label2 = '<label class="option radio btn" id="label2" for="option2" style="background-color:#92f081;">' + optionsForAnswer[1] + '</label><br>';
            } else if (index == 2) {
                label3 = '<label class="option radio btn" id="label3" for="option3" style="background-color:#92f081;">' + optionsForAnswer[2] + '</label><br>';
            } else if (index == 3) {
                label4 = '<label class="option radio btn" id="label4" for="option4" style="background-color:#92f081;">' + optionsForAnswer[3] + '</label><br></div>';
            }
        } else {
            if (index == 0) {
                label1 = '<label class="option radio btn" id="label1" for="option1" style="background-color:#92f081;">' + optionsForAnswer[0] + '</label><br>';
            } else if (index == 1) {
                label2 = '<label class="option radio btn" id="label2" for="option2" style="background-color:#92f081;">' + optionsForAnswer[1] + '</label><br>';
            } else if (index == 2) {
                label3 = '<label class="option radio btn" id="label3" for="option3" style="background-color:#92f081;">' + optionsForAnswer[2] + '</label><br>';
            } else if (index == 3) {
                label4 = '<label class="option radio btn" id="label4" for="option4" style="background-color:#92f081;">' + optionsForAnswer[3] + '</label><br></div>';
            }
            if (userAnswerIndex == 0) {
                label1 = '<label class="option radio btn" id="label1" for="option1" style="background-color:#f07373;">' + optionsForAnswer[0] + '</label><br>';
            } else if (userAnswerIndex == 1) {
                label2 = '<label class="option radio btn" id="label2" for="option2" style="background-color:#f07373;">' + optionsForAnswer[1] + '</label><br>';
            } else if (userAnswerIndex == 2) {
                label3 = '<label class="option radio btn" id="label3" for="option3" style="background-color:#f07373;">' + optionsForAnswer[2] + '</label><br>';
            } else if (userAnswerIndex == 3) {
                label4 = '<label class="option radio btn" id="label4" for="option4" style="background-color:#f07373;">' + optionsForAnswer[3] + '</label><br></div>';
            }

        }
        var fullDiv = questionAnswerShow + label1 + label2 + label3 + label4;
        //console.log(fullDiv);
        $('#showAnswersList').append(fullDiv);
    });
    addQuizResult(quizresult);
};

function addQuizResult(data) {
    $.ajax({
        method: "POST",
        url: 'http://localhost:3000/quizresult',
        data: data,
        success: function (response) {
            console.log(response);
        }
    });
}

$(document).ready(async function () {
    $("#showResultDiv").hide();
    $("#showAnswersDiv").hide();
    $("#goHomeButtonId").on('click', function () {
        $(location).attr('href', 'userhomepage.html');
    });

    // Go to next questions
    $("#nextQuestion").on('click', function (e) {
        e.preventDefault();
        var choice = $('input[name="options"]:checked');
        quiz.getQuestionIndex().userAnswer = choice.attr('id');
        //quiz.getQuestionIndex().userAnswer = choice.val();
        console.log("in guess : " + choice.val());
        quiz.guess(choice.val());
        quiz.questionIndex += 1;
        displayQuiz();
    })

    //Go to prev questions
    $("#prevQuestion").on('click', function () {
        var choice = $('input[name="options"]:checked').val();
        console.log("in guess : " + choice);
        quiz.guess(choice);
        quiz.questionIndex -= 1;
        displayQuiz();
    })


    var category = localStorage.getItem('categoryname');
    var questionList = await getQuestionList(category);
    var optionList = [];
    for (var question in questionList) {
        var optionArray = questionList[question]['options[]'];
        for (var optionArray1 in optionArray) {
            optionList.push(optionArray[optionArray1]);
        }
        var q = new QuestionObject(questionList[question]['question'], optionList, questionList[question]['answer'], null);
        questions.push(q);
        optionList = [];
    }
    var scoreArray = [];
    for (var i = 0; i < questions.length; i++) {
        scoreArray[i] = 0;
    }
    quiz = new Quiz(scoreArray, questions, 0);
    var quizTime = 30 * quiz.questions.length, display = $('#time');
    startTimer(quizTime, display);
    displayQuiz();

})

async function getQuestionList(category) {
    // var category = "category3";
    var questionList = await $.ajax({
        method: "GET",
        url: 'http://localhost:3000/questions?category=' + category,
        success: function (x) {
            return x;
        }
    });
    return questionList;
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var x = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text(minutes + ":" + seconds);
        if (timer <= 30) {
            $("#time").css('color', 'red');
        }
        if (--timer < 0) {
            // timer = duration;
            console.log("in timeer : " + (timer + 1));
            $("#timer").hide();
            showScores();
            clearInterval(x);
        } else if (quiz.isEnded()) {
            console.log("In ended : " + timer);
            $("#timer").hide();
            //showScores();
            clearInterval(x);
        }
    }, 1000);
}