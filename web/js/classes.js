var clz_list = document.getElementById('classes_list');
var tmpl = document.getElementById('classes_temp');
var option = document.getElementById('option');

var $session;
var $sessionId;
var classes = [];
var freeSlots_list = [];
var $reschedClz;
var $endClz;
var mods;
var newClz;

$('document').ready(function () {
    var token = localStorage.getItem('accessToken');
    $session = JSON.parse(localStorage.getItem('user'));
    $sessionId = $session.id;

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Class/Classes",
        data: { userId: $sessionId },
        headers: { 'Authorization': token },
        cache: false,
        success: function (results, status, response) {
            showClasses(results);
        },
        error: function (request, err) {
            console.log(err);
        }
    });
    if ($session.type == 2) {
        option.innerHTML = '<option selected>Choose Time Slot</option>';
    }

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

function showClasses(results) {
    if (results.length == 0) {
        $('#no_class').show();
    }
    for (i = 0; i < results.length; i++) {
        var clz = results[i];
        addClass(clz, i);
        classes.push(clz);
    }
}

function addClass(clz, i) {
    console.log(clz);
    newClz = tmpl.content.cloneNode(true);
    newClz.querySelector('.clz').id = "class" + i;
    newClz.querySelector('.name').innerText = "For " + clz.studentName + " on " + clz.day;
    newClz.querySelector('.level').innerText = "Level: " + clz.level;
    newClz.querySelector('.subject').innerText = "Subject: " + clz.subject;
    newClz.querySelector('.from').innerText = "From: " + clz.starttime;
    newClz.querySelector('.to').innerText = "To: " + clz.endtime;
    clz_list.appendChild(newClz);
}

function setRescheduleClass(e) {
    var $par = $(e).parent().parent().parent();
    console.log($par);
    $reschedClz = parseInt(($par.attr('id')).substr(5));
}

function setEndClass(e) {
    var $par = $(e).parent().parent().parent();
    $endClz = parseInt(($par.attr('id')).substr(5));
    console.log($endClz);
}

function endClass(e) {
    //e.preventDefault();
    //var $stuId = parseInt($(this).id.substr(7));

    var token = localStorage.getItem('accessToken');
    var $end = classes[$endClz];
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/Class/End",
        data: { endClass: JSON.stringify($end) },
        headers: { 'Authorization': token },
        cache: false,
        success: function (results, status, response) {
            var element = document.getElementById('class' + $endClz);
            element.parentNode.removeChild(element);
        },
        error: function (request, err) {
            console.log(err);
        }
    });

}

function reschedule(e) {
    e.preventDefault();
    var $selected = $('#option').find('option:selected');
    if ($selected != 'Choose Time Slot') {
        var $timeslotId = parseInt($selected.attr("id").substr(8));
        var $timeslot = freeSlots_list[$timeslotId];

        var $resched = classes[$reschedClz];
        $resched.starttime = $timeslot.starttime;
        $resched.endtime = $timeslot.endtime;
        $resched.day = $timeslot.day;
        console.log($resched);

        var token = localStorage.getItem('accessToken');
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/Class/Reschedule",
            data: { reschedClass: JSON.stringify($resched) },
            headers: { 'Authorization': token },
            success: function (results, status, response) {
                var element = document.getElementById('class' + $reschedClz);
                element.querySelector('.name').innerText = "For " + $resched.studentName + " on " + $resched.day;
                element.querySelector('.from').innerText = "From: " + $resched.starttime;
                element.querySelector('.to').innerText = "To: " + $resched.endtime;
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
