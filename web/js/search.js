var old;
var $level;
var $subject;

$('document').ready(choselevel());

function search() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/query.js",
        data: { action: 'searchTutors', homeTown: $('#area').val(), subject: $subject, level: $level },
        cache: false,
        document: document.getElementById('results').innerHTML=" ",
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
		   option.innerHTML += "<option>" + results[i].categoryname ;
		   }
    }
	else if(type=='subject'){
        option.innerHTML += "<option>" + "subject" ;
		   for (i = 0; i < results.length; i++) {
			   option.innerHTML += "<option>" + results[i].sName ;
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
    $level = $('#level').find('option:selected').text();

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/query.js",
        data: { action: 'searchsubject', category: $level },
        cache: false,
        document: document.getElementById('subject').innerHTML="subject",
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

