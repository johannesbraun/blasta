

    Track = function (trackId, rotation, nextSong){
        var currentTrack = "";
        var lineProgress=0;
        var line='';
        $("#loaded").text("");
        var loadline = new ProgressBar.Line('#loaded', {
            color: 'black',
            strokeWidth: 16,
        });

        $("#container").text("");


        SC.initialize({
            client_id: '17089d3c7d05cb2cfdffe46c2e486ff0',
            redirect_uri: 'http://jb-blasta-me-staging.herokuapp.com/callback.html'
        });

        
        /*SC.whenStreamingReady(function() {
          var sound = SC.stream(10421763);
          console.log(sound)
          sound.setPosition(12000); // position, measured in milliseconds
          console.log(sound.position)
          console.log(sound.duration)
          sound.whileplaying(){}
          sound.play();
        });*/


        /*var play_sound = function(id, pos) {

        SC.whenStreamingReady(function() {
        var sound = SC.stream(
            "/tracks/"+id,
            {autoPlay: false}, 
            function(sound) {
            //console.log(sound);
            sound.play({
                position: pos,
                whileplaying: function() {
                    console.log( this.position );
                }
            });
            })
        });

        }

        play_sound(10421763, 40000);*/

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

                    var duration = data.duration;
                    var waveform_url = data.waveform_url;
                    var permalink_url = data.permalink_url;
                    var avatar_url = data.user.avatar_url;
                    var username = data.user.username.charAt(0).toUpperCase() + data.user.username.slice(1);

                    var dur = data.duration;
                    setLS("duration",data.duration);
                    var min = Math.floor((dur/1000/60) << 0);
                    var sec = zeroPad(Math.floor((dur/1000) % 60),2);

                    var w_width = 440;
                    var w_height = 70;
                    var a_width = 150;
                    var a_height = 150;
                    var l_strokeWidth =16;

                    if(navigator.platform !=="MacIntel"){
                    //if(true){
                        //alert('iphone');
                        w_width = 300;
                        w_height = 50;
                        a_width = 140;
                        a_height = 140;
                        l_strokeWidth =16;
                        if(title.length>50){
                            title=title.slice(0,47)+'...';
                        }
                    }

                    if(dashpos>0 && dashpos<title.length-2){
                        prefix = title.slice(0,dashpos).trim();
                        postfix = title.slice(dashpos+1).trim();
                        ltitle = "<a href=\"#\" id=\"prefix\"> "+prefix+"</a> - "+postfix;
                    }

                    console.log(w_width+","+w_height+","+a_width+","+a_width+","+l_strokeWidth)

                    $("#track_title").html("<a href=\"#\" id=\"username\">"+username+"</a>: " +title + " ["+min+":"+sec+"]");
                    $("#playbar_name").html("<a href=\"#\" id=\"username\">"+username+"</a>: " +title + " ["+min+":"+sec+"]");


                    $("#grid").html('<img id="gradient" src="../img/gradient3.png" width="'+w_width+'" height="'+w_height+'" alt="wave">');
                    $("#wave").html('<img class="waveform_url" id="waveform_url" src="'+data.waveform_url+'" width="'+w_width+'" height="'+w_height+'" alt="wave">');
                    
                    $("#wavebackground").css("background", "#777777");
                    $("#artwork").html('<img id="artwork_url" src="'+art+'" width="'+a_width+'" height="'+a_height+'" alt="art">')
        
                    $("#gray_radiobutton").hide();
                    $("#black_radiobutton").show(); 

                    line = new ProgressBar.Line('#container', {
                        color: '#FF6600',
                        duration: data.duration,
                        strokeWidth: l_strokeWidth,
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
            //currentTrack.play();
            if(!nextSong){
                line.set(lineProgress);
                line.animate(1);
            }
            currentTrack.play({
                position: 0,
                whileplaying: function() {
                    //console.log(this.position) ;
                    var dur = this.position;
                    var min = Math.floor((dur/1000/60) << 0);
                    var sec = zeroPad(Math.floor((dur/1000) % 60),2);
                    $("#counter").text(min+':'+sec);
                    //console.log(this.bytesLoaded/this.bytesTotal);
                    //console.log(line.value());
                    loadline.set(this.bytesLoaded/this.bytesTotal);
                    if(this.bytesLoaded===this.bytesTotal){
                        line.stop();
                        line.set(this.position/this.duration);//more exact animation
                    }
                }
            });
            
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

        this.setPos = function(ff, pos) { //TODO: still relies on localStorage
            //milliseconds 1000ms = 1sec
            //console.log('dur :'+currentTrack.duration); keeps changing
            currentTrack.stop();
            line.set(ff);
            lineProgress=ff;
            line.animate(1);
            currentTrack.play({
                position: pos,
                whileplaying: function() {
                    //console.log(this.position) ;
                    var dur = this.position;
                    var min = Math.floor((dur/1000/60) << 0);
                    var sec = zeroPad(Math.floor((dur/1000) % 60),2);
                    if(pos>this.duration){//duration keeps changing as we download
                        $("#counter").css('width','75px');
                        $("#counter").text('loading');
                    }else{
                        $("#counter").css('width','50px');
                        $("#counter").text(min+':'+sec);
                    }
                    if(this.bytesLoaded===this.bytesTotal){
                        line.stop();
                        line.set(this.position/this.duration);//more exact animation
                    }
                    //console.log(line.value());
                    //console.log(this.bytesLoaded/this.bytesTotal);
                    loadline.set(this.bytesLoaded/this.bytesTotal);
                }
            })
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

    // takes item and appends it to localStorage.name
    function setLS(name, item){
        console.log("setLS("+name+", " +item+")");
        localStorage[name] = item;
    }


    $(document).ready (function(){
        var songs = [{"title":"A New Error","song_url":"https://soundcloud.com/apparat/a-new-error?in=apparat/sets/moderat-moderat","soundcloud_id":"24510445"},{"title":"Sad Trombone2","song_url":"https://soundcloud.com/sheckylovejoy/sad-trombone","soundcloud_id":"18321000"},{"title":"AraabMUZIK - \"Beauty\"","song_url":"https://soundcloud.com/selftitledmag/araabmuzik-beauty","soundcloud_id":"79408289"}]
        var rotation = new Rotation(songs);
        var searchResults = "";
        var radio =false;

        var currentTrack = rotation.currentTrack();
        var currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, false);

        $('#play').on('click', function(event){
            currentPlayingTrack.play();
            $('.trackTitle').html(currentTrack.title);
            $('#pause').show();
            $('#play').hide();
        });

        $('#pb_play').on('click', function(event){
            $('#play').trigger("click");
            $('#pb_pause').show();
            $('#pb_play').hide();
        });

        $('#pause').on('click', function(event){
            currentPlayingTrack.pause();
            $('#pause').hide();
            $('#play').show();
        });

        $('#pb_pause').on('click', function(event){
            currentPlayingTrack.pause();
            $('#pause').trigger("click");
            $('#pb_pause').hide();
            $('#pb_play').show();
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
            $("#current_radio_name").html("Radio: " +t.title);
            $("#radio_section").show();
            $("#gray_radiobutton").show();
            $("#black_radiobutton").hide();
            radio=true;
            $("#search_bar").hide();
        });

        $('#gray_radiobutton').on('click', function(event){
            $("#radio_section").hide();
            $("#black_radiobutton").show();
            $("#gray_radiobutton").hide();
            radio=false;
            $("#search_bar").show();
        });

        $('#logo').on('click', function(event){
            $('#nav_home').trigger("click");
        });

        $('#nav_home').on('click', function(event){
            $("#nav_home").addClass("active");
            $("#nav_search").removeClass("active");
            $("#nav_radios").removeClass("active");
            $("#music_section").show();
            $("#search_frame").hide();
            $("#play-bar-frame").hide();
            if(radio){
                $("#radio_section").show();
                $("#search_bar").hide();
            }
        });

         $('#nav_radios').on('click', function(event){
            $("#nav_home").removeClass("active");
            $("#nav_search").removeClass("active");
            $("#nav_radios").addClass("active");
            $("#search_frame").hide();
            $("#music_section").hide();
            $("#play-bar-frame").show();
            $("#radio_section").hide();
            $("#search_bar").show();
        });

        $('#nav_search').on('click', function(event){
            $("#nav_home").removeClass("active");
            $("#nav_search").addClass("active");
            $("#nav_radios").removeClass("active");
            $("#music_section").hide();
            $("#search_frame").show();
            $("#play-bar-frame").show();
            $("#radio_section").hide();
            $("#search_bar").show();
        });

        $("#fastforward").on('click', function(event){
            var ff = (event.pageX-185)/440;
            console.log(ff);
            var pos = Math.round(localStorage.duration * ff)
            console.log(ff);
            currentPlayingTrack.setPos(ff, pos);
            //var posX = $(this).offset().left,
            //posY = $(this).offset().top;
            //alert(event.pageX + ' , ' + event.pageY) 
            //alert((event.pageX - posX) + ' , ' + (event.pageY - posY));
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
            $("#nav_home").removeClass("active");
            $("#nav_search").addClass("active");
            $("#nav_radios").removeClass("active");
            $("#music_section").hide();
            $("#search_frame").show();
            $("#search_frame").show();
            $("#play-bar-frame").show();
            $("#radio_section").hide();
        
            $.post("search", {"q": query}, function (response) {
                var data=response;
                var l = data.length;
                var results = [];
                $("#saved-list").text("");
                //$("#search_heading").html("<h3>"+l+" results for '"+query+"': "+"<a href=\"#\"><img class=\"close_search\" src=\"img/icons/kill.png\" width=\"15px\"></a></h3>");
                $("#search_heading").html("<h3>"+l+" results for '"+query+"': </a></h3>");
                var i=0;
                for (i=0; i<l; i++) {
                   var title = data[i].title;
                   var track_id = data[i].id;
                   var song_url = data[i].permalink_url;
                   var dur = data[i].duration;
                   var min = Math.floor((dur/1000/60) << 0);
                   var sec = zeroPad(Math.floor((dur/1000) % 60),2);

                   var user_name = data[i].user.username.charAt(0).toUpperCase() + data[i].user.username.slice(1);
                   title=title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
                   user_name=user_name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
                   

                   results.push({"title": user_name+" - "+title,"song_url": song_url,"soundcloud_id":track_id});
                   //console.log('<li id="'+i+'"><a href="#">'+user_name+" - "+title+' ['+min+':'+sec+']</a></li>');
                   //$("#search_results").append("<a href=\"javascript:nthResult("+i+")\">"+title+"</a><br>"); // how to link to play?
                   
                   $("#saved-list").append('<li id="'+i+'"><a href="#">'+user_name+" - "+title+' ['+min+':'+sec+']</a></li>');
                }
                $("li").click(function( event ) {
                    if(event.currentTarget.id =="nav_home" 
                        || event.currentTarget.id =="nav_search"
                        || event.currentTarget.id =="nav_radios")
                    {
                        //do nothing
                    }else{
                        $('#play').hide();
                        $('#pause').show();
                        $("#pb_pause").show();
                        $("#pb_play").hide();
                        console.log(event);
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
                    }
                });
            });

            return false;
        });

    $('#nav_home').trigger("click");

    });
