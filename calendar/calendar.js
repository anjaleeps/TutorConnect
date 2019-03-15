//const user = JSON.parse(window.localStorage.getItem('user'));
//const userid = user.getItem();
//const userType = user.getType();
const $userId = 5;
const userType = 1;

$('document').ready(function () {    
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/query.js",
        data: { action: 'getCalInfo', userid: $userId},
        cache: false,
        success: function (events) {
            showEvents("class",events);
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
}); 

$('document').ready(function () {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/query.js",
        data: { action: 'getFreeSlots', userid: $userId },
        cache: false,
        success: function (events) {
            showEvents("free",events);
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
});

$(document).ready(function () {

});

function showEvents(type, events) {
    
    var colors = ["#E82580", "#7925E8", "#25A0E8", "#254CE8", "#25E84C", "#F76B38"];
    var color = "#D7F738";
    var j = 0;
    var data;

    for (i = 0; i < events.length; i++) {
        var date = events[i].weekday;
        var start = events[i].start_time.split(":").slice(0, 2).join(":");
        var end = events[i].end_time.split(":").slice(0, 2).join(":");
        if (type == "class") {
            color = colors[j];
            data = '<div class="event class" style="background-color:' + color + '; border-color:' + color + ';" > <h4>' + start + ' - ' + end + '</h4><h4>' + events[i].subject_name + '</h4><h6>' + events[i].level_name + '</h6></div>';
            if (j == colors.length - 1) { j = -1; }
            j++;
        }
        else if (type == "free") {
            data = '<div class="event free" style="background-color:' + color + '; border-color:' + color + ';" > <h4>' + start + ' - ' + end +'</h4><h4>Free Time Slot</h4></div>';
        }
        

        
        /*if (userType == 1) {
            data += '<h5>' + events[i].ttr_name + '<h5></div>';
        }
        if (userType == 2) {
            data += '<h5>' + events[i].stu_name + '<h5></div>';
        }*/

        if (date == "Monday") {
            document.getElementsByClassName("mon")[0].innerHTML += data;
        }
        else if (date == "Tuesday") {
            document.getElementsByClassName("tues")[0].innerHTML += data;
        }
        else if (date == "Wednesday") {
            document.getElementsByClassName("wed")[0].innerHTML += data;
        }
        else if (date == "Thursday") {
            document.getElementsByClassName("thurs")[0].innerHTML += data;
        }
        else if (date == "Friday") {
            document.getElementsByClassName("fri")[0].innerHTML += data;
        }
        else if (date == "Saturday") {
            document.getElementsByClassName("sat")[0].innerHTML += data;
        }
        else if (date == "Sunday") {
            document.getElementsByClassName("sun")[0].innerHTML += data;
        }       
    }
}

