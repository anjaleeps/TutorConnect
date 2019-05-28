var user;

$('document').ready(function () {
    user = JSON.parse(localStorage.getItem('user'));
    if (user !== null) {
        showLoggedinBar();
        $('#login').hide();
        $('#logged_in').show();
    }
});

function showLoggedinBar() {
    $('#username').html(' '+user.firstname);
    if (user.type == 1) {
        //$('#clzes').attr('href', 'student_classes.html');
    }
    else if (user.type == 2) {
        $('#prof').show();
        $('#req').show();
        $('#prof').attr('href', 'single-tutor.html');
        //$('#clzes').attr('href', 'classes.html');
    }
}

$('#cal').on('click', function () {
    localStorage.removeItem('profile');
    window.location.href = "http://localhost:8080/calendar.html";
});

$('#clzes').on('click', function () {
    localStorage.removeItem('profile');
    if (user.type == 1) {
        window.location.href = "http://localhost:8080/student_classes.html";
    }
    else if (user.type == 2) {
        window.location.href = "http://localhost:8080/classes.html";
    }
});

$('#logout').on('click', function () {
    var token = localStorage.getItem('accessToken');
    if (token != null) {
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/Users/Verify",
            data: { userId: user.id },
            headers: { 'Authorization': token },
            success: function (result, status, response) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = "http://localhost:8080/index.html";
            },
            error: function (request, err) {
                //console.log(err);
            }
        });

    }
});


