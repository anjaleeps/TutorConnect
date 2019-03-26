var old;
var $level;
var $subject;

$('document').ready(choselevel());

function search() {
    document.getElementById('results').innerHTML = '';
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/query.js",
        data: { action: 'searchTutors', homeTown: $('#area').val(), subject: $subject, level: $level },
        cache: false,
        success: function (results) {
            showResults("tutor", results);
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
function show(type, results) {
	option = document.getElementById(type);
    old = option.innerHTML;
	if(type=='level'){
	   for (i = 0; i < results.length; i++) {
		   option.innerHTML += "<option>" + results[i].level_name ;
		   }
    }
	else if(type=='subject'){
        
		   for (i = 0; i < results.length; i++) {
			   option.innerHTML += "<option>" + results[i].subject_name ;
			   }
	    }
}

function choselevel() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/query.js",
        data: { action: 'searchlevel' },
        cache: false,
        success: function (results) {
            show('level', results);
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

function getlevel() {
    document.getElementById('subject').innerHTML = '<option selected>Subject</option>';
    $level = $('#level').find('option:selected').text();

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/query.js",
        data: { action: 'searchsubject', category: $level },
        cache: false,
        success: function (results) {
            show('subject', results);

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

    document.getElementById("search_form").setAttribute('style', 'visibility:visible;');
}

function getsubject() {
    $subject = $('#subject').find('option:selected').text();

}

function chosesubject() {

}

function showResults(type, results) {
     
    var resultList = document.getElementById('results');
    if (results.length == 0) {
        resultList.innerHTML = '<div class="alert alert-warning" role="alert">0 search ressults found</div>'
    }
    // Loop through each of the comments and add them to the comments list.
    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        var tmpl = document.getElementById('tutorcard').content.cloneNode(true);
        tmpl.querySelector('.tutor').innerText = result.firstname + " " + result.lastname;
        tmpl.querySelector('.rating').innerHTML = getRating(result.rating);
        resultList.appendChild(tmpl);
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

