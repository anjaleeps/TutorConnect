var old;

var $selectedLevel;
var $selectedLevelId;
var selectedSubject;
var resultList = document.getElementById('results');
var level = document.getElementById('level');
var subject = document.getElementById('subject');
var retrieved_levels={};
var retrieved_subjects={};
var tutors={};

$('document').ready(function () {
    var token = localStorage.getItem('accessToken');
    retrieved_levels = {};
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Info/Levels",
        headers: { 'Authorization': token },
        success: function (results, status, response) {
            showLevels(results);
        },
        error: function (request, error) {
            console.log(error);
        }
    });

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Info/Areas",
        headers: { 'Authorization': token },
        success: function (results, status, response) {
            showAreas(results);
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
        $selectedLevel = retrieved_levels[level];
        console.log(level);
        $selectedLevelId= $selectedLevel.id;
        //subjects = $selectedLevel.subjects;
        
        getSubjects();
    }
}

function getSubjects(){
    var token = localStorage.getItem('accessToken');
    retrieved_subjects = {};
    console.log(token);
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Info/Subjects",
        data: {levelId: $selectedLevelId},
        headers: { 'Authorization': token },
        success: function (results, status, response) {
            showSubjects(results);
        },
        error: function (request, error) {
            console.log(error);
        }
    });
}

function search() {
    var token = localStorage.getItem('accessToken');
    resultList.innerHTML = '';
    tutors = {};
    selectedSubject = $('#subject').find('option:selected').text();
    var selectedArea = $('#area').find('option:selected').text();

    if (selectedSubject != "Subject" && selectedArea!="Area") {
        $subjectId = retrieved_subjects[selectedSubject].id;

        $.ajax({
            type: "GET",
            url: "http://localhost:8080/Info/Tutors/Search",
            data: { area: selectedArea, subjectId: $subjectId, levelId: $selectedLevelId },
            headers: { 'Authorization': token },
            cache: false,
            success: function (results,status, response) {
                showResults(results);
            },
            error: function (request, err) {

                alert(err);
                console.log(err);
            }
        });
    }
}

function showResults(results) {

    if (results.length == 0) {
        resultList.innerHTML = '<div class="alert alert-warning" role="alert">0 search ressults found</div>'
    }
    
    for (var i = 0; i < results.length; i++) {
        //console.log(results[i]);
        var tutor = {
            id: results[i]._id,
            firstname: results[i]._firstname,
            lastname: results[i]._lastname,
            picture: results[i]._picture,
            rating: results[i]._rating,
            area: results[i]._area,
            type: results[i]._type
        }
        console.log(tutor);
        tutors[tutor.id] = tutor;
        var tmpl = document.getElementById('tutorcard').content.cloneNode(true);
        tmpl.querySelector('.tutor').id = "tutor" + tutor.id;
        tmpl.querySelector('.tutor').innerText = tutor.firstname + " " + tutor.lastname;
        tmpl.querySelector('.rating').innerHTML = getRating(tutor.rating);
        resultList.appendChild(tmpl);
    }
}

function showLevels(levels) {
    old = level.innerHTML;
    //console.log(levels);
    for (i = 0; i < levels.length; i++) {
        var new_level = {
            id: levels[i].id,
            name: levels[i].name
        }
        //console.log(new_level);
        retrieved_levels[new_level.name] = new_level;
        level.innerHTML += "<option>" + new_level.name + "</option>";
        //console.log(level.innerHTML);
    }
    //sessionStorage.setItem("chose_level", JSON.stringify(retrieved_levels));

}

function showSubjects(subjects) {
    for (var key in subjects) {
        var new_subject = {
            id: subjects[key].id,
            name: subjects[key].name
        }
        retrieved_subjects[new_subject.name]=new_subject;
        //console.log(key);
        subject.innerHTML += "<option>" + new_subject.name + "</option>";
    }
}

function showAreas(areas) {
    for (i=0; i< areas.length; i++) {
        area.innerHTML += "<option>" + areas[i].area+ "</option>";
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

function setProfile(e) {
    
    console.log('reached');
    console.log($(e).attr('id'));
    var id = parseInt(($(e).attr('id')).substr(5));
    localStorage.setItem('profile', JSON.stringify(tutors[id]));
    window.location.href = "http://localhost:8080/single.html";

}

