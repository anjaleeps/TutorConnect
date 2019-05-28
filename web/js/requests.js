var req_list = document.getElementById('requests_list');
var tmpl = document.getElementById('requests_temp');
var option = document.getElementById('option');
var level = document.getElementById('level');
var subject = document.getElementById('subject');

var $session;
var $sessionId;
var requests = [];
var freeSlots_list = [];
var $startStu;
var $removeStu;
var mods;
var $selLevel;

$('document').ready(function () {
    var token = localStorage.getItem('accessToken');
    $session = JSON.parse(localStorage.getItem('user'));
    $sessionId = $session.id;

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Class/Tutor/Requests",
        data: { tutorId: $sessionId },
        headers: { 'Authorization': token },
        cache: false,
        success: function (results, status, response) {
            showRequests(results);
        },
        error: function (request, err) {
            console.log(err);
        }
    });

    option.innerHTML = '<option selected>Choose Time Slot</option>';
    level.innerHTML = '<option selected>Choose Level</option>';

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Class/Tutor/Modules",
        data: { tutorId: $sessionId },
        headers: { 'Authorization': token },
        success: function (results, status, response) {
            mods = results;
            showModules(results);

        },
        error: function (request, err) {
            console.log(err);
        }

    });
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Class/Tutor/Freetime",
        data: { tutorId: $sessionId },
        headers: { 'Authorization': token },
        cache: false,
        success: function (results, status, response) {
            showFreeSlots(results);

        },
        error: function (request, err) {
            console.log(err);
        }
    });

});

function showRequests(results) {
    if (results.length == 0) {
        $('#no_req').show();
    }
    var requests = [];
    for (i = 0; i < results.length; i++) {
        var student = results[i];
        addRequest(student);
        requests.push(student);
    }
}

function addRequest(student) {
    //console.log(student);
    newReq = tmpl.content.cloneNode(true);
    newReq.querySelector('.request').id = "request" + student.id;
    newReq.querySelector('.card-text').innerText = student.name;
    req_list.appendChild(newReq);
}

function setStartStudent(e) {
    var $par = $(e).parent().parent().parent().parent();
    $startStu = parseInt(($par.attr('id')).substr(7));
}

function setRemoveStudent(e) {
    var $par = $(e).parent().parent().parent().parent();
    console.log($par);
    $removeStu = parseInt(($par.attr('id')).substr(7));
}

function remove(e) {
    //e.preventDefault();
    //var $stuId = parseInt($(this).id.substr(7));

    var token = localStorage.getItem('accessToken');
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Class/Tutor/Request/Remove",
        data: { tutorId: $sessionId, studentId: $removeStu },
        headers: { 'Authorization': token },
        cache: false,
        success: function (results, status, response) {
            var element = document.getElementById('request' + $removeStu);
            element.parentNode.removeChild(element);
            //alert('request successfully removed');
            //window.location.href = "http://localhost:8080/requests.html"
        },
        error: function (request, err) {
            console.log(err);
        }
    });

}

function start(e) {
    e.preventDefault();
    var $selected = $('#option').find('option:selected');
    var $selSub = $('#subject').find('option:selected').text();
    if ($selSub != 'Choose Subject' && $selected != 'Choose Time Slot') {
        var $timeslotId = parseInt($selected.attr("id").substr(8));
        var $timeslot = freeSlots_list[$timeslotId];

        var $newClass ={
            tutor: $sessionId,
            student: $startStu,
            level: $selLevel,
            subject: $selSub,
            starttime: $timeslot.starttime,
            endtime: $timeslot.endtime,
            day: $timeslot.day
        }
        console.log($newClass);

        var token = localStorage.getItem('accessToken');
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/Class/Start",
            data: {newClass: JSON.stringify($newClass) },
            headers: { 'Authorization': token },
            success: function (results, status, response) {
                var element = document.getElementById('request' + $startStu);
                element.parentNode.removeChild(element);
            },
            error: function (request, err) {
                console.log(err);
            }
        });
    }
}


function showFreeSlots(freeSlots) {

    for (i = 0; i < freeSlots.length; i++) {
        var freeSlot = freeSlots[i];

        option.innerHTML += '<option id="freeSlot' + i + '">' + freeSlot.day + " " + freeSlot.starttime + " - " + freeSlot.endtime + '</option>';
        freeSlots_list.push(freeSlot);
    }

}

function showModules(results) {
    for (var mod in results) {
        level.innerHTML += '<option>' + mod + '</option>';
    }
}

function onLevelChange(e) {
    subject.innerHTML = '<option selected>Choose Subject</option>';
    $selLevel = $('#level').find('option:selected').text();
    if ($selLevel != "Choose Level") {
        for (i = 0; i < mods[$selLevel].length; i++) {
            subject.innerHTML += '<option>' + mods[$selLevel][i] + '</option>';
        }
    }
}