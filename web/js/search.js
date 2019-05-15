var old;

var levels;
var subjects;
var $selectedLevel;
var selectedSubject;
var resultList = document.getElementById('results');
var level = document.getElementById('level');
var subject = document.getElementById('subject');
var retrieved_levels;
var tutors;

$('document').ready(function () {
    var token = localStorage.getItem('accessToken');
    console.log(token);
    retrieved_levels = {};
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Info/Levels",
        headers: { 'Authorization': token },
        success: function (results) {
            var token = response.getResponseHeader('Authorization');
            window.localStorage.setItem('accessToken', token);
            levels = results;
            showLevels();
        },
        error: function (request, error) {
            console.log(error);
        }
    });
});

function onLevelChange() {
    subject.innerHTML = '<option selected>Subject</option>';
    level = $('#level').find('option:selected').text();
    if (level != "Level") {
        $selectedLevel = retrieved_level[level];
        subjects = $selectedLevel.subjects;
        showSubjects;
    }
}

function search() {
    var token = localStorage.getItem('accessToken');
    resultList.innerHTML = '';
    tutors = {};
    selectedSubject = $('#subject').find('option:selected').text();
    if (selectedSubject != "Subject") {
        $subject = $selectedLevel.subjects[selectedSubject];

        $.ajax({
            type: "GET",
            url: "http://localhost:8080/Info/Tutors/Search",
            data: { area: $('#area').val(), subject: $subject, level: $selectedLevel },
            headers: { 'Authorization': token },
            cache: false,
            success: function (results) {
                var token = response.getResponseHeader('Authorization');
                window.localStorage.setItem('accessToken', token);
                showResults(results);
            },
            error: function (request, err) {

                alert(err);
                console.log(err);
            }
        });
    }
}

function showResults(type, results) {

    if (results.length == 0) {
        resultList.innerHTML = '<div class="alert alert-warning" role="alert">0 search ressults found</div>'
    }
    // Loop through each of the comments and add them to the comments list.
    for (var i = 0; i < results.length; i++) {
        var tutor = {
            id: results[i].id,
            firstname: results[i].firstname,
            lastname: results[i].lastname,
            picture: results[i].picture,
            rating: results[i].rating,
            area: results[i].area
        }
        tutors[tutor.id] = tutor;
        var tmpl = document.getElementById('tutorcard').content.cloneNode(true);
        tmpl.id = "tutor" + tutor.id;
        tmpl.querySelector('.tutor').innerText = tutor.firstname + " " + tutor.lastname;
        tmpl.querySelector('.rating').innerHTML = getRating(tutor.rating);
        resultList.appendChild(tmpl);
    }
}

function showLevels() {
    old = level.innerHTML;
    for (i = 0; i < levels.length; i++) {
        var new_level = {
            id: levels[i].id,
            name: levels[i].name,
            subjects: levels[i].subjects
        }
        retrieved_levels[new_level.name] = new_level;
        level.innerHTML += "<option>" + new_level.level_name + "<option>";
    }
    sessionStorage.setItem("chose_level", JSON.Stringify(retrieved_levels));

}

function showSubjects() {
    for (var key in subjects) {
        level.innerHTML += "<option>" + key + "<option>";
    }
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

    return output.join('');

}

('#profile').onClick(function (e) {
    var id = parseInt((this.id).substr(5));
    sessionStorage.setItem('profile', JSON.stringify(tutors[id]));
    window.location.href = "http://localhost:8080/single.html";

});

