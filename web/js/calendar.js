

var tmpl = document.getElementById('calendar_event');
var colors = ["#39CCCC", "#3D9970", "#F012BE", "#2ECC40", "#FF4136", "#25E84C", "#F76B38"];
var class_list;
var freeSlot_list;

var $user;
var $userId;
var $type;
var $calendar;
var $session;
var $sessionId;

var $add = document.getElementById('add');
var $remove = document.getElementById('remove');
var $option = document.getElementById('inputState');
var taskbox = document.getElementsByClassName('taskbox');
var old = $option.innerHTML;

$('document').ready(function () {
    class_list = [];
    freeSlot_list = [];
    $session = JSON.parse(localStorage.getItem('user'));
    $user = JSON.parse(localStorage.getItem('profile'));
    if ($user === null) {
        $user = $session;
        $sessionId = $session.id;
    }
    $userId = $user.id;
    $type = $user.type;

    var token = localStorage.getItem('accessToken');
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Info/User/Calendar",
        data: { userId: $userId, type: $type },
        headers: { 'Authorization': token },
        cache: false,
        success: function (result, status, response) {
            console.log(result);
            setCalendar(result);
        },
        error: function (request, err) {
            console.log(err);
        }
    });

    if ($session && $session.id == $userId && $user.type == 2) {
        $('.user').show();
    }
});

function setCalendar(result) {
    if ($type == 1) {
        $calendar = {
            userId: result._userId,
            classes: result._classes,
        }
    }
    else if ($type == 2) {
        $calendar = {
            userId: result._userId,
            classes: result._classes,
            freeSlots: result._freeslots
        }
    }

    showCalendar();
}

function showCalendar() {

    showClasses($calendar.classes);
    if ($type == 2) {
        showFreeSlots($calendar.freeSlots);
    }
    //sessionStorage.setItem('profile', JSON.stringify($user));

}

function showClasses(classes) {
    j = 0;
    for (i = 0; i < classes.length; i++) {
        var new_class = {
            tutor: classes[i].tutor,
            student: classes[i].student,
            level: classes[i].level,
            subject: classes[i].subject,
            starttime: classes[i].starttime,
            endtime: classes[i].endtime,
            day: classes[i].day
        }

        class_list.push(new_class);
        var color = colors[j];
        if (j == colors.length - 1) { j = -1; }
        j++;

        var newCard = tmpl.content.cloneNode(true);
        var event = newCard.querySelector('.event');
        event.setAttribute('style', 'background-color:' + color + '; border-color:' + color);

        newCard.querySelector('.time').innerHTML = '<h6>' + new_class.starttime + ' - ' + new_class.endtime + '</h6>';
        newCard.querySelector('.subject').innerHTML = '<h6>' + new_class.subject + '</h6>';
        newCard.querySelector('.level').innerHTML = '<h6>' + new_class.level + '</h6>';
        showEvent(new_class.day, newCard);
    }
    $calendar.classes = class_list;
}

function showFreeSlots(freeSlots) {

    for (i = 0; i < freeSlots.length; i++) {
        var freeSlot = {
            starttime: freeSlots[i].starttime,
            endtime: freeSlots[i].endtime,
            day: freeSlots[i].day
        }
        freeSlot_list.push(freeSlot);

        var color = "#D7F738";

        var newCard = tmpl.content.cloneNode(true);
        var event = newCard.querySelector('.event');
        event.setAttribute('id', 'free' + i);
        event.setAttribute('style', 'background-color:' + color + '; border-color:' + color);

        newCard.querySelector('.free_slot').innerHTML = '<h6>Free Time Slot</h6>';
        newCard.querySelector('.time').innerHTML = '<h6>' + freeSlot.starttime + ' - ' + freeSlot.endtime + '</h6>';
        showEvent(freeSlot.day, newCard);
    }
    $calendar.freeSolts = freeSlot_list;
}

function showEvent(day, newCard) {

    if (day == "Monday") {
        document.getElementsByClassName("mon")[0].appendChild(newCard);
    }
    else if (day == "Tuesday") {
        document.getElementsByClassName("tues")[0].appendChild(newCard);
    }
    else if (day == "Wednesday") {
        document.getElementsByClassName("wed")[0].appendChild(newCard);
    }
    else if (day == "Thursday") {
        document.getElementsByClassName("thurs")[0].appendChild(newCard);
    }
    else if (day == "Friday") {
        document.getElementsByClassName("fri")[0].appendChild(newCard);
    }
    else if (day == "Saturday") {
        document.getElementsByClassName("sat")[0].appendChild(newCard);
    }
    else if (day == "Sunday") {
        document.getElementsByClassName("sun")[0].appendChild(newCard);
    }
}

function showRemove() {
    $('#add').hide();
    $('#remove').show();
    $option.innerHTML = old;
    for (i = 0; i < freeSlot_list.length; i++) {
        if (freeSlot_list[i] !== null) {
            $option.innerHTML += '<option id="freeSlot' + i + '">' + freeSlot_list[i].day + " " + freeSlot_list[i].starttime + " - " + freeSlot_list[i].endtime;
        }
    }
}

function showAdd() {
    $('#add').show();
    $('#remove').hide();
}

function remove(e) {
    e.preventDefault();

    var $selected = $('#inputState').find('option:selected');
    if ($selected != 'Choose Time Slot') {
        var $timeslotId = parseInt($selected.attr('id').substr(8));
        var $timeslot = freeSlot_list[$timeslotId];
        console.log($timeslot);
        var token = localStorage.getItem('accessToken');
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/Info/Calendar/Tutor/Update",
            data: { action: 'remove', timeslot: JSON.stringify($timeslot), userId: $sessionId },
            cache: false,
            headers: { 'Authorization': token },
            success: function (result, status, response) {
                var element = document.getElementById("free" + $timeslotId);
                element.parentNode.removeChild(element);
                freeSlot_list[$timeslotId] = null;
            },
            error: function (request, err) {
                console.log(err);
            },
        });

        $('#remove').hide();
        $option.innerHTML = old;

    }
}

function add(e) {
    e.preventDefault();
    try {
        var $start = $.trim($('#start').val());
        var $end = $.trim($('#end').val());
        var $day = $('#inputDay').find('option:selected').text();

        if ($start.length > 0 && $end.length > 0 && $day != 'Choose Day') {
            var $newFreeSlot = {
                starttime: convertTimeFormat($start),
                endtime: convertTimeFormat($end),
                day: $day
            }
            if (validateAdd($newFreeSlot)) {
                var token = localStorage.getItem('accessToken');

                $.ajax({
                    type: "POST",
                    url: "http://localhost:8080/Info/Calendar/Tutor/Update",
                    data: { action: 'add', timeslot: JSON.stringify($newFreeSlot), userId: $sessionId },
                    headers: { 'Authorization': token },
                    cache: false,
                    success: function (result, status, response) {
                        freeSlot_list.push($newFreeSlot);
                        addFreeslot($newFreeSlot, freeSlot_list.length - 1);
                        $('#success').show().hide(5000);
                    },
                    error: function (request, err) {
                        console.log(err);
                    },
                });
            }
        }
        $('#add').hide();
    } catch (err) {
        console.log(err);
    }
}

function addFreeslot(freeSlot, id) {
    var color = "#D7F738";

    var newCard = tmpl.content.cloneNode(true);
    var event = newCard.querySelector('.event');
    event.setAttribute('id', 'free' + id);
    event.setAttribute('style', 'background-color:' + color + '; border-color:' + color);

    newCard.querySelector('.free_slot').innerHTML = '<h6>Free Time Slot</h6>';
    newCard.querySelector('.time').innerHTML = '<h6>' + freeSlot.starttime + ' - ' + freeSlot.endtime + '</h6>';
    showEvent(freeSlot.day, newCard);
}

function convertTimeFormat(time) {
    var parts = time.split(':');
    var H = parseInt(parts[0]);
    var h = H % 12 || 12;
    var ampm = (H < 12 || H === 24) ? "AM" : "PM";
    var timeString = ("0" + h).slice(-2) + ':' + parts[1] + ' ' + ampm;
    return timeString;
}

function getDate(timeStr) {
    var parts = timeStr.split(':');
    var parts2 = parts[1].split(' ');
    var hour = parseInt(parts[0]);
    var h=hour;
    if (parts2[1] == 'PM' && hour !== 12) {
        h=hour + 12;
    }
    var date = new Date(00, 00, 00, h, parseInt(parts2[0]));
    return date;
}

function validateAdd(newFreeSlot) {
    var newstart = getDate(newFreeSlot.starttime);
    var newend = getDate(newFreeSlot.endtime);
    if (newstart > newend) {
        $('#warning').show().hide(5000);
        return false;
    }
    for (i = 0; i < freeSlot_list.length; i++) {
        if (freeSlot_list[i] !== null) {
            var start = getDate(freeSlot_list[i].starttime);
            var end = getDate(freeSlot_list[i].endtime);
            if (newstart > start && newstart < end) {
                $('#danger').show().hide(5000);
                return false;
            }
            else if (newend > start && newend < end) {
                $('#danger').show().hide(5000);
                return false;
            }
        }
    }
    for (i = 0; i < class_list.length; i++) {
        var start = getDate(class_list[i].starttime);
        var end = getDate(class_list[i].endtime);
        if (newstart > start && newstart < end) {
            $('#danger').show().hide(5000);
            return false;
        }
        else if (newend > start && newend < end) {
            $('#danger').show().hide(5000);
            return false;
        }
    }
    return true;
}
