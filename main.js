let NBA_TEAMS = [
	"Golden State Warriors",
	"Los Angeles Clippers",
	"Sacramento Kings",
	"Los Angeles Lakers",
	"Phoenix Suns",
	"Portland Trailblazers",
	"Denver Nuggets",
	"Oklahoma City Thunder",
	"Minnesota Timberwolves",
	"Utah Jazz",
	"Houston Rockets",
	"San Antonio Spurs",
	"New Orleans Pelicans",
	"Dallas Mavericks",
	"Memphis Grizzlies",
	"Toronto Raptors",
	"Boston Celtics",
	"New York Knicks",
	"Brooklyn Nets",
	"Philadelphia 76ers",
	"Milwuakee Bucks",
	"Detroit Pistons",
	"Chicago Bulls",
	"Cleveland Cavaliers",
	"Indiana Pacers",
	"Atlanta Hawks",
	"Miami Heat",
	"Washington Wizards",
	"Charlotte Hornets",
	"Orlando Magic"
];

$(document).ready(function() {
	$('#number_input').attr('placeholder', Math.floor(Math.random() * 36));
	$('#team_input').attr('placeholder', NBA_TEAMS[Math.floor(Math.random() * NBA_TEAMS.length)].split(' ').splice(-1)[0]);
	$('#team_input').autocomplete({
		source: function(req, response) {
		    var results = $.ui.autocomplete.filter(NBA_TEAMS, req.term);
		    response(results.slice(0, 3));
   		},
		delay: 100,
		select: function(event, ui) {
			event.preventDefault();
			document.getElementById('team_input').value = ui.item.value.split(' ').splice(-1)[0];
  			$.ajax({
  				url: `https://s3-us-west-1.amazonaws.com/nbajerseydata/${document.getElementById('team_input').value.slice(0, -1)}Jerseys.json`,
  				success: function(data) {
  					let json = JSON.parse(data);
  					let sameJerseys = json.filter((p) => {return p["JERSEY"] === $('#number_input').val().toString()});
  					for(let i = 0; i < sameJerseys.length; i += 3) {
  						$(document.body).append(`<div class="player-row" id=${i}></div>`);
  						for(let j = i; j < i + 3; j++) {
  							$(`#${i}`).append(`<div class='player-card'><img src='http://stats.nba.com/media/players/230x185/${sameJerseys[j]["ID"]}.png'/><br><span class='player-name'>${sameJerseys[j]["NAME"]}</span></div>`)
  						}
  					}
	  			}
  			})
		}
	})
});