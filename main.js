const NBA_TEAMS = ["Golden State Warriors","Los Angeles Clippers","Sacramento Kings","Los Angeles Lakers","Phoenix Suns","Portland Trailblazers","Denver Nuggets","Oklahoma City Thunder","Minnesota Timberwolves","Utah Jazz","Houston Rockets","San Antonio Spurs","New Orleans Pelicans","Dallas Mavericks","Memphis Grizzlies","Toronto Raptors","Boston Celtics","New York Knicks","Brooklyn Nets","Philadelphia 76ers","Milwuakee Bucks","Detroit Pistons","Chicago Bulls","Cleveland Cavaliers","Indiana Pacers","Atlanta Hawks","Miami Heat","Washington Wizards","Charlotte Hornets","Orlando Magic"];
const SPECIAL_CHOICES = ['*', '.', '', 'ALL', 'ANY'];
const SORT_TYPES = ['PPG', 'APG', 'RPG', 'SPG', 'BPG', 'Seasons Played'];

function loadPlayerData(team, num) {
	$('.player-card').remove();
	players_created = [];
	$('#loader').attr('style', 'display: inline-block');
	let choice = team.split(' ').splice(-1)[0];
	$.ajax({
		url: `https://s3-us-west-1.amazonaws.com/nbajerseydata/${(SPECIAL_CHOICES.indexOf(choice.toUpperCase()) === -1) ? choice : 'All'}Jerseys.json`,
		success: function(data) {
			let json = JSON.parse(data);
			let sameJerseys = removeDuplicatePlayers(sortPlayers($('#sort_type').val(), json.filter((p) => {return p["JERSEY"] === num || SPECIAL_CHOICES.indexOf(num.toUpperCase()) !== -1})));
			for(let i = 0; i < sameJerseys.length; i += 3) {
				for(let j = i; j < i + 3; j++) {
					if(j < sameJerseys.length) {
						createCard(sameJerseys[j], SPECIAL_CHOICES.indexOf(num.toUpperCase()) === -1);
					}
				}
			}
			$('#loader').attr('style', 'display: none');
		}
	});
}

function removeDuplicatePlayers(a) {
	let namesWithNumbers = {};
	let names = a.map((v) => {return [v.NAME, v.JERSEY]});
	for(let name in names) {
		if(name[0] in namesWithNumbers) {
			namesWithNumbers[name[0]] += ',' + name[1];
		} else {
			namesWithNumbers[name[0]] = name[1];
		}
	}
	return _.uniq(a, true, function(p){ return p.NAME; });
}

function getShareURL() {
    $( ".copied-alert" ).fadeIn(700).delay( 600 ).fadeOut( 750 );
	document.execCommand('copy');
}

function createCard(player, numberKnown) {
	$(`.player-container`).append(`<div class='player-card' data-id=${player['ID']}><img src='http://stats.nba.com/media/players/230x185/${player["ID"]}.png'/>
		<br><span class='player-name ${(player['LAST_SEASON'] === '2016-17' || player['LAST_SEASON'] === '2015-16') ? 'bold' : ''}'>${player["NAME"]}</span>
		${(!numberKnown) ? `<br><span class="player-number-text">Number ${player["JERSEY"]}</span>` : ''}
		<br><span class='player-stats-text'>Points Per Game: ${player['PPG']}</span>
		<br><span class='player-stats-text'>Assists Per Game: ${player['AST']}</span>
		<br><span class='player-stats-text'>Rebounds Per Game: ${player['RPG']}</span>
		<br><span class='player-stats-text'>Seasons Played: ${player['SEASONS']}</span>
		</div>`);
}

function sortPlayers(sortType, players) {
	switch(sortType) {
		case 'PPG':
			return players.sort((a, b) => {return parseFloat(b.PPG - a.PPG)});
		case 'APG':
			return players.sort((a, b) => {return parseFloat(b.AST - a.AST)});
		case 'RPG':
			return players.sort((a, b) => {return parseFloat(b.RPG - a.RPG)});
		case 'SPG':
			return players.sort((a, b) => {return parseFloat(b.SPG - a.SPG)});
		case 'BPG':
			return players.sort((a, b) => {return parseFloat(b.BPG - a.BPG)});
		case 'Seasons Played':
			return players.sort((a, b) => {return parseFloat(b.SEASONS - a.SEASONS)});
		default:
			return players.sort((a, b) => {return parseFloat(b.PPG - a.PPG)});
	}
}

function getParameterByName(name) {
    results = new RegExp("[?&]" + name.replace(/[\[\]]/g, "\\$&") + "(=([^&#]*)|&|#|$)").exec(window.location.href);
    try {
    	return decodeURIComponent(results[2].replace(/\+/g, " "));
    } catch(e) {
    	return undefined;
    }
}

$(document).ready(function() {
	$('#number_input').attr('placeholder', Math.floor(Math.random() * 36));
	$('#team_input').attr('placeholder', NBA_TEAMS[Math.floor(Math.random() * NBA_TEAMS.length)].split(' ').splice(-1)[0]);
	$('#team_input').autocomplete({
		lookup: NBA_TEAMS,
		lookupLimit: 5,
		onSelect: (team) => {
			loadPlayerData(team.value, $('#number_input').val().toString());
		}
	});
	let setTeam = getParameterByName('t'),
		setNum = getParameterByName('n'),
		setSort = getParameterByName('s');

	if(setTeam || setNum) {
		setTeam = NBA_TEAMS[setTeam] || 'ANY';
		setNum = setNum || 'ANY';
		setSort = SORT_TYPES[parseInt(setSort)] || 'PPG';
		$('#team_input').val(setTeam); $('#number_input').val(setNum); $('#sort_type').val(setSort);
		loadPlayerData(setTeam, setNum);
	}
});

$(document).keypress(function(e) {
	if(e.which == 13) {
		loadPlayerData(getClosestTeam($('#team_input').val()), $('#number_input').val().toString());
	}
});

function getClosestTeam(team) {
	let closest = ['N/A', 0];
	for(let t of NBA_TEAMS) {
		let tA = {}, tB = {};
		for(let i = 0; i < Math.max(t.length, team.length); i++) {
			let charA = team[i], charB = t[i];
			if(charA in tA) {tA[charA]++; } else {tA[charA] = 1};
			if(charB in tB) {tB[charB]++; } else {tB[charB] = 1};
		}
		let similar = 0;
		let letters = Object.keys(tA);
		for(let letter of letters) {
			if(letter in tB && letter !== undefined) {
				console.log(tA[letter], tB[letter]);
				similar += Math.min(tA[letter], tB[letter]);
			}
		}
		if(similar >= closest[1]) {
			console.log(closest);
			closest = [t, similar];
		}
	}
	console.log(closest);
	return closest[0];
}

$('#sort_type').change(function() {
	loadPlayerData($('#team_input').val(), $('#number_input').val().toString());
});

$("form").submit(function() { return false; });

document.addEventListener('copy', function(e) {
	e.clipboardData.setData('text/plain', `${document.location.href.split('?')[0]}?t=${NBA_TEAMS.indexOf($('#team_input').val())}&n=${$('#number_input').val()}&s=${SORT_TYPES.indexOf($('#sort_type').val())}`);
	e.preventDefault();
});


// TODO: Fix sorting alg
// TODO: Change data gathering -- get players stats when they played on that team