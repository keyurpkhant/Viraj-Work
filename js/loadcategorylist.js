$(document).ready(async function () {
    
        
        var categories = await getCategoryList();
        console.log(categories);
    
        var categorycomponentstring = "";
        $.each(categories, function (index, value) {
            var categorytitle = '<h5 class="card-title  category-title">' + value.categoryname + '</h5>';
            var categorydescription = '<p class="card-text category-desc">' + value.categorydescription.substring(0, 100) + '...</p>';
            // var startbutton = '<button value' + index + ' class="btn btn-primary start-quiz">Start Quiz</button>';
            var startbutton = '<button id="start-quiz-button" onclick="onStartQuiz(\'' + value.categoryname + '\')" class="btn btn-primary start-quiz">Start Quiz</button>';
    
            categorycomponentstring += '<div class="category card my-5">'
                + '<div class="card-body row ">'
                + '<div class="col-md-12 col-lg-4 odd-left-container">'
                + categorytitle
                + '</div> <div class="col-md-12 col-lg-8 odd-right-container">'
                + categorydescription
                + startbutton
                + '</div> </div> </div>';
    
        });
        $('#list-category').html(categorycomponentstring);

    
});

function onStartQuiz(categoryname) {
    console.log(categoryname);

    localStorage.setItem('categoryname', categoryname);

    $(location).attr('href','quizpage.html');
};


/** Fetch Category List */
async function getCategoryList() {
    var categoryList = await $.ajax({
        method: "GET",
        url: 'http://localhost:3000/category/',
        success: function (x) {
            //console.log(x);
            return x;
        }
    });
    return categoryList;
}
