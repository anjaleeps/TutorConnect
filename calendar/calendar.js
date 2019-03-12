$('document').ready(function () {
    const user = JSON.parse(window.localStorage.getItem('user'));
    const userid = user.getId();
    const userType = user.getType();
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/query.js",
        data: { action: 'getCalInfo', userid= userId, userType =userType },
        cache: false,
        success: function (events) {
            showEvents(JSON.parse(events));
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
});

function showEvents(events) {
    for (event in events) {

    }
}