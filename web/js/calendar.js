//const user = JSON.parse(window.localStorage.getItem('user'));
//const userid = user.getItem();
//const userType = user.getType();
const $userId = 3;
const userType = 1;
var freeslots;
var old;
var option;

$('document').ready(getClasses());
$('document').ready(getFreeslots());

function getClasses() {    
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
} 

function getFreeslots() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/query.js",
        data: { action: 'getFreeSlots', userid: $userId },
        cache: false,
        success: function (events) {
            freeslots = events;
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
}

$(document).ready(function () {

});

function showEvents(type, events) {
    
    var colors = ["#39CCCC", "#3D9970", "#F012BE", "#2ECC40", "#FF4136", "#25E84C", "#F76B38"];
    var color = "#D7F738";
    var j = 0;
    var data;

    for (i = 0; i < events.length; i++) {
        var date = events[i].weekday;
        var start = events[i].start_time
        var end = events[i].end_time;

        if (type == "class") {
            color = colors[j];
            data = '<div class="event class rounded" style="background-color:' + color + '; border-color:' + color + ';" > <h5>' + start + ' - ' + end + '</h5><h6>' + events[i].subject_name + '</h6><h6>' + events[i].level_name + '</h6></div>';
            if (j == colors.length - 1) { j = -1; }
            j++;
        }
        else if (type == "free") {
            data = '<div class="event free rounded" style="background-color:' + color + '; border-color:' + color + ';" > <h5>' + start + ' - ' + end +'</h5><h6>Free Time Slot</h6></div>';
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

function showRemove() {
    document.getElementById('add').setAttribute('style', 'display:none;');
    document.getElementById('remove').setAttribute('style', 'visibility:visible;');
    option = document.getElementById('inputState');
    old = option.innerHTML;
    for (i = 0; i < freeslots.length; i++) {
        option.innerHTML += "<option>" + freeslots[i].weekday + " " + freeslots[i].start_time + " - " + freeslots[i].end_time;
    }
}

function showAdd() {
    document.getElementById('remove').setAttribute('style', 'display:none;');
    document.getElementById('add').setAttribute('style', 'visibility:visible;');
}

function remove() {
    let $timeslot = $('#inputState').find('option:selected').text();
    if ($timeslot != 'Choose Time Slot') {
        $.ajax({
            type: "POST",
            url: "http://localhost:8080",
            data: { action: 'removeTimeslot', timeslot: $timeslot, userid:$userId },
            cache: false,
            success: function () {
                reset();
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
    document.getElementById('remove').setAttribute('style', 'display:none;');
    option.innerHTML = old;
    return false;
}

function add() {
    let $start = $.trim(document.getElementById('start').value);
    let $end = $.trim(document.getElementById('end').value);
    let $day = $('#inputDay').find('option:selected').text();
    if ($start.length > 0 && $end.length > 0 && $day != 'Choose Day') {
        if ($start < $end) {
            
            $.ajax({
                type: "POST",
                url: "http://localhost:8080",
                data: { action: 'addTimeslot', start: $start, end: $end, day: $day, userid: $userId },
                cache: false,
                success: function (result) {
                   
                    if (result == 'taken') {
                        document.getElementById('danger').setAttribute('style', 'visibility:visible');
                        setTimeout(function () { document.getElementById('danger').setAttribute('style', 'display:none') }, 5000);
                    }
                    else if (result == 'added') {
                        reset();
                        document.getElementById('success').setAttribute('style', 'visibility:visible')
                        setTimeout(function () { document.getElementById('success').setAttribute('style', 'display:none') }, 5000);
                    }
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
        } else {
            document.getElementById('warning').setAttribute('style', 'visibility:visible');
            setTimeout(function () { document.getElementById('warning').setAttribute('style', 'display:none') }, 10000);
        }
    }
    document.getElementById('add').setAttribute('style', 'display:none;');
}

function reset() {
    let taskbox = document.getElementsByClassName('taskbox');
    for (i = 0; i < taskbox.length; i++) {
        taskbox[i].innerHTML = "";
    }
    getClasses();
    getFreeslots();
}