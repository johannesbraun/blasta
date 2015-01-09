SC.initialize({
  client_id: '340f063c670272fac27cfa67bffcafc4',
  redirect_uri: 'http://external.codecademy.com/soundcloud.html'
});

$(document).ready(function() {
  $('#username').html("fhgf");
  $('a.connect').click(function(e) {
    //e.preventDefault();
    SC.connect(function() {
        $('#username').append("bbbb");
        SC.get('/me',function(me){
                $('#username').html("Du bisch der "+me.username);
            });
        });
    });
 });