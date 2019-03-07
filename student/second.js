
function search() {
    $.ajax({
        type: "GET",
        url: "localhost:8080",
        data: { action: 'search_tutors', homeTown: $('#homeTown').val() },
        cache: false,
        success: function (results) {
            showResults(results);
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

function showResults() {
    
}