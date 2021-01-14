$(document).ready(function () {

    $('#user-profile-list').on('click', async function () {
        let users = await getUsers();

        var userdetailstable= $('#user-profile-table');
        var datastring = "";
        $('#usercount').text("Total Users: "+users.length);
        $.each(users, function (index, value) {
            var srno = "<td>" + (parseInt(index + 1)) + "</td>";
            var name = "<td>" + value.firstname + " " + value.lastname + "</td>";
            var email = "<td>" + value.email + "</td>";
            var gender = "<td>" + value.gender + "</td>";
            var mobile = "<td>" + value.mob + "</td>";
            datastring += "<tr>" + srno + name + email + gender + mobile + "</tr>";
        });
        if (datastring.length != 0) {
            userdetailstable.html(datastring);
        }
        else {
            userdetailstable.html("<td colspan='3' >Be patient Some one will come around soon!!!</td>");
        }
        console.log(users);
    });
});