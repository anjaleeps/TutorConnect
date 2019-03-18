var old;
var $level;
var $subject;

$('document').ready(choselevel());

function search() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/query.js",
        data: { action: 'searchTutors', homeTown: $('[name=homeTown]').val(), subject: $subject, level: $level},
        cache: false,
        success: function (results) {
        	alert(results);
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
        data: { action: 'searchsubject', category: $level},
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
    alert(results);
 
    // Loop through each of the comments and add them to the comments list.
    for (var i = 0; i < results.length; i++) {
      var result = results[i];
      var tmpl = document.getElementById('tutordetails').content.cloneNode(true);
      tmpl.querySelector('.card-header').innerText = result.firstname + " "+ result.lastname;
      tmpl.querySelector('.card-title').innerText = result.rating;
      commentsList.appendChild(tmpl);
    }  
    
}

