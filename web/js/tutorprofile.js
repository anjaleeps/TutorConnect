var comment_temp = document.getElementById('comment_temp');
var comment_list = document.getElementById('comments');

var $tutor;
var $user;
var $session;
var $tutorId;
var $userId;
var commentCount=0;
var options= {day:'2-digit', year:'numeric', month:'2-digit'};

$('document').ready(function () {

    var token = localStorage.getItem('accessToken');
    $tutor = JSON.parse(localStorage.getItem('profile'));
    $session = JSON.parse(localStorage.getItem('user'));
    if ($tutor === null) {
        $tutor = $session;
    }
    $tutorId = $tutor.id;

    if ($tutor.id == $session.id) {
        $("#post").hide();
    }
    //console.log($tutorId);

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Info/Tutor/Profile",
        data: { tutorId: $tutorId },
        headers: { 'Authorization': token },
        cache: false,
        success: function (results, status, response) {
            setProfile(results);
        },
        error: function (request, err) {
            console.log(err);
        }
    });


});


function showProfile(profile) {
    
    if ($tutor.picture){
        $('#image').attr('src', $tutor.picture);
    }
    
    if (profile.description) {
        $('#about').html(profile.description);
        $('#about').show();
    }
    for (i = 0; i < (profile.qualifs).length; i++) {
        $('#qualifs').append('<li id="qual'+profile.qualifs[i].id+'">' + profile.qualifs[i].qualification + '</li>');
    }
    for (j=0; j< (profile.comments).length; j++){
        addComment(profile.comments[j]);
    }
    for (i = 0; i < (profile.modules).length; i++) {
        $('#modules').append('<li id="mod'+profile.modules[i].id+'">' + profile.modules[i].subject + "   -   " + profile.modules[i].level + '</li>');
    }
    $('#area').text($tutor.area);
    console.log(profile.rating);
    $('#rating').html(getRating(profile.rating));
    $('#rated').html('('+profile.rated+')');
}

function setProfile(results) {
    var profile = {
        id: results._id,
        description: results._description,
        qualifs: results._qualifs,
        comments: results._comments,
        videos: results._videos,
        modules: results._modules,
        rated:results._rated,
        rating:results._rating
    }
    console.log(profile);

    //sessionStorage.setItem('profile', JSON.stringify($tutor));
    showProfile(profile);
}

function addComment(comment){
    newCom = comment_temp.content.cloneNode(true);
    newCom.querySelector('.comment').id="com"+commentCount;
    newCom.querySelector('.commenter').innerHTML=comment.student;
    newCom.querySelector('.date').innerHTML=comment.time;
    newCom.querySelector('.content').innerHTML=comment.content;
    comment_list.prepend(newCom);
    commentCount+=1;
}

function getRating(rating) {

    // Round to nearest half
    rating = Math.round(rating * 2) / 2;
    let output = [];

    // Append all the filled whole stars
    for (var i = rating; i >= 1; i--)
        output.push('<i class="fa fa-star" aria-hidden="true" style="color: gold;"></i>&nbsp;');

    // If there is a half a star, append it
    if (i == .5) output.push('<i class="fa fa-star-half-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');

    // Fill the empty stars
    for (let i = (5 - rating); i >= 1; i--)
        output.push('<i class="fa fa-star-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');
    //console.log(output);
    return output.join('');

}

$('#requestContact').on('click', function (e) {
    e.preventDefault();

    var token = localStorage.getItem('accessToken');
    if (token != null) {
        if ($session.type === 1) {
            $tutorId = $tutor.id;
            $studentId = $session.id;
            //console.log($tutorId +$studentId);
            $.ajax({
                type: "GET",
                url: "http://localhost:8080/Info/Tutor/Contact",
                data: { tutorId: $tutorId, studentId: $studentId },
                headers: { 'Authorization': token },
                cache: false,
                success: function (result, status, response) {
                    $('#requestContact').text("Contact No: " + result.contactNum);
                },
                error: function (request, err) {
                    console.log(err);
                }
            });
        } else { alert('Only the students can make the request'); }
    }
    else {
        window.location.href = "http://localhost:8080/studentSignin.html";
    }
});

