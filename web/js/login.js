$("#loginForm").submit(function (e) {
    e.preventDefault();

    var $form = $(this);
    console.log($form.serialize());

    $.ajax({
        type: "POST",
        url: "http://localhost:8080/Users/Login",
        data: {form: $form.serialize()},
        success: function (data, status, response) {
            $user = data;
            var token = response.getResponseHeader('Authorization');
            window.localStorage.setItem('accessToken', token);
            storeUser(JSON.parse(data));
            window.location.href= "http://localhost:8080/index.html";
        },
        error: function (request, error) {
            window.location.href = "#";
            alert(error);
        }
    });
});

function storeUser(data) {
    console.log(data);
    if (data._type == 2) {
        var user = {
            id: data._id,
            firstname: data._firstname,
            lastname: data._lastname,
            area: data._area,
            rating: data._rating,
            picture: data._picture,
            type: data._type
        }
    }
    else if (data._type == 1) {
        var user = {
            id: data._id,
            firstname: data._firstname,
            lastname: data._lastname,
            picture: data._picture,
            type: data._type
        }
    }
    localStorage.setItem('user', JSON.stringify(user));
}