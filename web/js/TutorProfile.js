

var name = document.getElementById('name');
var about = document.getElementById('about');
var image = document.getElementById('image');
var area = document.getElementById('area');
var qualifs = document.getElementById('qualifs');
var comments = document.getElementById('comments');
var rating = document.getElementById('rating');

var $tutor;
var $session;
var $tutorId;
var $sessionId;

$('document').ready(function () {
    var token = localStorage.getItem('accessToken');
    $tutor = JSON.parse(sessionStorage.getItem('profile'));
    $tutorId = $tutor.id;

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Info/Tutor/Profile",
        data: { tutorId: $tutorId },
        headers: { 'Authorization': token },
        cache: false,
        success: function (results, status, response) {
            var token = response.getResponseHeader('Authorization');
            window.localStorage.setItem('accessToken', token);
            setProfile(results);
        },
        error: function (request, err) {
            console.log(err);
        }
    });
});

function showProfile(profile) {

    name.innerHTML = $tutor.firstname + " " + $tutor.lastname;
    image.setAttribute('src', profile.picture);
    about.innerHTML = '<p>' + profile.decription + '</p>';
    for (i = 0; i < (profile.qualifs).length; i++) {
        qualifs.innerHTML += '<p>' + profile.qualifs[i] + '</p>';
    }
    area.innerHTML = 'Teaches around' + $tutor.area;
    rating.innerHTML = getRating($totor.rating);
}

function setProfile(results) {
    var profile = {
        id: results.id,
        description: results.description,
        comments: results.qualifs,
        videos: results.comments,
        videos: results.videos,
        modules: results.modules
    }
   
    sessionStorage.setItem('profile', JSON.stringify($tutor));
    showProfile(profile);
}

function getRating(rate) {

    // Round to nearest half
    rate = Math.round(rating * 2) / 2;
    let output = [];

    // Append all the filled whole stars
    for (var i = rate; i >= 1; i--)
        output.push('<i class="fa fa-star" aria-hidden="true" style="color: gold;"></i>&nbsp;');

    // If there is a half a star, append it
    if (i == .5) output.push('<i class="fa fa-star-half-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');

    // Fill the empty stars
    for (let i = (5 - rating); i >= 1; i--)
        output.push('<i class="fa fa-star-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');

    return output.join('');

}

('#requestContact').onClick(function (e) {
    var token = localStorage.getItem('accessToken');
    if (token != null) {
        $session = JSON.parse(localStorage.getItem('user'));
        if ($session.type === 1) {
            $tutor = JSON.parse(sessionStorage.getItem('profile'));
            $tutorId = $tutor.id;
            $studentId = $session.id;
            $.ajax({
                type: "GET",
                url: "http://localhost:8080/Info/Tutor/Contact",
                data: { tutorId: $tutorId, studentId: $studentId },
                headers: { 'Authorization': token },
                cache: false,
                success: function (results, status, response) {
                    var token = response.getResponseHeader('Authorization');
                    window.localStorage.setItem('accessToken', token);
                    //setProfile(results);
                },
                error: function (request, err) {
                    console.log(err);
                }
            });
        } else { alert('Only the students can make the request'); }
    }
    else {
        window.location.href = "http://localhost:8080/signin.html";
    }
});