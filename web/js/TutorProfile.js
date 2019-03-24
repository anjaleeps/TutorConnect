const $ID = 2;
$ ('document').ready(showProfile());
function showProfile(){
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/query.js",
        data: {action: 'showProfile', ID: $ID},
        cache: false,
        success: function (results) {
        	showResults(results);   
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

function showResults(results) {
    for (i = 0; i < results.length; i++) {
        var ID = results[i].ID;
        var Name = results[i].Name;
        var Area = results[i].Area;
        var Qualifications = results[i].Qualifications;
        var Rating = results[i].Rating;
        var About = results[i].About;
        var Subject = results[i].Subject;
        var Image = results[i].Image;
        var Pnumber = results[i].Pnumber;
        var Email = results[i].Email;
    }

    document.getElementById("Name").innerHTML = Name;
    document.getElementById("About").innerHTML = '<p>' + About + '</p>';
    for (i = 0; i < qualifs.length; i++) {
        document.getElementById("Qualifications").innerHTML += '<p>' + Qualifications + '</p>';
    }
    document.getElementById("Area").innerHTML = 'Teaches around' + Area;
    document.getElementById("Rating").innerHTML = Pnumber;
    document.getElementById("email").innerHTML = '<p>' + Email + '</p>';
    document.getElementById("video").setAttribute = video;
}