$(document).ready(async function(){
    let id=localStorage.getItem('userid')
    let admin = await getAdmin(id);

    $("#username").text(admin.name);
    $('#logout').on('click', function () {
        console.log('hello');
        deleteSession();
        $(location).attr('href', 'login.html');
    });
});

async function getAdmin(id) {

    let admin = await $.ajax({
        url: "http://localhost:3000/admin/" + id,
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
    return admin;
}