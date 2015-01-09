
var main = function () {

  SC.initialize({
  client_id: '17089d3c7d05cb2cfdffe46c2e486ff0',
  redirect_uri: 'http://jb-blasta-me-staging.herokuapp.com/callback.html'
  });

  $(document).ready(function() {
  $('#username').html("fhgf");
  $('a.connect').click(function(e) {
    e.preventDefault();
    SC.connect(function() {
        $('#username').append("bbbb");
        SC.get('/me',function(me){
                $('#username').html("Du bisch der "+me.username);
                alert('Hello' + me.username);
            });
        });
    })  ;


$('a.play').click(function(e) {
    console.log('play');
    e.preventDefault();
    //SC.connect(function() {
      SC.stream("/tracks/38843238", function(sound){
      sound.play();
      });    
    //})  ;
  });
  

  $('a.createPL').click(function(e) {
    console.log('createPL');
    e.preventDefault();
    SC.connect(function() {
    var tracks = ['22448500', '21928809'].map(function(id) { return { id: id } });
    SC.post('/playlists', {
      playlist: { title: 'My Playlist', tracks: tracks }
    }); 
  });
  });

  });
};

$(document).ready(main);
