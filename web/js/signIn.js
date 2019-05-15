var user_type;
var signInform = document.getElementsByClassName('signIn')[0];
var options = document.getElementsByClassName('options')[0];

function getType(type) {
    user_type = type;
    options.setAttribute('style', 'display:none');
    signInform.setAttribute('style', 'visibility:visible;');
}

$("#signinForm").submit(function (e) {
    e.preventDefault(); 

    var form = $(this);
    var url = form.attr('action');

    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(), 
        success: function (data, status, response) {
            var token = response.getResponseHeader('Authorization');
            window.localStorage.setItem('accessToken', token);
            storeUser(data);
        },
        error: function (request, error) {
            window.location.href = "http://localhost:8080/signIn.html"
            alert(error);
        }
    });

});

function storeUser(data) {
    var user = {
        id: data.id,
        firstname: data.firstname,
        lastname: data.lastname,
        area: data.area,
        rating: data.rating,
        picture: data.picture,
        type: data.type
    }
    localStorage.setItem('user', JSON.stringify(user));
}