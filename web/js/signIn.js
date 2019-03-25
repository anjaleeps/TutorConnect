var $firstname = $('#firstname').val();
var $lastname = $('#lastname').val();
var $password = $('#password').val();
var $area = $('#area').val();
function signIn() {
    const $firstname = $('#firstname').val();
    console.log($firstname);
    if ($timeslot != 'Choose Time Slot') {
        $.ajax({
            type: "POST",
            url: "http://localhost:8080",
            data: { action: 'signIn', firstname: $firstname, lastname:$lastname },
            cache: false,
            success: function () {
                reset();
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
    /*document.getElementById('remove').setAttribute('style', 'display:none;');*/
    /*option.innerHTML = old;*/

    return false;
}

