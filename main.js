var urls = {'T1': 'index.html', 'T2': 'http://www.espn.go.com', 
			'T3': 'http://sports.yahoo.com/', 'T4': 'http://grantland.com/', 'T5': 'http://www.foxsports.com/'};

var username = 'You_Are_A_Scallywag';

$(document).ready(function() {
	$('.hiddentab').hover(function() {
		$('#'+$(this).attr('id')).animate(
			{
				height: '100%'
			}, 300);
	}, function() {	
		$('#'+$(this).attr('id')).animate(
			{
				height: '0%'
			}, 300);
	});

	
	$('.hiddentab').click(function() {
		var url = urls[$(this).attr('id')];
		if(url.endsWith('.html')) {
			window.open(url, '_self');
		} else {
			window.open(url, '_blank');
		};
	});
	
	$('#lefthome').animate(
		{
			left: '+=45%'
		}, 1000
	);
	
	$('#leftlarge').animate(
		{
			left: '+=45%'
		}, 1000
	);
	
	$('#rightlarge').animate(
		{
			left: '-=40%'
		}, 1000
	);
	
	$('#righthome').animate(
		{
			left: '-=40%'
		}, 1000
	);
	
	$('.userinfo').text('Signed in as ' + username);
	$('.userinfo').click(function() {
		var url = 'https://www.reddit.com/u/'+username;
		window.open(url, '_blank');
	});
	
});