$(document).ready(function(){
	$('.more, .card-title a').on('click', function(e){
		e.preventDefault();
		$('section .container-fluid').load('detail.html');
	});
});

$(window).on('load',function(){
	$('.grid').masonry({
	  itemSelector: '.grid-item'
	});
});
