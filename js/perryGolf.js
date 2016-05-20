$(document).ready(function() {
	
	$('[data-toggle="tooltip"]').tooltip()
	$("#mapModal").on("shown.bs.modal", function() {
		initialize();
	});
	
	$("#js-geolocationButton").on("click", function(e) {
		e.preventDefault();
		geolocateUser();
	});

	$("#calculate-route").on("submit", function(event) {
		event.preventDefault();
		$("#directions-panel").removeClass("hidden");
		calcRoute($("#startingAddress").val(), "1921 Evelyn St, 50220");
	});
	
	$("#calculate-route").on("reset", function(event) {
		initialize();
		$("#directions-panel").addClass("hidden");
	});
	
	$(".js-modalClose").on("click", function(event) {
		$("#resetButton").trigger("click");
	});
	
	$("#directionsButton").on("click", function(event) {
		$("#directionsTrigger").trigger("click");
	});	
});

var directionsDisplay;

function initialize(){

	$("#startingAddressGroup").removeClass("has-warning");
	$("#locationError").addClass("hidden");

	if(navigator.geolocation) {
		$("#js-geolocationButton").removeClass("disabled");
	} else {
		// Browser doesn't support Geolocation, disable the button
		$("#js-geolocationButton").addClass("disabled");
	}
	var myLatLng = new google.maps.LatLng(41.836015, -94.094872);
	if(directionsDisplay) {
		directionsDisplay.setMap(null);
		directionsDisplay.setPanel(null);
	}
	directionsDisplay = new google.maps.DirectionsRenderer();
	var mapOptions = {
		zoom: 15,
		center: myLatLng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  
	var marker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		title: "Molly Painter Photography",
	});

	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById('directions-panel'));
		
}

function calcRoute(start, end) {

	var directionsService = new google.maps.DirectionsService();
    var request = {
		origin: start,
		destination: end,
		travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
	if (status == google.maps.DirectionsStatus.OK) {
		directionsDisplay.setDirections(response);
	}
  });
}

function geolocateUser() {
// If the browser supports the Geolocation API
	if (navigator.geolocation)
	{
	  var positionOptions = {
		enableHighAccuracy: true,
		timeout: 10 * 1000 // 10 seconds
	  };
	  navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, positionOptions);
	}
}

function geolocationSuccess(position) {
	var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	writeAddressName(userLatLng);
}

function writeAddressName(latLng) {
	var geocoder = new google.maps.Geocoder();
		geocoder.geocode({
		  "location": latLng
	},
	function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			$("#startingAddress").val(results[0].formatted_address);
			$("#startingAddressGroup").addClass("has-warning");
			$("#locationError").removeClass("hidden");
		} else {
			$("#startingAddressGroup").removeClass("has-warning");
			$("#locationError").addClass("hidden");
			alert("Location could not be found automatically");
		}
	});
}

function geolocationError(positionError) {
	return;
}