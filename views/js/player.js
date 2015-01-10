Track = function (trackId){
        var currentTrack = "";
        var nextTrack ="";
        var currentTrackTitle="";
        var currentIndex =0;
        var nextTrackIndex = 0;
        var l =0;

        $('.trackTitle').html(JSON.parse(localStorage.currentTrack).title);

        SC.initialize({
          client_id: '17089d3c7d05cb2cfdffe46c2e486ff0',
          redirect_uri: 'http://jb-blasta-me-staging.herokuapp.com/callback.html'
          });

        /*SC.stream("http://api.soundcloud.com/tracks/" + trackId, function(sound){
            currentTrack = sound;
        });*/

        SC.stream("http://api.soundcloud.com/tracks/" + trackId, 
            {onfinish: function(){ 
                console.log('track finished');
                //play next!!
                next();
                }
            }, 
            function(sound){currentTrack = sound;});

        this.play = function() {
            currentTrack.play();
        };

        this.pause = function() {
            currentTrack.pause();
        };

        this.stop = function() {
            currentTrack.stop();
        };

        next = function(){
            console.log("next");
            currentTrack.stop();

            currentIndex = parseInt(localStorage.currentTrackIndex);
            l = localStorage.playlist.length;
            nextTrackIndex =0;
            if(currentIndex<l){
                nextTrackIndex = currentIndex + 1; 
            }
            currentTrack = JSON.parse(localStorage.playlist)[nextTrackIndex];
            
            console.log(currentTrack);
            localStorage.currentTrack = JSON.stringify(currentTrack);
            localStorage.currentTrackIndex = nextTrackIndex;

            currentTrack = new Track(currentTrack.soundcloud_id);
            currentTrack.play();
        }

        this.nextTrack = function() {
            console.log("continue with next track");
            next();
        }


        this.previousTrack = function() {

            console.log("previous Track");
            currentTrack.stop();

            currentIndex = parseInt(localStorage.currentTrackIndex);
            l = localStorage.playlist.length;
            nextTrackIndex =0;
            if(currentIndex>0){
                nextTrackIndex = currentIndex - 1; 
            }
            currentTrack = JSON.parse(localStorage.playlist)[nextTrackIndex];
            console.log(currentTrack);
            localStorage.currentTrack = JSON.stringify(currentTrack);
            localStorage.currentTrackIndex = nextTrackIndex;

            currentTrack = new Track(currentTrack.soundcloud_id);
            currentTrack.play();
            //$('.trackTitle').html(currentTrackTitle);
        }


    };


    $(document).ready (function(){
        var tracks = [{"title":"Sad Trombone","song_url":"https://soundcloud.com/sheckylovejoy/sad-trombone","soundcloud_id":"18321000"},{"title":"Sad Trombone2","song_url":"https://soundcloud.com/sheckylovejoy/sad-trombone","soundcloud_id":"18321000"},{"title":"Sad Trombone3","song_url":"https://soundcloud.com/sheckylovejoy/sad-trombone","soundcloud_id":"18321000"},{"title":"AraabMUZIK - \"Beauty\"","song_url":"  https://soundcloud.com/selftitledmag/araabmuzik-beauty","soundcloud_id":"79408289"}]
        
        localStorage.currentTrackIndex = 0;
        localStorage.currentTrack = JSON.stringify(tracks[0]);
        localStorage.playlist = JSON.stringify(tracks);
        localStorage.playbutton = "visible";

        var currentTrack = tracks[0];
        var currentPlayingTrack = new Track(currentTrack.soundcloud_id);

        $('#play').on('click', function(event){
            console.log('play');
            currentPlayingTrack.play();
            //$('.trackTitle').html(currentTrack.title);
            $('#pause').show();
            $('#play').hide();
            localStorage.playbutton = "hidden";
        });

        $('#pause').on('click', function(event){
            console.log('pause');
            currentPlayingTrack.pause();
            $('#pause').hide();
            $('#play').show();
            localStorage.playbutton = "visible";
        });

        $('#stop').on('click', function(event){
            console.log('stop');
            currentPlayingTrack.stop();
            $('#pause').hide();
            $('#play').show();
            localStorage.playbutton = "visible";
        });

        $('#next').on('click', function(event){
            console.log('next');
            currentPlayingTrack.nextTrack();
            if(localStorage.playbutton === "visible"){
                $('#pause').show();
                $('#play').hide();
                localStorage.playbutton = "hidden";
            }

        });

        $('#back').on('click', function(event){
            console.log('back');
            currentPlayingTrack.previousTrack();
            if(localStorage.playbutton === "visible"){
                $('#pause').show();
                $('#play').hide();
                localStorage.playbutton = "hidden";
            }
        });

        $('#newset').on('click', function(event){
            console.log('new set');
            songs = [{"title":"Electro","song_url": "https://soundcloud.com/jeremygerard1709/electroooo","soundcloud_id":"176626544"},{"title":"Electro","song_url": "https://soundcloud.com/jeremygerard1709/electroooo","soundcloud_id":"176626544"},{"title":"Electro","song_url": "https://soundcloud.com/jeremygerard1709/electroooo","soundcloud_id":"176626544"},{"title":"Electro","song_url": "https://soundcloud.com/korg/ambient-space-delay","soundcloud_id":"33641125"}]
            localStorage.currentTrackIndex = 0;
            localStorage.currentTrack = JSON.stringify(songs[0]);
            localStorage.playlist = JSON.stringify(songs);
        });

    });