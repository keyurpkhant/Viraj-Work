class Question {
    constructor(id, category, question, options, answer) {
        this.id = id;
        this.category = category;
        this.question = question;
        this.options = options;
        this.answer = answer
    }
}

var questionList;
var selectedAnswer=null;
var selectedCategory1=null;
var selectedCategory2=null;
var editedAnswer;
var questionid ;

$(document).ready(async function () {

    var categorylist=await getCategoryList();
            console.log(categorylist);
            var datastring="";
            $.each(categorylist,function(index,value){
                var item='<a class="dropdown-item" href="#" >'+value.categoryname+'</a>';
                datastring+=item;
            });
            console.log();
            $("#select-category-2").html(datastring);
            $("#select-category-1").html(datastring);

    questionList = await getQuestionList();
    console.log(questionList);
    var datastring="";
    var questionlistbody=$('#questionlistbody');
    $.each(questionList, function (index, value) {

        var srno = "<td>" + (parseInt(index + 1)) + "</td>";
        var que = "<td>" + value.question + "</td>";
        var categoryname = "<td>" + value.category + "</td>";
        var editbutton = '<a data-bs-target="#editQuestionModal" onclick="updateModal('+index+')" class="edit" data-bs-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>';
        var deletebutton = '  <a data-bs-target="#deleteQuestionModal" onclick="deleteModal(\''+value.id+'\')" class="delete" data-bs-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>';
        datastring += "<tr>" + srno + que + categoryname +"<td>"+ editbutton +deletebutton+ "</td></tr>";
    });
    if (datastring.length != 0) {
        questionlistbody.html(datastring);
    }
    else {
        questionlistbody.html("<td colspan='3' >Be the first one to be on leaderboard!!!</td>");
    }
    // var optionList=[];
    // for(var question in questionList){
    //     var optionArray=questionList[question]['options[]'];
    //     for(var optionArray1 in optionArray){
    //         optionList.push(optionArray[optionArray1]);
    //     }
    //     var id=questionList[question]['id'];
    //     $('#questionListDiv').append("<button onclick='getQuestionDetailByID(\""+id+"\")'>Update</button><button onclick='deleteQuestion(\""+id+"\")'>delete</button><p>"+questionList[question]['question']+"</p><ul><li>"+optionList[0]+"</li><li>"+optionList[1]+"</li><li>"+optionList[2]+"</li><li>"+optionList[3]+"</li></ul>");
    //     optionList=[];
    // } 

    $('#add-question-modal').on('click',async function(){
            selectedAnswer=null;
            selectedCategory2=null;
    });

    $('#select-category-2 a').on('click', function(){
        selectedCategory2=this.text;
    });
    $('#select-category-1 a').on('click', function(){
        selectedCategory1=this.text;
    });

    $('#edit-answer a').on('click', function(){
        editedAnswer=$('#'+$(this).attr('value')).val();
        console.log(editedAnswer);
    });
    
    $('#select-answer-1 a').on('click', function(){
        selectedAnswer=$('#'+$(this).attr('value')).val();
    });

    $('#question-add-form').on('submit', async function () {
        var category = selectedCategory2;
        console.log(selectedCategory2);
        if (selectedCategory2==null) {
            $('#error-msg-add').text('please select category first!!');
        }
        else if(selectedAnswer==null)
        {
            $('#error-msg-add').text('please select option for correct answer!!!');
        }
        
        var category=selectedCategory2;
        var question = $('#question').val();
        var optionA = $('#option-1').val();
        var optionB = $('#option-2').val();
        var optionC = $('#option-3').val();
        var optionD = $('#option-4').val();

        // var answer = $("#" + $('#answer').find(":selected").val()).val();
        var answer = selectedAnswer;
        var options = [optionA, optionB, optionC, optionD];
        var id = "questions-" + uuidv4();
        var question = new Question(id, category, question, options, answer);
        await addQuestion(question);
    });

    $('#question-update-form').on('submit', async function () {
        await updateQuestion();
        location.reload();
    });
    
    $('#delete-question-button').on('click',async function(){
        console.log("in question delete");
        await deleteQuestion(questionid);
    });

    

});

function deleteModal(id){
    questionid=id;
}

function updateModal(index)
{
    console.log(questionList[index]);
    var currentQuestion=questionList[index];
    $('#edit-question-id').val(questionList[index].id);
    $('#edit-question').val(questionList[index].question);
    $('#edit-option-1').val(questionList[index]['options[]'][0]);
    $('#edit-option-2').val(questionList[index]['options[]'][1]);
    $('#edit-option-3').val(questionList[index]['options[]'][2]);
    $('#edit-option-4').val(questionList[index]['options[]'][3]);
    editedAnswer=currentQuestion.answer;
    // var question=$('')
}

// Create Uniq Universal ID
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

// Add Question to database
function addQuestion(question) {
    $.ajax({
        method: "POST",
        url: 'http://localhost:3000/questions/',
        data: question,
        success: function (response) {
            // console.log(response);
            location.reload();
        }
    });
}

// Give Json object of Question List
async function getQuestionList() {
    var questionList = await $.ajax({
        method: "GET",
        url: 'http://localhost:3000/questions/',
        success: function (x) {
            //console.log(x);
            return x;
        }
    });
    return questionList;
}

// Fetch Qestion Detail By ID in update
// async function getQuestionDetailByID(id){
//     var question= await $.ajax({
//         method: "GET",
//         url: 'http://localhost:3000/questions/'+id,
//         success: function (x) {
//             console.log(x);
//         //     var optionList=[];
//         //     var optionArray=x['options[]']
//         //     for(var optionArray1 in optionArray){
//         //         console.log(optionArray[optionArray1]);
//         //         optionList.push(optionArray[optionArray1]);
//         //     }
//         //     alert(`Select Category : <select name="category" id="category2">
//         //     </select>
//         //     <br>
//         //   Enter question:<input type="text" id="question" value="`+x.question+`"required><br>
//         //   Option A:<input type="text" id="a" value="`+optionList[0]+`"required><br>
//         //   Option B:<input type="text" id="b" value="`+optionList[1]+`"required><br>
//         //   Option C:<input type="text" id="c" value="`+optionList[2]+`"required><br>
//         //   Option D:<input type="text" id="d" value="`+optionList[3]+`"required><br>
//         //   Answer  <select name="answer" id="answer">
//         //       <option value="a">A</option>
//         //       <option value="b">B</option>
//         //       <option value="c">C</option>
//         //       <option value="d">D</option>
//         //     </select>
//         //   <br>
//         //   <input type="submit" value="Add Question" onclick="onQuestionSubmit()">`);
//         return x;
//         }
//     });
//     return question;
// }

// Delete Question based on ID
async function deleteQuestion(id) {
    console.log(id);
    await $.ajax({
        method: "DELETE",
        url: 'http://localhost:3000/questions/' + id,
        success: function (x) {
            console.log(x);
            location.reload();
        },
        error:function(e){
            console.log(e);
        }
    })
}


async function updateQuestion() {
    var id =$('#edit-question-id').val();
    var question = $('#edit-question').val();
    var optionA = $('#edit-option-1').val();
    var optionB = $('#edit-option-2').val();
    var optionC = $('#edit-option-3').val();
    var optionD = $('#edit-option-4').val();
    
    console.log(id);
    var options = [optionA, optionB, optionC, optionD];
    console.log(options);
   
    var data = {
        "question": question,
        "options": options,
        "answer": editedAnswer
    }
    console.log(data);
    await $.ajax({
        method: "PATCH",
        url: 'http://localhost:3000/questions/' + id,
        data: data,
        success: function (x) {
            console.log(x);
            // alert(response);
        }
    });
}

async function getCategoryList(){
    var categoryList= await $.ajax({
        method: "GET",
        url: 'http://localhost:3000/category/',
        success: function (x) {
            //console.log(x);
            return x;
        }
    });
    return categoryList;
}