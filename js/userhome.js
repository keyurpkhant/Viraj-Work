
$('document').ready(async function () {
    let userid=localStorage.getItem('userid')
   let user = await getUser(userid);
   let fullname = (user.firstname) + " " + (user.lastname);
   if (user.gender=="Male") {
       $("#display-avatar").attr("src","../assets/img/male.png");
   } 
   else{
    $("#display-avatar").attr("src","../assets/img/female.png");
   }
    $("#username").text(user.firstname);
    $("#display-name").text(fullname.toUpperCase());
    $("#username").text(user.firstname);
    $("#display-email").text(user.email);
    $("#display-mobile").text(user.mob);

    $('#myprofile-list').on('click', function () {

        $('#firstname').val(user.firstname);
        $('#lastname').val(user.lastname);
        $('#email').val(user.email);
        $('#mobile').val(user.mob);
        $('#securityque').val(user.securityQuestion);
        $('#securityans').val(user.securityAnswer);

    });


    $('#logout').on('click', function () {
        console.log('hello');
        deleteSession();
        $(location).attr('href', 'login.html');
    });


    $('#mobile').keyup(() => {
        isValidMobile();
    });

    $('#resetpasswordbtn').on('click', function () {
        $(location).attr('href', 'resetpassword.html');
    });


    $('#updateform').on('submit', async function (ev) {
        ev.preventDefault();
        // alert('in update');
        var firstname = $("#firstname").val();
        var lastname = $("#lastname").val();
        var mob = $("#mobile").val();
        var securityans = $('#securityans').val();
        let updatedUser=user;
        updatedUser.firstname=firstname;
        updatedUser.lastname=lastname;
        updatedUser.mob=mob;
        updatedUser.securityAnswer=securityans;
        if(isValidMobile)
        {
           await $.ajax({
                method: "PUT",
                url: "http://localhost:3000/user/" + userid,
                data: updatedUser,
                success: x => {
                  console.log("Success " + x);
                  alert("Profile Successfully updated");
                  location.reload();
                //   $(location).attr("href", "login.html");
                },
                error: x => {
                    

                  console.log("Error");
                }
              });
              
        }

    });

  
});

function isValidMobile() {
    var mobile = $('#mobile');

    if (!mobile.val().match(/^[6-9]{1}[0-9]{9}$/)) {
        mobile[0].setCustomValidity('Mobile number only have 10 digit and must be valid');
        return false;
    }
    else {
        mobile[0].setCustomValidity('');
    }
    return true;
}

async function getUser(id) {

    let user = await $.ajax({
        url: "http://localhost:3000/user/" + id,
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
    console.log("check flag " + user);
    return user;
}

