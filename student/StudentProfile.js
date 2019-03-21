const $student_id = 3;
$('document').ready(goToProfile());
function goToProfile(){
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/query.js",
        data: {action: 'goToProfile', student_id: $student_id},
        cache: false,
        success: function (results) {
            showProfile(results);
        },
        error: function (request, err) {

            alert(err);
            console.log(err);
        },
        done: function () {
            alert("Done");
            console.log("Done");
        }
    });
}

function showProfile(results) {
    console.log(results);
    for (i = 0; i < results.length; i++) {
           var student_id = results[i].student_id;
           var firstname = results[i].firstname;
           var lastname = results[i].lastname;
           var picture = results[i].picture;
           var area = results[i].area;
           var details =  results[i].StudentDetails;
    }
    if (picture==null){picture="login2.jpg";}
    document.getElementById("name").innerHTML = '<p><b>'+firstname+' '+lastname+'</b></p>';
    document.getElementById("image").innerHTML = '<img src = '+picture+' style = "width:260px; height:350px">';
    document.getElementById("area").innerHTML= '<p name="calender"><b><i class="fa fa-map-marker" aria-hidden="true"></i> '+ '&emsp;'+ area+'</b></p>'
}
