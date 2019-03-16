function goToProfile(){
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/query.js",
        data: {action: 'goToProfile', firstname: $('[name=firstname]').val()},
        cache: false,
        success: function (results) {
            showResults(results);
            console.log("t");
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

function showResults(results) {
    
}
