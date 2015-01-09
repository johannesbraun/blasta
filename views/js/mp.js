SC.initialize({
  client_id: "17089d3c7d05cb2cfdffe46c2e486ff0"
});

var soundToPlay; 
// first do async action
SC.stream("/tracks/38843238", {
  useHTML5Audio: true,
  preferFlash: false
}, function(sound) {
  soundToPlay = sound;
  document.querySelector('input').disabled = false;
});

function playTrack () {
  soundToPlay.play();
}