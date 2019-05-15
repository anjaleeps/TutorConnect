var req_list = document.getElementById('requests_list');
var temp = document.getElementById('request_temp');
var option = document.getElementById('option');

var $tutor;
var $session;
var $tutorId;
var $sessionId;
var requests = [];
var freeSlots_list = [];
var $startStu;
var $removeStu;


$('document').ready(function () {
    var token = localStorage.getItem('accessToken');
    $tutor = JSON.parse(sessionStorage.getItem('profile'));
    $session = JSON.parse(localStorage.getItem('user'));
    $tutorId = $tutor.id;
    $sessionId = $session.id;
    if ($tutorId === $sessionId) {
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/Class/Tutor/Requests",
            data: { tutorId: $tutorId },
            headers: { 'Authorization': token },
            cache: false,
            success: function (results, status, response) {
                var token = response.getResponseHeader('Authorization');
                window.localStorage.setItem('accessToken', token);
                showRequests(JSON.parse(results));
            },
            error: function (request, err) {
                console.log(err);
            }
        });

        option.innerHTML = '<option selected>Choose Time Slot</option>';

        $.ajax({
            type: "GET",
            url: "http://localhost:8080/Class/Tutor/Start/Time",
            data: { tutorId: $tutorId },
            headers: { 'Authorization': token },
            cache: false,
            success: function (results, status, response) {
                var token = response.getResponseHeader('Authorization');
                window.localStorage.setItem('accessToken', token);
                showFreeSlots(results);

            },
            error: function (request, err) {
                console.log(err);
            }
        });
    }
});

function showRequests(results) {
    var requests = [];
    for (i = 0; i < results.length; i++) {
        var student = results[i];
        addRequest(student);
        requests.push(student);
    }
}

function addRequest(student) {
    req_list.innerHTML = "";
    newReq = tmpl.content.cloneNode(true);
    newReq.querySelector('.request').id = "request" + student.id;
    newReq.querySelector('.card-text').innerText = student.firstname + " " + student.lastname;
    req_list.appendChild(newReq);
}

function setStartStudent(e) {
    e.preventDefault();
    $startStu = parseInt($(this).id.substr(7));
}

function setRemoveStudent(e) {
    e.preventDefault();
    $removeStu = parseInt($(this).id.substr(7));
}

function remove(e) {
    e.preventDefault();
    //var $stuId = parseInt($(this).id.substr(7));
    if ($tutorId === $sessionId) {
        var token = localStorage.getItem('accessToken');
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/Class/Tutor/Request/Delete",
            data: { tutorId: $tutorId, studentId: $removeStu },
            headers: { 'Authorization': token },
            cache: false,
            success: function (results, status, response) {
                var token = response.getResponseHeader('Authorization');
                window.localStorage.setItem('accessToken', token);
                alert('request successfully removed');
                window.location.href = "http://localhost:8080/requests.html"
            },
            error: function (request, err) {
                console.log(err);
            }
        });
    }
}

function start(e) {
    e.preventDefault();
    var $selected = $('#option').find('option:selected');
    if ($selected != 'Choose Time Slot') {
        var $timeslotId = parseInt($selected.attr("id").substr(8));
        var $timeslot = freeSlot_list[$timeslotId];
        if ($tutorId === $sessionId) {
            var token = localStorage.getItem('accessToken');
            $.ajax({
                type: "GET",
                url: "http://localhost:8080/Class/Tutor/Request/Delete",
                data: { tutorId: $tutorId, studentId: $removeStu },
                headers: { 'Authorization': token },
                cache: false,
                success: function (results, status, response) {
                    var token = response.getResponseHeader('Authorization');
                    window.localStorage.setItem('accessToken', token);
                    alert('request successfully removed');
                    window.location.href = "http://localhost:8080/requests.html"
                },
                error: function (request, err) {
                    console.log(err);
                }
            });
        }
    
}

function showFreeSlots(freeSlots) {

    for (i = 0; i < freeSlots.length; i++) {
        var freeSlot = {
            starttime: freeSlots[i].starttime,
            endtime: freeSlots[i].endtime,
            day: freeSlots[i].day
        }
        option.innerHTML += '<option id="freeSlot' + i + '">' + freeSlot.day + " " + freeSlot[i].starttime + " - " + freeSlot[i].endtime;
        freeSlots_list.push(freeSlot);
    }
    