$("#loginForm").submit(function (e) {
    e.preventDefault();

    var form = $(this);
    var url = form.attr('action');

    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(),
        success: function (data, status, response) {
            $user = data;
            var token = response.getResponseHeader('Authorization');
            window.localStorage.setItem('accessToken', 'token');
            storeUser(data);
        },
        error: function (request, error) {
            window.location.href = "http://localhost:8080/login.html"
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