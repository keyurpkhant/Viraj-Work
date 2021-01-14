let usersession;
$(document).ready(function () {
    usersession = getUserSessionData();
    $('#mystats-list').on('click', async function () {
        let quizHistory = await getUserQuizHistory();


        getPieChart(quizHistory);
        getBarChart(quizHistory)
        quizHistory.sort((a, b) => {
            return new Date(b.timestamp) - new Date(a.timestamp);
        });

        var historyTable = $('#history-body');
        var datastring = "";
        $.each(quizHistory, function (index, value) {

            var datetime = new Date(value.timestamp);
            var per = (parseInt(value.score) * 100) / parseInt(value.totalquestions);
            console.log(datetime.getDate());
            var srno = "<td>" + (parseInt(index + 1)) + "</td>";
            var category = "<td>" + value.categoryname + "</td>";
            var timeofattempt = "<td>" + datetime.toLocaleString('en-GB') + "</td>";
            var percentage = "<td>" + per.toPrecision(4) + "%</td>";
            datastring += "<tr>" + srno + category + timeofattempt + percentage + "</tr>";
        });
        if (datastring.length != 0) {
            historyTable.html(datastring);
        }
        else {
            historyTable.html("<td colspan='3' >Give your first quiz from category tab!!!</td>");
        }
    });
});



/** get quiz result of all user  in leader board*/
async function getUserQuizHistory() {
    var quizResultList = await $.ajax({
        method: "GET",
        url: 'http://localhost:3000/quizresult?userid=' + usersession.userid,
        success: function (x) {
            return x;
        }
    });
    return quizResultList;
}

async function getPieChart(quizHistory) {
    var categoryPieChart = {};
    $.each(quizHistory, function (i, n) {
        console.log(n['email']);
        if (categoryPieChart[n['categoryname']] == undefined) {
            categoryPieChart[n['categoryname']] = 1;
        } else {
            categoryPieChart[n['categoryname']] = parseInt(categoryPieChart[n['categoryname']]) + 1;
        }
    });
    console.log(categoryPieChart);
    var categoryPieChartArray = Object.keys(categoryPieChart).map(function (key) {
        return [key, categoryPieChart[key]];
    });
    console.log(categoryPieChartArray);
    //return categoryPieChartArray;




    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        categoryPieChartArray.unshift(["Category", "Quiz Given"]);
        console.log(categoryPieChartArray);
        var data = google.visualization.arrayToDataTable(
            categoryPieChartArray
        );

        var options = {
            title: 'Category Wise Quiz Given',
            x: 0,
            y: 0,
            chartArea: {
                left: 10,
                top: 20,
                width: '100%',
                height: '80%'
            },
            pieHole: 0.3
        };

        var chart = new google.visualization.PieChart($('#piechart')[0]);

        chart.draw(data, options);
    }
}

async function getBarChart(quizHistory) {

    var categoryBarChart = {};
    $.each(quizHistory, function (i, n) {
        console.log(n['categoryname']);

        if (categoryBarChart[n['categoryname']] == undefined) {
            categoryBarChart[n['categoryname']] = parseInt(n['score']);
        } else {
            categoryBarChart[n['categoryname']] = parseInt(categoryBarChart[n['categoryname']]) + parseInt(n['score']);
        }
    });
    console.log(categoryBarChart);
    var flag = 0;
    var categoryBarChartArray = Object.keys(categoryBarChart).map(function (key) {
        if (flag == 0) {
            flag = 1;
            return [key, categoryBarChart[key], 'green'];
        } else {
            flag = 0;
            return [key, categoryBarChart[key], 'blue'];
        }

    });
    console.log(categoryBarChartArray);
    //return categoryPieChartArray;
    categoryBarChartArray.unshift(["Element", "Score", { role: "style" }]);
    console.log(categoryBarChartArray);
    google.charts.load("current", { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var data = google.visualization.arrayToDataTable(
            categoryBarChartArray
        );

        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1,
            {
                calc: "stringify",
                sourceColumn: 1,
                type: "string",
                role: "annotation"
            },
            2]);

        var options = {
            title: "Category Wise Score",
            bar: { groupWidth: "60%" },
            legend: { position: "none" },
            chartArea: {
                left: 10,
                top: 20,
                width: '100%',
                height: '80%'
            },
        };
        var chart = new google.visualization.ColumnChart($('#barchart')[0]);
        chart.draw(view, options);
    }
}