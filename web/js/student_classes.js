var clz_list = document.getElementById('classes_list');
var tmpl = document.getElementById('classes_temp');
var endedtmpl = document.getElementById('ended_classes_temp');
var ended_clz_list = document.getElementById('ended_classes_list');

var $session;
var $sessionId;
var $rateTutor;
var $commentTutor;
var classes = [];
var endedClasses = [];
var mods;
var newClz;
var endedClz;
var endedClzCount = 0;
var __slice = [].slice;


$('document').ready(function () {
    var token = localStorage.getItem('accessToken');
    $session = JSON.parse(localStorage.getItem('user'));
    $sessionId = $session.id;

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Class/Ended",
        data: { userId: $sessionId },
        headers: { 'Authorization': token },
        cache: false,
        success: function (results, status, response) {
            console.log(results);
            showEndedClasses(results);
        },
        error: function (request, err) {
            console.log(err);
        }
    });

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/Class/Classes",
        data: { userId: $sessionId },
        headers: { 'Authorization': token },
        cache: false,
        success: function (results, status, response) {
            showClasses(results);
        },
        error: function (request, err) {
            console.log(err);
        }
    });

});

function showClasses(results) {
    if (results.length > 0) {
        $('#started_classes_title').text("Ongoing Classes");
    }
    for (i = 0; i < results.length; i++) {
        var clz = results[i];
        addClass(clz, i);
        classes.push(clz);
    }
}

function addClass(clz, i) {
    console.log(clz);
    newClz = tmpl.content.cloneNode(true);
    newClz.querySelector('.clz').id = "class" + i;
    newClz.querySelector('.name').innerText = "By " + clz.tutorName + " on " + clz.day;
    newClz.querySelector('.level').innerText = "Level: " + clz.level;
    newClz.querySelector('.subject').innerText = "Subject: " + clz.subject;
    newClz.querySelector('.from').innerText = "From: " + clz.starttime;
    newClz.querySelector('.to').innerText = "To: " + clz.endtime;
    clz_list.appendChild(newClz);
}

function showEndedClasses(results) {
    if (results.length > 0) {
        $('#ended_classes_title').text("Recently Ended Classes");
    }
    for (i = 0; i < results.length; i++) {
        var clz = results[i];
        addEndedClass(clz);
        endedClasses.push(clz);
    }
}

function addEndedClass(clz) {
    endedClz = endedtmpl.content.cloneNode(true);
    endedClz.querySelector('.endedclz').id = "endedclass" + clz.tutorId;
    endedClz.querySelector('.name').innerText = "By " + clz.tutorName;
    endedClz.querySelector('.level').innerText = "Level: " + clz.level;
    endedClz.querySelector('.subject').innerText = "Subject: " + clz.subject;
    ended_clz_list.appendChild(endedClz);
}

function setRateTutor(e) {
    var $par = $(e).parent().parent().parent();
    console.log($par);
    $rateTutor = parseInt(($par.attr('id')).substr(10));
}

function setCommentTutor(e) {
    var $par = $(e).parent().parent().parent();
    console.log($par);
    $commentTutor = parseInt(($par.attr('id')).substr(10));
}

function comment(e) {
    e.preventDefault();
    if ($session.type == 1) {
        var content = $('#new_comment').val();
        if (content != "") {
            var $newComment = {
                studentId: $session.id,
                content: content
            }

            var token = localStorage.getItem('accessToken');
            $.ajax({
                type: "POST",
                url: "http://localhost:8080/Class/Post/Comment",
                data: { tutorId: $commentTutor, newComment: JSON.stringify($newComment) },
                headers: { 'Authorization': token },
                cache: false,
                success: function (result, status, response) {
                },
                error: function (request, err) {
                    console.log(err);
                }
            });

        }

    }
}

var tutorrating;
(function ($, window) {
    var Starrr;

    Starrr = (function () {
        Starrr.prototype.defaults = {
            rating: void 0,
            numStars: 5,
            change: function (e, value) { }
        };

        function Starrr($el, options) {
            var i, _, _ref,
                _this = this;

            this.options = $.extend({}, this.defaults, options);
            this.$el = $el;
            _ref = this.defaults;
            for (i in _ref) {
                _ = _ref[i];
                if (this.$el.data(i) != null) {
                    this.options[i] = this.$el.data(i);
                }
            }
            this.createStars();
            this.syncRating();
            this.$el.on('mouseover.starrr', 'i', function (e) {
                return _this.syncRating(_this.$el.find('i').index(e.currentTarget) + 1);
            });
            this.$el.on('mouseout.starrr', function () {
                return _this.syncRating();
            });
            this.$el.on('click.starrr', 'i', function (e) {
                return _this.setRating(_this.$el.find('i').index(e.currentTarget) + 1);
            });
            this.$el.on('starrr:change', this.options.change);
        }

        Starrr.prototype.createStars = function () {
            var _i, _ref, _results;

            _results = [];
            for (_i = 1, _ref = this.options.numStars; 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--) {
                _results.push(this.$el.append("<i class='fa fa-star-o'></i>"));
            }
            return _results;
        };

        Starrr.prototype.setRating = function (rating) {
            if (this.options.rating === rating) {
                rating = void 0;
            }
            this.options.rating = rating;
            tutorrating = rating;
            this.syncRating();
            return this.$el.trigger('starrr:change', rating);
        };

        Starrr.prototype.getRating = function () {
            return this.options.rating;
        }

        Starrr.prototype.syncRating = function (rating) {
            var i, _i, _j, _ref;

            rating || (rating = this.options.rating);
            if (rating) {
                for (i = _i = 0, _ref = rating - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
                    this.$el.find('i').eq(i).removeClass('fa-star-o').addClass('fa-star');
                }
            }
            if (rating && rating < 5) {
                for (i = _j = rating; rating <= 4 ? _j <= 4 : _j >= 4; i = rating <= 4 ? ++_j : --_j) {
                    this.$el.find('i').eq(i).removeClass('fa-star').addClass('fa-star-o');
                }
            }
            if (!rating) {
                return this.$el.find('i').removeClass('fa-star').addClass('fa-star-o');
            }
        };

        return Starrr;

    })();
    return $.fn.extend({
        starrr: function () {
            var args, option;

            option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            return this.each(function () {
                var data;

                data = $(this).data('star-rating');
                if (!data) {
                    $(this).data('star-rating', (data = new Starrr($(this), option)));
                }
                if (typeof option === 'string') {
                    return data[option].apply(data, args);
                }
            });
        }
    });
})(window.jQuery, window);

$(function () {
    return $(".starrr").starrr();
});

function rate(e) {
    e.preventDefault();
    if ($session.type == 1) {

        var token = localStorage.getItem('accessToken');
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/Class/Post/Rating",
            data: { tutorId: $rateTutor, studentId: $session.id, rating: tutorrating},
            headers: { 'Authorization': token },
            cache: false,
            success: function (result, status, response) {
            },
            error: function (request, err) {
                console.log(err);
            }
        });

    }

}







