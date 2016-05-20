$(document).ready(function(){
	$("#slideshow > div:gt(0)").hide();

	setInterval(function() { 
		$('#slideshow > div:first')
		.fadeOut(750)
		.next()
		.fadeIn(750)
		.end()
		.appendTo('#slideshow');
	},  5000);
});