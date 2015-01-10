SC.initialize({
  client_id: "17089d3c7d05cb2cfdffe46c2e486ff0"
});

var soundToPlay; 
// first do async action

track_id = 38843238;

SC.stream(
	"/tracks/"+track_id, 
	{
		useHTML5Audio: true,
		preferFlash: false
	}, 
	function(sound) {
		console.log("got here");
		soundToPlay = sound;
  	//document.querySelector('input').disabled = false;
  	document.querySelector('input[id="stream0"]').disabled = false;
	});

function playTrack () {
	soundToPlay.play();
}

