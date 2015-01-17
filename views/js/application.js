

    Track = function (trackId, rotation, nextSong){
        var currentTrack = "";
        var lineProgress=0;
        var line='';
        $("#container").text("");

        SC.initialize({
            client_id: '17089d3c7d05cb2cfdffe46c2e486ff0',
            redirect_uri: 'http://jb-blasta-me-staging.herokuapp.com/callback.html'
        });

        //The SC.stream method will prepare a soundManager2 sound object for the passed track. The soundObject object provides all soundManager2 sound properties and methods like play(), stop(), pause(), setVolume(), etc

        SC.stream(
            //trackPath: a path of the track to be streamed. Will pass the secret_token parameter if given.
            "http://api.soundcloud.com/tracks/" + trackId, 

            //options: (optional) options that are passed to the soundManager2 sound object. (see soundManager2 docs). Additionally it supports an ontimedcomments callback that will be called for each timed comment group while the track is playing.

            {onfinish: function(){ 
            console.log('track finished');

                currentTrack.stop();
                currentTrack = rotation.nextTrack();
                currentTrack = new Track(currentTrack.soundcloud_id, rotation, true);
                currentTrack.play();

            }}, 
            //callback: (optional) a function to be called when the sound object is ready. Passes the sound object as an argument.
            function(sound){
                console.log("got here" + trackId);
                currentTrack = sound;
                $.post("getTrackInfo", {"id":trackId}, function (response) {
                //this callback is called with the server responds 
                //console.log("We posted and the server responded!"); 
                    var data = response;
                    var art = data.artwork_url;
                    if(art ===null){
                        art = "../img/soundcloud5.png"
                    }
                    var title = data.title;
                    var dashpos = title.indexOf('-');
                    var prefix ="";
                    var postfix ="";

                    if(dashpos>0 && dashpos<title.length-2){
                        prefix = title.slice(0,dashpos).trim();
                        postfix = title.slice(dashpos+1).trim();
                        title = "<a href=\"#\" id=\"prefix\"> "+prefix+"</a> - "+postfix;
                    }

                    var duration = data.duration;
                    var waveform_url = data.waveform_url;
                    var permalink_url = data.permalink_url;
                    var avatar_url = data.user.avatar_url;
                    var username = data.user.username.charAt(0).toUpperCase() + data.user.username.slice(1);

                    var dur = data.duration;
                    var min = Math.floor((dur/1000/60) << 0);
                    var sec = zeroPad(Math.floor((dur/1000) % 60),2);

                    var w_width = 440;
                    var w_height = 70;
                    var a_width = 150;
                    var a_height = 150;

                    if(navigator.platform !=="MacIntel"){
                        //alert('iphone');
                        w_width = 165;
                        w_height = 50;
                        a_width = 120;
                        a_height = 120;
                    }
                    $("#track_title").html("<a href=\"#\" id=\"username\">"+username+"</a>: " +title + " ["+min+":"+sec+"]");

                    $("#wave").html('<img class="waveform_url" id="waveform_url" src="'+data.waveform_url+'" width="'+w_width+'" height="'+w_height+'" alt="wave">');
                    $("#wavebackground").css("background", "#777777");
                    $("#artwork").html('<img id="artwork_url" src="'+art+'" width="'+a_width+'" height="'+a_height+'" alt="art">')
        
                    $("#gray_radiobutton").hide();
                    $("#black_radiobutton").show(); 

                    line = new ProgressBar.Line('#container', {
                        color: '#FF6600',
                        duration: data.duration,
                        strokeWidth: 16,
                    });
                    lineProgress =0;
                    if(nextSong){
                        line.animate(1);
                    }
                    console.log("got here too" + lineProgress +" " +duration +" " + line.value());
                    
                    $('#username').on('click', function(event){
                        $("#search_input").val(username);
                        $("#search_input").trigger("submit");
                    });

                    $('#prefix').on('click', function(event){
                        $("#search_input").val(prefix);
                        $("#search_input").trigger("submit");
                    });
                });
        });


        this.play = function() {
            currentTrack.play();
            if(!nextSong){
                line.set(lineProgress);
                line.animate(1);
            }
        };
        
        this.pause = function() {
            currentTrack.pause();
            line.stop();
            lineProgress = line.value(); 
        };


        this.stop = function() {
            currentTrack.stop();
            line.stop();
            line.set(0);
            lineProgress=0;
        };

    };

    Rotation = function(tracks) {
        var currentTrack = tracks[0];

        this.currentTrack = function () {
            return currentTrack;
        };

        this.nextTrack = function () {
            var currentIndex = tracks.indexOf(currentTrack);
            var nextTrackIndex = currentIndex + 1;
            var nextTrackId = tracks[nextTrackIndex];
            currentTrack = nextTrackId;
            return currentTrack
        };

        this.previousTrack = function () {
            var currentIndex = tracks.indexOf(currentTrack);
            var nextTrackIndex =0;
            if(currentIndex>0){
                nextTrackIndex = currentIndex - 1; 
            }
            var nextTrackId = tracks[nextTrackIndex];
            currentTrack = nextTrackId;
            return currentTrack
        };

        this.goTo = function (pos) {
            var nextTrackIndex = pos;
            var nextTrackId = tracks[nextTrackIndex];
            currentTrack = nextTrackId;
            return currentTrack
        };
    };

    // leading zeros for seconds [3:05]
    function zeroPad(num, places) {
            var zero = places - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join("0") + num;
    }


    $(document).ready (function(){
        var songs = [{"title":"Sad Trombone","song_url":"https://soundcloud.com/sheckylovejoy/sad-    trombone","soundcloud_id":"18321000"},{"title":"Sad Trombone2","song_url":"https://soundcloud.com/sheckylovejoy/sad-trombone","soundcloud_id":"18321000"},{"title":"AraabMUZIK - \"Beauty\"","song_url":"https://soundcloud.com/selftitledmag/araabmuzik-beauty","soundcloud_id":"79408289"}]
        var rotation = new Rotation(songs);
        var searchResults = "";

        var currentTrack = rotation.currentTrack();
        var currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, false);

        $('#play').on('click', function(event){
            currentPlayingTrack.play();
            $('.trackTitle').html(currentTrack.title);
            $('#pause').show();
            $('#play').hide();
        });

        $('#pause').on('click', function(event){
            currentPlayingTrack.pause();
            $('#pause').hide();
            $('#play').show();
        });

        $('#stop').on('click', function(event){
            currentPlayingTrack.stop();
            $('#pause').hide();
            $('#play').show();
        });

        $('#next').on('click', function(event){
            currentPlayingTrack.stop();
            currentTrack = rotation.nextTrack();
            currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true);
            currentPlayingTrack.play();
            $('.trackTitle').html(currentTrack.title);
            $("#gray_radiobutton").hide();
            $("#black_radiobutton").show();
            $('#pause').show();
            $('#play').hide();
        });

        $('#back').on('click', function(event){
            currentPlayingTrack.stop();
            currentTrack = rotation.previousTrack();
            currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true);
            currentPlayingTrack.play();
            $('.trackTitle').html(currentTrack.title);
            $("#gray_radiobutton").hide();
            $("#black_radiobutton").show();
            $('#pause').show();
            $('#play').hide();
        });

        $('#black_radiobutton').on('click', function(event){
            var t = rotation.currentTrack();
            console.log("startRadio("+t.title+")");
            $("#current_radio_name").html(t.title);
            $("#radio_section").show();
            $("#gray_radiobutton").show();
            $("#black_radiobutton").hide();
        });

         $('#gray_radiobutton').on('click', function(event){
            $("#radio_section").hide();
            $("#black_radiobutton").show();
            $("#gray_radiobutton").hide();
        });



        $("#search-form").submit(function(){ // TODO: store search history
            var query = $("#search_input").val();
            console.log("Search for '"+query+'"');
            $("#search_heading").html("<h3>Searching for '"+query+"'...</h3>");
            /*var timeInMs = Date.now();
            var search_event = JSON.stringify({time: timeInMs, q: query});
            addToLS("search_history", search_event);
            $("#search_history").prepend(search_event);*/
            //htmlAdd($"#search_history", search_event);
            $("#search_input").blur();
            $("#search_input").css("color","gray"); 
            $("#search_input").css("font-family","Courier");
            $.post("search", {"q": query}, function (response) {
                var data=response;
                var l = data.length;
                var results = [];
                $("#saved-list").text("");
                $("#search_heading").html("<h3>"+l+" results for '"+query+"': "+"<a href=\"#\"><img class=\"close_search\" src=\"img/icons/kill.png\" width=\"15px\"></a></h3>");
                var i=0;
                for (i=0; i<l; i++) {
                   var title = data[i].title;
                   var track_id = data[i].id;
                   var song_url = data[i].permalink_url;
                   var dur = data[i].duration;
                   var min = Math.floor((dur/1000/60) << 0);
                   var sec = zeroPad(Math.floor((dur/1000) % 60),2);

                   var user_name = data[i].user.username.charAt(0).toUpperCase() + data[i].user.username.slice(1);
                   results.push({"title": user_name+" - "+title,"song_url": song_url,"soundcloud_id":track_id});
                   //console.log(title);
                   //$("#search_results").append("<a href=\"javascript:nthResult("+i+")\">"+title+"</a><br>"); // how to link to play?
                   $("#saved-list").append('<li id="'+i+'"><a href="#">'+user_name+" - "+title+' ['+min+':'+sec+']</a></li>');
                }
                $("li").click(function( event ) {
                    $('#play').hide();
                    $('#pause').show();
                    var pos = parseInt(event.currentTarget.id);
                    console.log(event.currentTarget);
                    currentPlayingTrack.stop();
                    rotation = new Rotation(results);
                    rotation.goTo(pos);
                    currentTrack = rotation.currentTrack();
                    currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true);
                    currentPlayingTrack.play();
                    $('.trackTitle').html(currentTrack.title); 
                    $("#gray_radiobutton").hide();
                    $("#black_radiobutton").show(); 
                });
            });

            return false;
        });

    });
