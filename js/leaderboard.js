$(document).ready(function () {
    $('#leaderboard-list').on('click',async function () {

        let leaderboarddata = await getLeaderBoard();
        var leaderboardtable = $('#leaderboardbody');
        var datastring = "";

        $.each(leaderboarddata, function (index, value) {

            var rank = "<td>#" + (parseInt(index + 1)) + "</td>";
            var name = "<td>" + value[2] + "</td>";
            var email = "<td>" + value[0] + "</td>";
            var percentage = "<td>" + value[1] + "%</td>";
            datastring += "<tr>" + rank + name + email + percentage + "</tr>";
        });
        if (datastring.length != 0) {
            leaderboardtable.html(datastring);
        }
        else {
            leaderboardtable.html("<td colspan='3' >Be the first one to be on leaderboard!!!</td>");
        }
    });
});

async function getLeaderBoard() {
    var user = await getUsers();
    var quizResult = await getQuizResult();
    var scoreCount = {}; // {'email':score}
    var quizCount = {}; // {'email':quizCount}
    var percentageCount = {};
    //console.log(quizResult);

    $.each(quizResult, function (index, value) {

        /**Count the number of quiz per user */
        if (quizCount[quizResult[index].email] == undefined) {
            quizCount[quizResult[index].email] = 1;
        } else {
            quizCount[quizResult[index].email] = quizCount[quizResult[index].email] + 1;
        }

        /**count the total score for per user with all quiz test */
        if (scoreCount[quizResult[index].email] == undefined) {
            scoreCount[quizResult[index].email] = parseInt(quizResult[index].score);
        } else {
            var demoEmail = quizResult[index].email;
            scoreCount[quizResult[index].email] = parseInt(scoreCount[demoEmail]) + parseInt(quizResult[index].score);
        }

    });

    /**Count the percentage of the user based on quiz count and score count */
    $.each(user, function (index, value) {
        if (scoreCount[user[index].email] != undefined) {
            percentageCount[user[index].email] = parseFloat(((scoreCount[user[index].email] / (quizCount[user[index].email] * 3))) * 100).toPrecision(4);
        }
    })
    console.log(percentageCount);
    /** Create array from percentage json */
    var leaderBoard = Object.keys(percentageCount).map(function (key) {
        return [key, percentageCount[key]];
    });

    /**Sort the the leader board array   */
    leaderBoard.sort(function (first, second) {
        return second[1] - first[1];
    })


    /**Push the require detail in sorted array */
    $.each(leaderBoard, function (index) {
        var x = $(user).filter(function (i, n) {
            return leaderBoard[index][0] == n.email;
        })
        //console.log(x);
        leaderBoard[index].push(x[0].firstname + " " + x[0].lastname);
    })

    console.log(leaderBoard);
    return leaderBoard;
}

/** Get  user for leader board*/
async function getUsers() {
    let user = await $.ajax({
        url: "http://localhost:3000/user/",
        method: "GET",
        success: x => {
            // flag = 1;
            return x;
            // console.log("User exists");
        },
        error: x => {
            console.log("Error");
        }
    });
    //console.log("check flag " + user);
    return user;
}

/** get quiz result of all user  in leader board*/
async function getQuizResult() {
    var quizResultList = await $.ajax({
        method: "GET",
        url: 'http://localhost:3000/quizresult',
        success: function (x) {
            return x;
        }
    });
    return quizResultList;
}
