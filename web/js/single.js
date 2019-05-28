/* JS Document */

/******************************

[Table of Contents]

1. Vars and Inits
2. Set Header
3. Init Menu
4. Init SVG
5. Init Video
6. Init Google Map


******************************/

var $user;
var $profile;
var token;

$(document).ready(function () {
	"use strict";

	/* 

	1. Vars and Inits

	*/

	$user = JSON.parse(localStorage.getItem('user'));
	$profile= JSON.parse(localStorage.getItem('profile'));
	
	token = localStorage.getItem('accessToken');
	if ($profile === null) {
		$profile=$user;
    }
	$('#name').text($profile.firstname + " " + $profile.lastname);

	var header = $('.header');
	var map;

	initMenu();
	initSvg();
	initVideo();


	setHeader();

	$(window).on('resize', function () {
		setHeader();

		setTimeout(function () {
			$(window).trigger('resize.px.parallax');
		}, 375);
	});

	$(document).on('scroll', function () {
		setHeader();
	});

    if ($profile.type == 2){
	   $('#profile').show();
	   $('#requests').show();
	}

	/* 

	2. Set Header

	*/

	function setHeader() {
		if ($(window).scrollTop() > 91) {
			header.addClass('scrolled');
		}
		else {
			header.removeClass('scrolled');
		}
	}

	/* 

	3. Init Menu

	*/

	function initMenu() {
		if ($('.menu').length && $('.hamburger').length) {
			var menu = $('.menu');
			var hamburger = $('.hamburger');
			var close = $('.menu_close');
			var superOverlay = $('.super_overlay');

			hamburger.on('click', function () {
				menu.toggleClass('active');
				superOverlay.toggleClass('active');
			});

			close.on('click', function () {
				menu.toggleClass('active');
				superOverlay.toggleClass('active');
			});

			superOverlay.on('click', function () {
				menu.toggleClass('active');
				superOverlay.toggleClass('active');
			});
		}
	}

	/* 

	4. Init SVG

	*/

	function initSvg() {
		if ($('img.svg').length) {
			jQuery('img.svg').each(function () {
				var $img = jQuery(this);
				var imgID = $img.attr('id');
				var imgClass = $img.attr('class');
				var imgURL = $img.attr('src');

				jQuery.get(imgURL, function (data) {
					// Get the SVG tag, ignore the rest
					var $svg = jQuery(data).find('svg');

					// Add replaced image's ID to the new SVG
					if (typeof imgID !== 'undefined') {
						$svg = $svg.attr('id', imgID);
					}
					// Add replaced image's classes to the new SVG
					if (typeof imgClass !== 'undefined') {
						$svg = $svg.attr('class', imgClass + ' replaced-svg');
					}

					// Remove any invalid XML tags as per http://validator.w3.org
					$svg = $svg.removeAttr('xmlns:a');

					// Replace image with new SVG
					$img.replaceWith($svg);
				}, 'xml');
			});
		}
	}

	/* 

	5. Init Video

	*/

	function initVideo() {
		$(".youtube").colorbox(
			{
				iframe: true,
				innerWidth: 640,
				innerHeight: 409,
				maxWidth: '90%'
			});
	}

	/* 

	6. Init Google Map

	*/

	function initGoogleMap() {
		var myLatlng = new google.maps.LatLng(40.760836, -73.910357);
		var mapOptions =
		{
			center: myLatlng,
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			draggable: true,
			scrollwheel: false,
			zoomControl: true,
			zoomControlOptions:
			{
				position: google.maps.ControlPosition.RIGHT_CENTER
			},
			mapTypeControl: false,
			scaleControl: false,
			streetViewControl: false,
			rotateControl: false,
			fullscreenControl: true,
			styles:
				[
					{
						"featureType": "road.highway",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"color": "#ffeba1"
							}
						]
					}
				]
		}

		// Initialize a map with options
		map = new google.maps.Map(document.getElementById('map'), mapOptions);

		// Re-center map after window resize
		google.maps.event.addDomListener(window, 'resize', function () {
			setTimeout(function () {
				google.maps.event.trigger(map, "resize");
				map.setCenter(myLatlng);
			}, 1400);
		});
	}

});

$('#requests').on('click', function (e) {
	e.preventDefault();
	
	if ($user !== null && token !== null) {
		$.ajax({
			type: "GET",
			url: "http://localhost:8080/Users/Verify",
			data: { userId: $profile.id },
			headers: { 'Authorization': token },
			success: function (result, status, response) {
				window.location.href="http://localhost:8080/requests.html";
			},
			error: function (request, err) {
				//console.log(err);
			}
		});
	}
});

$('#classes').on('click', function (e) {
	e.preventDefault();
	
	if ($user !== null && token !== null ) {
		$.ajax({
			type: "GET",
			url: "http://localhost:8080/Users/Verify",
			data: { userId: $profile.id },
			headers: { 'Authorization': token },
			success: function (result, status, response) {
				if ($user.type==2){
					window.location.href="http://localhost:8080/classes.html";
				}else if ($user.type==1){
					window.location.href="http://localhost:8080/student_classes.html";
				}
			},
			error: function (request, err) {
				//console.log(err);
			}
		});
	}
});

$('#profile').on('click', function (e) {
	e.preventDefault();
	$user = JSON.parse(localStorage.getItem('user'));
	$profile= JSON.parse(localStorage.getItem('profile'));
	
	token = localStorage.getItem('accessToken');
	if ($profile === null) {
		$profile=$user;
    }
	
	if ($user.id=== $profile.id && $user.type==2){
		window.location.href="http://localhost:8080/single-tutor.html";
	}else{
		window.location.href="http://localhost:8080/single.html";
	}
});
