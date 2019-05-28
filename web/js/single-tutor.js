var token = localStorage.getItem('accessToken');
var tutor = JSON.parse(localStorage.getItem('user'));
var tutorId = tutor.id;

var areaEdit = document.getElementById('area');
var subject = document.getElementById('subject');
var level = document.getElementById('level');
var curName;
var curImage;


var ajaxOpts = {
    url: '',
    headers: { 'Authorization': token },
    error: function (request, err) {
        console.log(err);
    }
}

$('document').ready(function () {
    getSubjects();
    getLevels();

    $(".file-upload").on('change', function () {
        previewPicture(this);
    });

    $(".upload-button").on('click', function () {
        $(".file-upload").click();
    });

    $('#image-submit').submit(function(e){
        e.preventDefault();
        console.log($(this[0]));
        addPhoto($(this[0]));
    });
});

function addNewModule(e) {
    e.preventDefault();

    var sub = $('#subject').find('option:selected');
    var lev = $('#level').find('option:selected');
    console.log(sub);

    if (sub.text() != "Choose Subject" && lev.text() != "Choose Level") {
        subId = parseInt(sub.attr('id').substr(3));
        levId = parseInt(lev.attr('id').substr(3));
        ajaxOpts.type = "POST";
        ajaxOpts.url = "http://localhost:8080/Info/Profile/Edit";
        ajaxOpts.data = { type: "module", tutorId: tutorId, subject: subId, level: levId };
        $.ajax(ajaxOpts).done(function (results) {
            $('#modules').append('<li id="mod' + results + '">' + sub.text() + "   -   " + lev.text() + '</li>');
        });
    }
}

function addNewQualif(e) {
    e.preventDefault();
    var newQualif = $('#qualif_text').val();
    console.log(newQualif);
    if (newQualif != "") {
        ajaxOpts.type = "POST";
        ajaxOpts.url = "http://localhost:8080/Info/Profile/Edit";
        ajaxOpts.data = { type: "qualif", tutorId: tutorId, newQualif: newQualif }
        $.ajax(ajaxOpts).done(function (results) {
            $('#qualifs').append('<li id="qual' + results + '">' + newQualif + '</li>');
        });
    }
}

function changeBio(e) {
    e.preventDefault();
    var newBio = $("#bio_text").val();

    if (newBio != "") {
        ajaxOpts.type = "POST";
        ajaxOpts.url = "http://localhost:8080/Info/Profile/Edit";
        ajaxOpts.data = { type: "desc", tutorId: tutorId, newDesc: newBio };
        $.ajax(ajaxOpts).done(function (results) {
            $('#about').html(newBio);
        });
    }
}

function changeArea(e) {
    e.preventDefault();
    var newArea = $('#area_text').val();
    if (newArea != null) {
        ajaxOpts.type = "POST";
        ajaxOpts.url = "http://localhost:8080/Info/Profile/Edit";
        ajaxOpts.data = { type: "area", tutorId: tutorId, newArea: newArea };
        $.ajax(ajaxOpts).done(function (results) {
            $('#area').text(newArea);
            var user = JSON.parse(localStorage.getItem('user'));
            user.area = newArea;
            localStorage.setItem('user', JSON.stringify(user));
        });
    }

}

function editName(e) {
    e.preventDefault();
    curName = $('#name').text();
    console.log(curName);
    $('#name').html("<input id='newName' type='text' value='" + curName + "'>");
    $('#opts').find('i').hide();
    $('#opts').append('<i class="fa fa-save ml-2" id="save" onclick="changeName(event);"></i>');
}

function previewPicture(input) {
    if (input.files && input.files[0]) {
        curImage = $('.profile-pic').attr('src');
        var reader = new FileReader();

        reader.onload = function (e) {
            $('.profile-pic').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
        $('.picture').mouseover(function () {
            $('.p-label').show();
        });
        $('.picture').mouseout(function () {
            $('.p-label').hide();
        });
    }
}


function changeName(e) {
    e.preventDefault();
    var newName = $('#newName').val();
    var newNameParts = newName.split(' ');
    if (newName != null && newName !== curName && newNameParts.length == 2) {
        ajaxOpts.type = "POST";
        ajaxOpts.url = "http://localhost:8080/Info/Profile/Edit";
        ajaxOpts.data = { type: "name", tutorId: tutorId, firstname: newNameParts[0], lastname: newNameParts[1] };
        $.ajax(ajaxOpts).done(function (results) {
            $('#name').html(newName);
            $('#opts').find('i').show();
            $('#save').remove();
            $.getScript('js/userbar.js');
            var user = JSON.parse(localStorage.getItem('user'));
            user.firstname = newNameParts[0];
            user.lastname = newNameParts[1];
            localStorage.setItem('user', JSON.stringify(user));
        });
    }
    else if (newName === curName) {
        $('#name').html(newName);
        $('#opts').find('i').show();
        $('#save').remove();
    }

}

function addPhoto(form) {
    console.log(form);
    var fd = new FormData();
    
    console.log(fd);
    var img_file = $('.file-upload')[0].files[0];
    //fd.append('img',JSON.stringify(form));
    //console.log(JSON.stringify(form));
    //img_file.fieldname="img";
    fd.append('img', img_file);
    console.log(img_file)
    ajaxOpts.type = "POST";
    ajaxOpts.url = "http://localhost:8080/Info/Upload/Picture";
    ajaxOpts.data = fd;
    ajaxOpts.contentType =false;
    ajaxOpts.processData = false;

    $.ajax(ajaxOpts).done(function (results) {
        $('.p-label').hide();
        $('profile-pic').attr('src', results);
        var user = JSON.parse(localStorage.getItem('user'));
        user.picture = results;
        localStorage.setItem('user', JSON.stringify(user));
        ajaxOpts.contentType = "application/x-www-form-urlencoded";
        ajaxOpts.processData = true;

    });

}

function getSubjects() {
    subject.innerHTML = '<option selected>Choose Subject</option>';
    ajaxOpts.type = "GET";
    ajaxOpts.url = "http://localhost:8080/Class/Subjects";
    $.ajax(ajaxOpts).done(function (results) {
        showSubjects(results);
    });
}

function getLevels() {
    level.innerHTML = '<option selected>Choose Level</option>';
    ajaxOpts.type = "GET";
    ajaxOpts.url = "http://localhost:8080/Class/Levels";
    $.ajax(ajaxOpts).done(function (results) {
        showLevels(results);
    });

}

function showSubjects(results) {
    for (var sub in results) {
        subject.innerHTML += '<option id="sub' + results[sub].id + '">' + results[sub].name + '</option>';
    }
}

function showLevels(results) {
    for (var lev in results) {
        level.innerHTML += '<option id="lev' + results[lev].id + '">' + results[lev].name + '</option>';
    }
}