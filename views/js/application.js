    function loadImage(id, type, url, alt_url, a_width, a_height) {
        var img = new Image();
        img.onerror = function() {
            //img.src = url2;
            console.log("failed to load image");
            if(!alt_url==""){
                if(type=='src'){
                    $("#"+id).attr('src', alt_url);
                }
                else{
                    $("#"+id).html('<img id="'+id+'" src="'+alt_url+'" width="'+a_width+'" height="'+a_height+'" alt="art">');
                }

            }            
        };
        img.onabort = function() {
            console.log("abort");
        };
        img.onload = function() {
            //$("#artwork").html('<img id="artwork_url" src="'+url+'" width="'+a_width+'" height="'+a_height+'" alt="art">')      
            if(type=='src'){
                $("#"+id).attr('src', url);
            }
            else{
                console.log("successfully image replaced with high resolution");
                $("#"+id).html('<img id="'+id+'" src="'+url+'" width="'+a_width+'" height="'+a_height+'" alt="art">')  ;   
            } 
        };
        img.src = url;
    };

    function changeSelectionBackground(pos){
        $('.res:nth-of-type(odd)').css({'background-color' : 'white'});
        $('.res:nth-of-type(even)').css({'background-color' : 'white'});
        $('.res:nth-of-type('+(pos)+')').css({'background-color' : '#E9E9E9'});
    }

    function changeEventSelectionBackground(pos){
        $('.eres:nth-of-type(odd)').css({'background-color' : 'white'});
        $('.eres:nth-of-type(even)').css({'background-color' : 'white'});
        $('.eres:nth-of-type('+(pos)+')').css({'background-color' : '#E9E9E9'});
    }

    function randArray(){
            //Return array of 9 random numbers
            for(var i = 0, array = new Array(); i<9; i++) {
                array.push(Math.floor(Math.random()*10 + 1))
            }
            return array
    };

    function echoNestArray(tid, callback, svg){
            //Return array of 9 random numbers
            array = new Array()

            $.post("getEchonest", {"id": tid}, function (response) {
                var data=JSON.parse(response);
                
                if(data.length>0){
                    if (data[0]['danceability']>0){
                        toggleEchonest('on'); 
                        console.log(data);
                        array.push(Math.floor(data[0]['danceability']*10+1));
                        array.push(Math.floor(data[0]['energy'] *10+1));
                        array.push(Math.floor(data[0]['acousticness']*10+1));
                        array.push(Math.floor(data[0]['tempo']*10+1));
                        array.push(Math.floor(data[0]['instrumentalness']*10+1));
                        array.push(Math.floor(data[0]['valence']*10+1));
                        array.push(Math.floor(data[0]['liveness']*10+1));
                        array.push(Math.floor(data[0]['speechiness']*10+1));
                        array.push(Math.floor(data[0]['key']*10+1));
                    }else{
                        toggleEchonest('off');
                        array = [0,0,0,0,0,0,0,0,0]
                    }
                }else{
                        toggleEchonest('off');
                        array = [0,0,0,0,0,0,0,0,0]
                }
                    
                callback(array,svg);
                
            });
    }

    function returnData(param, svg) {
        console.log(param);
        var n= param.length
        if (n>9){
            param = param.slice(n-9,n)
        }
        changeChart(param,svg);
    }


    function changeChart(newArray, svg){     
        var w = 230;
        var h = 45;
        var barPadding = 1;
        var mAx = d3.max(newArray)
        var yScale = d3.scale.linear()
                        .domain([0, mAx])
                        .range([0, h])

        var rects = svg.selectAll("rect")

        rects.data(newArray)
            .enter()
            .append("rect")
        
        rects.transition()
            .ease("cubic-in-out")
            .duration(2000)
            .attr("x", function(d,i) {return i*(w/newArray.length)})
            .attr("y", function(d) {return h - yScale(d)})
            .attr("width", w / newArray.length - barPadding)
            .attr("height", function(d){return yScale(d)})
            .attr("fill", function(d) {
                return "rgb(0, 0, 0)";
            });
    };

    
    function toggleEchonest(what){
        if (what == 'off'){
            $("#echonest_section").hide();
            console.log("hide echo")
        }else{
            $("#echonest_section").show();
        }
    }

    function loadRadioButton(tid){
        $("#rbox").hide();
        $.post("radiocheck", {"id": tid}, function (response) {
            var data=JSON.parse(response);
            console.log(data[0]['available']);
            var l = data.length;
            available  = data[0]['available'];
            if (available>0){
                 $("#rbox").show();
            }
        });
    }


    function loadProfile(uid){
        //recent tracks
        $.post("recenttracks", {"user": 1}, function (response) {
                var data=JSON.parse(response);
                console.log(data);
                var l = data.length;
                var results = [];
                $("#recent_tracks").text("");

                var i=0;
                for (i=0; i<l; i++) {
                   //console.log(data[i])
                   var track_id = data[i]['tid'];
                   var user_name = data[i]['username'];
                   var title = data[i]['title'];
                   var art = data[i]['artwork_url'];
                   //console.log(art);
                   if(art ===null){
                        art = "../img/soundcloud5.png"
                   }
                   if (art=="https://a1.sndcdn.com/images/default_avatar_large.png"){
                        art = "../img/soundcloud5.png"
                   }
                   //console.log("should be playing" + track_id +" "+ title);
                   var tmp = '<li id="rad" class="rad" ><a href="#"><img class="preview_img" src="'+art+'" width="30" alt=""><span class="resname">'+user_name+'<br><span class="restitle">'+title+'</span></span></a></li>';
                   $("#recent_tracks").append(tmp);
                    //loadImage("res"+i, "src", art, "../img/soundcloud5.png", 30, 30);
                }
            });
        $.post("recentradios", {"user": 1}, function (response) {
                var data=JSON.parse(response);
                console.log(data);
                var l = data.length;
                var results = [];
                $("#saved_radios").text("");

                var i=0;
                for (i=0; i<l; i++) {
                   //console.log(data[i])
                   var track_id = data[i]['tid'];
                   var user_name = data[i]['username'];
                   var title = data[i]['title'];
                   var art = data[i]['artwork_url'];
                   //console.log(art);
                   if(art ===null){
                        art = "../img/soundcloud5.png"
                   }
                   if (art=="https://a1.sndcdn.com/images/default_avatar_large.png"){
                        art = "../img/soundcloud5.png"
                   }
                   //console.log("should be playing" + track_id +" "+ title);
                   var tmp = '<li id="rad" class="rad" ><a href="#"><img class="preview_img" src="'+art+'" width="30" alt=""><span class="resname">'+user_name+'<br><span class="restitle">'+title+'</span></span></a></li>';
                   $("#saved_radios").append(tmp);
                    //loadImage("res"+i, "src", art, "../img/soundcloud5.png", 30, 30);
                }
            });
        $.post("preferences", {"user": 1}, function (response) {
                var data=JSON.parse(response);
                console.log(data);
                var l = data.length;
                var results = [];
                $("#saved_likes").text("");
                $("#saved_hates").text("");

                var i=0;
                for (i=0; i<l; i++) {
                   //console.log(data[i])
                   var kind  = data[i]['kind'];
                   var track_id = data[i]['tid'];
                   var user_name = data[i]['username'];
                   var title = data[i]['title'];
                   var art = data[i]['artwork_url'];
                   //console.log(art);
                   if(art ===null){
                        art = "../img/soundcloud5.png"
                   }
                   if (art=="https://a1.sndcdn.com/images/default_avatar_large.png"){
                        art = "../img/soundcloud5.png"
                   }
                   //console.log("should be playing" + track_id +" "+ title);
                   var tmp = '<li id="rad" class="rad" ><a href="#"><img class="preview_img" src="'+art+'" width="30" alt=""><span class="resname">'+user_name+'<br><span class="restitle">'+title+'</span></span></a></li>';
                   if (kind>0){
                        $("#saved_likes").append(tmp);
                    }else{
                        $("#saved_hates").append(tmp);
                    }
                    //loadImage("res"+i, "src", art, "../img/soundcloud5.png", 30, 30);
                }
            });
    }

        //recent radios

        //likes

        //hates



    function loadEchoNest(tid){
        //Return array of 10 random numbers
        /*var randArray = function() {

            for(var i = 0, array = new Array(); i<9; i++) {
                array.push(Math.floor(Math.random()*10 + 1))
            }
            return array
        }*/
        toggleEchonest('on')
        d3.select("section").selectAll("*").remove();
        //$("#echograph").html("");
        var initRandArray = randArray();
        var newArray;

        var w = 230;
        var h = 45;
        var barPadding = 1;
        var mAx = d3.max(initRandArray)
        var yScale = d3.scale.linear()
                        .domain([0, mAx])
                        .range([0, h])
        
        var svg = d3.select("section")
            .append("svg")
            .attr("width", w)
            .attr("height", h)

        svg.selectAll("rect")
            .data(initRandArray)
            .enter()
            .append("rect")
            .attr("x", function(d,i) {return i*(w/initRandArray.length)})
            .attr("y", function(d) {return h - yScale(d)})
            .attr("width", w / initRandArray.length - barPadding)
            .attr("height", function(d){return yScale(d)})
            .attr("fill", function(d) {
            return "rgb(0, 0, 0)";
        });

        /*svg.selectAll("text")
            .data(initRandArray)
            .enter()
            .append("text")
            .text(function(d){return d})
            .attr("x", function(d, i){return (i*(w/initRandArray.length) + 20)})
            .attr("y", function(d) {return h - yScale(d) + 15})
            .attr("font-family", "sans-serif")
            .attr("fill", "white")*/

        echoNestArray(tid, returnData, svg);
        /*newArray = randArray();
            
        var rects = svg.selectAll("rect")
            
        rects.data(newArray)
            .enter()
            .append("rect")

        

        //changeArray(newArray,scg)

        /*setInterval(function() {
            console.log("set interval");
            
            

            /*newArray = randArray();
            
            var rects = svg.selectAll("rect")
            
            rects.data(newArray)
                .enter()
                .append("rect")
            
            /*rects.transition()
                .ease("cubic-in-out")
                .duration(2000)
                .attr("x", function(d,i) {return i*(w/newArray.length)})
                .attr("y", function(d) {return h - yScale(d)})
                .attr("width", w / newArray.length - barPadding)
                .attr("height", function(d){return yScale(d)})
                .attr("fill", function(d) {
                    return "rgb(0, 0, 0)";
                });*/
           
            /*var labels = svg.selectAll("text")
            
            labels.data(newArray)
                .enter()
                .append("text")
            
            labels.transition()
                .ease("cubic-in-out")
                .duration(2000)
                .text(function(d){return d})
                .attr("x", function(d, i){return (i*(w/newArray.length) + 20)})
                .attr("y", function(d) {return h - yScale(d) + 15})
                .attr("font-family", "sans-serif")
                .attr("fill", "white")
            


        }, 3000)*/
    };

    function loadEvents(dateText){
        $.post("getEvents", {"dateText": dateText}, function (response) {
                var data=JSON.parse(response);
                //console.log(data);
                var l = data.length;
                var results = [];
                $("#events-list").text("");
                if (l>50){
                    l=50
                } 
                var i=0;
                for (i=0; i<l; i++) {
                   //console.log(data[i])
                   var eventid = data[i]['eventid'];
                   var eventName = data[i]['eventName'];
                   var venueName = data[i]['venueName'];
                   var flyer = data[i]['flyer'];
                   var emonth = data[i]['emonth'];
                   var eday = data[i]['eday'];

                   var attending = data[i]['attending'];
                   var strday = "th"
                   if (eday == 1){
                        strday = "st"
                   }
                   if (eday == 2){
                        strday = "nd"
                   }
                   if (eday == 3){
                        strday = "rd"
                   }
                   if (flyer ==""){
                        flyer = "../img/ResidentAdvisor_logo.png"
                   }else{
                        flyer = "http://www.residentadvisor.net/"+flyer
                   }
                   //console.log("should be playing" + track_id +" "+ title);
                   //results.push({"title": user_name+" - "+title,"song_url": song_url,"soundcloud_id":track_id});
                   $("#events-list").append('<li id="'+i+"_"+eventid+'" class="eres" ><a href="#"><img id="'+i+"_"+eventid+'" class="epreview_img" src="'+flyer+'" alt="" width="50"><span class="evname">'+emonth+' '+eday+''+strday+'<br><span class="evtitle">'+eventName+'<br><span class="evtitle"> @ ' +venueName+'</span></span></span></a></li>'); 
                    
                };


                $("li").click(function( event ) {
                    console.log("li event: "+event.currentTarget.classList[0])
                    console.log(event)
                    if(event.currentTarget.classList[0]=="eres"){
                        var eventtargetid = event.currentTarget.attributes[0].nodeValue
                        var eventid = eventtargetid.split("_")[1];
                        var eventpos = eventtargetid.split("_")[0];
                        console.log(eventid)
                        loadLineup(eventid)
                        changeEventSelectionBackground(parseInt(eventpos)+1);
                        /*var pos = parseInt(event.currentTarget.id);
                        $('.res:nth-of-type(odd)').css({'background-color' : 'white'});
                        $('.res:nth-of-type(even)').css({'background-color' : 'white'});
                        $('.res:nth-of-type('+(pos+1)+')').css({'background-color' : '#E9E9E9'});
                        /*$('li:nth-child(even)').css({'background-color' : 'white'});
                        $('li:nth-child(odd)').css({'background-color' : 'white'});
                        $('li:nth-child('+(pos+1)+')').css({'background-color' : '#E9E9E9'});
                        $('li:nth-child('+(pos+1)+')').css({'color' : 'red'});
                        */

                        
                        /*currentPlayingTrack.stop();
                        rotation = new Rotation(results);
                        rotation.goTo(pos);
                        currentTrack = rotation.currentTrack();
                        currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true);
                        currentPlayingTrack.play();
                        $('.trackTitle').html(currentTrack.title); 
                        $("#gray_radiobutton").hide();
                        $("#black_radiobutton").show();
                        //console.log('hallo?')
                        $("#search_frame").show();
                        $("#radio_section").hide();
                        $("#playing_radio").empty();
                        radio=false;*/
                    }
                });
            
            });
    };


    function loadLineup(eventid){
        $.post("getLineup", {"id": eventid}, function (response) {
                var data=JSON.parse(response);
                //console.log(data);
                var l = data.length;
                var results = [];
                $("#lineup-list").text("");
                $("#flyer").text("");
                

                for (i=0; i<l; i++) {
                   //console.log(data[i])
                   var djID = data[i]['djID'];
                   var djname = data[i]['djname'];
                   var venueName = data[i]['venueName'];
                   var flyer = data[i]['flyer'];
                   var djstring = djname.replace(/ /g, "_");

                   $("#lineup-list").append('<li id='+djstring+' class="djres" ><a href="#"><span class="highlight">'+djname+'</span></a></li>'); 
                }
                if (flyer ==""){
                        //nothing
                }else{
                    flyer = "http://www.residentadvisor.net/"+flyer
                    $("#flyer").append('<a href="#" id="fly"><img src='+flyer+' width="340" alt=""></a>');
                }
                

                $("li").click(function( event ) {
                    if(event.currentTarget.classList[0]=="djres") {
                        var djstring = event.currentTarget.attributes[0].nodeValue
                        var djname = djstring.replace(/_/g, " ");
                        console.log(djstring)
                        console.log(event)
                        //startStation(djID)
                        $("#search_input").val(djname);
                        $("#search_input").trigger("submit");
                        $("#search_bar").show();
                    }
                });
            });
    };



    Track = function (trackId, rotation, nextSong){
        var currentTrack = "";
        var lineProgress=0;
        var line='';
        $("#loaded").text("");
        var strokew = 11;
        if(screen.width<600){
            strokew = 13;
        }
        var loadline = new ProgressBar.Line('#loaded', {
            color: 'black',
            strokeWidth: strokew,
        });

        $("#container").text("");


        SC.initialize({
            client_id: '2701694c60e3271a6d41294b31bb36cc',
            redirect_uri: 'http://www.blasta.me/callback.html'
        });

       /* SC.initialize({
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
                changeSelectionBackground(rotation.getPos()-1);
                currentTrack.play();

            }}, 
            //callback: (optional) a function to be called when the sound object is ready. Passes the sound object as an argument.
            function(sound){
                //console.log("got here" + trackId);
                currentTrack = sound;


                $.post("plays", {"id": trackId}, function (response) {
                //nada
                });

                $.post("getTrackInfo", {"id":trackId}, function (response) {
                //this callback is called with the server responds 
                //console.log("We posted and the server responded!"); 
                    $("#counter").css('width','35px');
                    $("#counter").text('0:00');
                    var data = response;
                    var art = data.artwork_url;
                    var title = data.title;

                    var dashpos = title.indexOf('-');
                    var prefix ="";
                    var postfix ="";

                    var duration = data.duration;
                    var waveform_url = data.waveform_url;
                    var permalink_url = data.permalink_url;
                    var avatar_url = data.user.avatar_url;
                    var streamable = data.streamable;

                    var username = data.user.username.charAt(0).toUpperCase() + data.user.username.slice(1);

                    var dur = data.duration;
                    setLS("duration",data.duration);
                    var min = Math.floor((dur/1000/60) << 0);
                    var sec = zeroPad(Math.floor((dur/1000) % 60),2);

                    var w_width = 440;
                    var w_height = 50;
                    var a_width = 290;//150
                    var a_height = 290;
                    var l_strokeWidth =11;//16

                    loadEchoNest(trackId);
                    loadRadioButton(trackId);
                    $.post("playupdateradio", {"id": trackId}, function (response) {
                      //nada
                    });

                    //if(navigator.platform !=="MacIntel"){
                    if (screen.width<600){
                    //if(true){
                        //alert('iphone');
                        w_width = 290;
                        w_height = 40;
                        a_width = 290;
                        a_height = 290;
                        l_strokeWidth =13;
                        if(title.length>50){
                            //title=title.slice(0,47)+'...';
                        }
                    }

                    if(dashpos>0 && dashpos<title.length-2){
                        prefix = title.slice(0,dashpos).trim();
                        postfix = title.slice(dashpos+1).trim();
                        ltitle = "<a href=\"#\" id=\"prefix\"> "+prefix+"</a> - "+postfix;
                    }

                    //console.log(w_width+","+w_height+","+a_width+","+a_width+","+l_strokeWidth)

                    $("#track_user").html("<span class=\"padded_link\"><a href=\"#\" id=\"username\">"+username+":</a></span>");
                    $("#track_title").html("<span class=\"padded_link\" >"+title+"</span>");
                    //$("#playbar_name").html("<a href=\"#\" id=\"username\">"+username+"</a>: " +title + " ["+min+":"+sec+"]");
                    $("#playbar_name").html('<span class="pb_counter" id="pb_counter">0:00 </span>'+ title);
                    $("#counter2").text(min+":"+sec)
                    if(screen.width<600){
                        if (min>9){
                            $("#counter2").css('width','45px')
                            $("#counter2").css('left','245px')
                        }else{
                            $("#counter2").css('width','35px')
                            $("#counter2").css('left','250px')
                            //$("#counter2").css('width',$("#counter2").css('width')+5) 
                        }
                    }else{
                        if (min>9){
                            $("#counter2").css('width','45px')
                            $("#counter2").css('left','390px')
                        }else{
                            $("#counter2").css('width','35px')
                            $("#counter2").css('left','395px')
                            //$("#counter2").css('width',$("#counter2").css('width')+5) 
                        }
                    }


                   //$("#grid").html('<img id="gradient" src="../img/gradient3.png" width="'+w_width+'" height="'+w_height+'" alt="wave">');
                    $("#grid").html('<img id="gradient" src="../img/icons/lines5.png" width="'+w_width+'" height="'+w_height+'" alt="wave">');
                    
                    $("#wave").html('<img class="waveform_url" id="waveform_url" src="'+data.waveform_url+'" width="'+w_width+'" height="'+w_height+'" alt="wave">');
                    
                    $("#wave_frame_bg").css("background", "#777777");
                    $("#waveforeground").css("background", "#FFFFFF");
                    $("#waveforeground").css("opacity", "0.6");

                    if(art ===null){
                        art = data.user.avatar_url;
                    }
                    if(art ===null){
                        art = "../img/soundcloud5.png"
                        $("#artwork").html('<img id="artwork_url" src="'+art+'" width="'+a_width+'" height="'+a_height+'" alt="art">')
                        //$("#artwork").css('opacity', '0.3');
                    }else{
                        var art_large = art.replace("large", "t500x500");
                        console.log(art)
                        console.log(art_large)
                        $("#artwork").css('opacity', '1');
                        $("#artwork").html('<img id="artwork_url" src="'+art+'" width="'+a_width+'" height="'+a_height+'" alt="art">')
                        loadImage("artwork","div",art_large, "", a_width, a_height);
                    }

                    console.log('playing: '+ username +" : " +title + " (" + data.id +"): "+ data.permalink_url);
                    var tmp = '<li id="rad" class="rad" ><a href="#"><img class="preview_img" src="'+art+'" width="30" alt=""><span class="resname">'+username+'<br><span class="restitle">'+title+'</span></span></a></li>';
                    $("#playing_track").empty();     
                    $("#playing_track").append(tmp);      
                    //$("#recent_tracks").append(tmp);         
            
                    
                    //$("#gray_radiobutton").hide();
                    //$("#black_radiobutton").show(); 

                    line = new ProgressBar.Line('#container', {
                        color: '#FF6600',
                        duration: data.duration,
                        strokeWidth: l_strokeWidth,
                    });
                    lineProgress =0;
                    //if(nextSong){
                       // line.animate(1);
                    //}//
                    //console.log("got here too" + lineProgress +" " +duration +" " + line.value());
                    
                    $('#username').on('click', function(event){
                        $("#search_input").val(username);
                        $("#search_input").trigger("submit");
                        $("#search_bar").show();
                    });

                    $('#recent_search').on('click', function(event){
                        var rq = event.toElement.innerText;
                        //console.log(rq)
                        $("#search_input").val(rq);
                        $("#search_input").trigger("submit");
                    });

                    $('#prefix').on('click', function(event){
                        $("#search_input").val(prefix);
                        $("#search_input").trigger("submit");
                    });

                    console.log("streamable " + streamable)
                    if(streamable == false){
                        console.log("aaaaarrrrrggggg")
                        $('#next').trigger("click")
                        //currentTrack.stop();
                        //currentTrack = rotation.nextTrack();
                        //currentTrack = new Track(currentTrack.soundcloud_id, rotation, true);
                        //currentTrack.play();
                    }
                    
                });
        });



        this.play = function() {
            //currentTrack.play();
            /*if(!nextSong){
                line.set(lineProgress);
                line.animate(1);
            }*/
            
            currentTrack.play({
                position: 0,
                whileplaying: function() {
                    //console.log(this.position) ;
                    var dur = this.position;
                    var min = Math.floor((dur/1000/60) << 0);
                    var sec = zeroPad(Math.floor((dur/1000) % 60),2);
                    //$("#counter").html("<span class=\"padded_counter\">"+min+':'+sec+"</span>");
                    $("#counter").text(min+':'+sec);
                    if (min>9){
                            $("#counter").css('width','45px')
                    }else{
                            $("#counter").css('width','35px')
                            //$("#counter2").css('width',$("#counter2").css('width')+5) 
                    }

                    $("#pb_counter").text(min+':'+sec+" ");
                    
                    //console.log(this.bytesLoaded/this.bytesTotal);
                    //console.log(line.value());
                    if(screen.width>600){
                        loadline.set(this.bytesLoaded/this.bytesTotal);
                    }
                    if(this.bytesLoaded===this.bytesTotal){
                            //line.stop();
                        line.set(this.position/this.duration);//more exact animation
                            
                    }else{
                       line.set(this.position/(this.bytesTotal/this.bytesLoaded*this.duration));
                    }
                }
            });
            
        };
        
        this.pause = function() {
            currentTrack.pause();
            //line.stop();
            lineProgress = line.value(); 
        };


        this.stop = function() {
            currentTrack.stop();
            //line.stop();
            line.set(0);
            lineProgress=0;
        };

        this.getDur = function(){
            return currentTrack.duration
        }

        this.getPosition = function(){
            return currentTrack.position
        }

        this.setPos = function(ff, pos) { //TODO: still relies on localStorage
            //milliseconds 1000ms = 1sec
            //console.log('dur :'+currentTrack.duration); keeps changing
            currentTrack.stop();
            line.set(0);
            lineProgress=ff;
            //line.animate(1);
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
                        if(min>9){
                            $("#counter").css('width','45px');
                        }else{
                            $("#counter").css('width','35px');
                        }
                        $("#counter").text(min+':'+sec);
                        $("#pb_counter").text(min+':'+sec+' ');
                    }
                    if(this.bytesLoaded===this.bytesTotal){
                        //line.stop();
                        line.set(this.position/this.duration);//more exact animation
                    }else{
                        line.set(this.position/(this.bytesTotal/this.bytesLoaded*this.duration));
                    }
                    //console.log(line.value());
                    //console.log(this.bytesLoaded/this.bytesTotal);
                    if(screen.width>600){
                        loadline.set(this.bytesLoaded/this.bytesTotal);
                    }
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
            var nextTrackIndex =0;
            if(currentIndex<(tracks.length-1)){
                nextTrackIndex = currentIndex + 1; 
            }
            var nextTrackId = tracks[nextTrackIndex];
            currentTrack = nextTrackId;
            return currentTrack
        };

        this.previousTrack = function () {
            var currentIndex = tracks.indexOf(currentTrack);
            console.log('currentIndex:'+currentIndex);
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

        this.getPos = function (){
            return tracks.indexOf(currentTrack);
        }
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
        var songs = [{"user": "", "title":"Four Tet - Lion (Jamie xx remix)","song_url":"Four Tet - Lion (Jamie xx remix)","soundcloud_id":"65161040"},{"user": "", "title":"Digitalism - Zdarlight - Chopstick & Johnjon remix","song_url":"Digitalism - Zdarlight - Chopstick & Johnjon remix","soundcloud_id":"71567061"},{"user": "","title":"A New Error","song_url":"https://soundcloud.com/apparat/a-new-error?in=apparat/sets/moderat-moderat","soundcloud_id":"24510445"},{"user": "","title":"DIGITALISM MAY 2013 US TOUR MIXTAPE","song_url":"http://soundcloud.com/digitalism_official/digitalism-may-mix","soundcloud_id":"90603702"},{"user": "","title":"Paul Kalkbrenner - Sky And Sand (Feat. Fritz Kalkbrenner)","song_url":"http://soundcloud.com/paulkalkbrenner/paul-kalkbrenner-sky-and","soundcloud_id":"37032471"},{"user": "","title":"Sad Trombone","song_url":"https://soundcloud.com/sheckylovejoy/sad-trombone","soundcloud_id":"18321000"}];
        console.log(songs);
        //songs will actually be a full track object coming from the server
        
        loadEvents("now");
        
        var rotation = new Rotation(songs);
        var searchResults = "";
        var radio =false;
        var playing=false;
        var profile = false;

        var currentTrack = rotation.currentTrack();
        //var currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, false);
        var currentPlayingTrack = []

        $.post("getRecentRadios", {"id": 1}, function (response) {
            var data=JSON.parse(response);
            console.log(data);
            var l = data.length;
        
            if (l>0){
                $("#gray_radiobutton").show();
                $("#black_radiobutton").hide();
                radio = true;
                var ttl = data[0]['username'] + "-" +data[0]['title']; 
                $("#search_input").val('Radio based on: ' +ttl);
                $.post("getRadio", {"id": 1}, function (response) {
                    var data=JSON.parse(response);
                    //console.log(data);
                    var l = data.length;
                    var results = [];
                    $("#saved-list").text("");

                    var i=0;
                    for (i=0; i<l; i++) {
                       //console.log(data[i])
                       var track_id = data[i]['tid'];
                       user_name = data[i]['username'];
                       title = data[i]['title'];
                       song_url = ""

                       var art = data[i]['artwork_url'];
                       //console.log(art);

                       if (art=="https://a1.sndcdn.com/images/default_avatar_large.png"){
                            art = "../img/soundcloud5.png"
                       }

                    
                       //console.log("should be playing" + track_id +" "+ title);
                       results.push({"title": user_name+" - "+title,"song_url": song_url,"soundcloud_id":track_id});
                       if (i>0){//don't skip the first track 
                        $("#saved-list").append('<li id="'+i+'" class="res" ><a href="#"><img id="res'+i+'" class="preview_img" src="../img/soundcloud5.png" width="30" alt=""><span class="resname">'+user_name+'<br><span class="restitle">'+title+'</span></span></a></li>'); 
                        }
                        loadImage("res"+i, "src", art, "../img/soundcloud5.png", 30, 30);
                    }

                    
                    rotation = new Rotation(results);
                    currentTrack = rotation.currentTrack();
                    currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true)
                    //currentPlayingTrack.setPos(ff, pos); # Error with line set :-(

                    $("li").click(function( event ) {
                        /*if(event.currentTarget.id =="nav_home" 
                            || event.currentTarget.id =="nav_search"
                            || event.currentTarget.id =="nav_radios")
                        {*/
                            //do nothing
                        
                        if(event.currentTarget.classList[0]=="res") {
                            $('#play').hide();
                            $('#pause').show();
                            $("#pb_pause").show();
                            $("#pb_play").hide();
                            $('#liked').hide();
                            $('#like').show();
                            $('#disliked').hide();
                            $('#dislike').show();
                            playing=true;
                            console.log(event);
                            var pos = parseInt(event.currentTarget.id);
                            $('.res:nth-of-type(odd)').css({'background-color' : 'white'});
                            $('.res:nth-of-type(even)').css({'background-color' : 'white'});
                            $('.res:nth-of-type('+(pos)+')').css({'background-color' : '#E9E9E9'});
                            /*$('li:nth-child(even)').css({'background-color' : 'white'});
                            $('li:nth-child(odd)').css({'background-color' : 'white'});
                            $('li:nth-child('+(pos+1)+')').css({'background-color' : '#E9E9E9'});
                            $('li:nth-child('+(pos+1)+')').css({'color' : 'red'});
                            */

                            console.log(event.currentTarget);
                            currentPlayingTrack.stop();
                            //rotation = new Rotation(results);
                            rotation.goTo(pos+1);
                            currentTrack = rotation.currentTrack();
                            currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true);
                            currentPlayingTrack.play();
                            $('.trackTitle').html(currentTrack.title); 
                            //$("#gray_radiobutton").hide();
                            //$("#black_radiobutton").show();
                            //console.log('hallo?')
                            //$("#search_frame").show();
                            //$("#radio_section").hide();
                            //$("#playing_radio").empty();
                            //radio=false;
                            }
                        });
                
                 });

            }else{
            $.post("stopsradio", {"id": 1}, function (response) {
                //nada
            });
            $.post("playFirst", {"id": 1}, function (response) {
                var data=JSON.parse(response);
            //console.log(data);
            var l = data.length;
            var results = [];
            $("#saved-list").text("");
            $('#liked').hide();
            $('#like').show();

            var i=0;
            for (i=0; i<l; i++) {
               //console.log(data[i])
               var track_id = data[i]['tid'];
               user_name = data[i]['username'];
               title = data[i]['title'];
               song_url = ""
               var art = data[i].artwork_url;

               if (art=="https://a1.sndcdn.com/images/default_avatar_large.png"){
                    art = "../img/soundcloud5.png"
                }
               //console.log("should be playing" + track_id +" "+ title);
               results.push({"title": user_name+" - "+title,"song_url": song_url,"soundcloud_id":track_id});
               if (i>1){//skip the first two 
                $("#saved-list").append('<li id="'+i+'" class="res" ><a href="#"><img id="res'+i+'" class="preview_img" src="../img/soundcloud5.png" width="30" alt=""><span class="resname">'+user_name+'<br><span class="restitle">'+title+'</span></span></a></li>'); 
                }
                loadImage("res"+i, "src", art, "../img/soundcloud5.png", 30, 30);
            }
            
            //currentPlayingTrack.stop();
            rotation = new Rotation(results);
            rotation.goTo(1);
            currentTrack = rotation.currentTrack();
            currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true);
            //currentPlayingTrack.play();
            $('.trackTitle').html(currentTrack.title);

            $("li").click(function( event ) {
                console.log("res event "+event.currentTarget.classList[0])
                /*if(event.currentTarget.id =="nav_home" 
                    || event.currentTarget.id =="nav_search"
                    || event.currentTarget.id =="nav_radios")
                {
                    //do nothing*/
                if(event.currentTarget.classList[0]=="res") {
                    $('#play').hide();
                    $('#pause').show();
                    $("#pb_pause").show();
                    $("#pb_play").hide();
                    $('#liked').hide();
                    $('#like').show();
                    $('#disliked').hide();
                    $('#dislike').show();
                    playing=true;
                    console.log(event);
                    var pos = parseInt(event.currentTarget.id);
                    $('.res:nth-of-type(odd)').css({'background-color' : 'white'});
                    $('.res:nth-of-type(even)').css({'background-color' : 'white'});
                    $('.res:nth-of-type('+(pos-1)+')').css({'background-color' : '#E9E9E9'});
                    /*$('li:nth-child(even)').css({'background-color' : 'white'});
                    $('li:nth-child(odd)').css({'background-color' : 'white'});
                    $('li:nth-child('+(pos+1)+')').css({'background-color' : '#E9E9E9'});
                    $('li:nth-child('+(pos+1)+')').css({'color' : 'red'});
                    */

                    console.log(event.currentTarget);
                    currentPlayingTrack.stop();
                    //rotation = new Rotation(results);
                    rotation.goTo(pos);
                    currentTrack = rotation.currentTrack();
                    currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true);
                    currentPlayingTrack.play();
                    $('.trackTitle').html(currentTrack.title); 
                    //$("#gray_radiobutton").hide();
                    //$("#black_radiobutton").show();
                    //console.log('hallo?')
                    //$("#search_frame").show();
                    //$("#radio_section").hide();
                    //$("#playing_radio").empty();
                    //radio=false;
                    }
                });
        
            });
            }
        });



        $('#play').on('click', function(event){
            currentPlayingTrack.play();
            $('.trackTitle').html(currentTrack.title);
            $('#pause').show();
            $('#play').hide();
            $('#pb_pause').show();
            $('#pb_play').hide();
            playing=true;
        });


        $('#artwork_link').on('click', function(event){
            if(!playing){
                $('#play').trigger("click");
            }else{
                $('#pause').trigger("click");
            }
        });

        $('#pb_play').on('click', function(event){
            $('#play').trigger("click");
        });

        $('#pause').on('click', function(event){
            currentPlayingTrack.pause();
            $('#pause').hide();
            $('#play').show();
            $('#pb_pause').hide();
            $('#pb_play').show();
            playing=false;
        });

        $('#pb_pause').on('click', function(event){
            $('#pause').trigger("click");
        });

        $('#stop').on('click', function(event){
            currentPlayingTrack.stop();
            $('#pause').hide();
            $('#play').show();
            $('#pb_pause').hide();
            $('#pb_play').show();
        });

        $('#next').on('click', function(event){
            var t = rotation.currentTrack();
            $.post("skips", {"id": t.soundcloud_id}, function (response) {
                //nada
            });
            currentPlayingTrack.stop();
            currentTrack = rotation.nextTrack();
            currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true);
            currentPlayingTrack.play();
            changeSelectionBackground(rotation.getPos()-1);
            $('.trackTitle').html(currentTrack.title);
            //$("#gray_radiobutton").hide();
            //$("#black_radiobutton").show();
            $('#pause').show();
            $('#play').hide();
            $('#pb_pause').show();
            $('#pb_play').hide();
            $('#liked').hide();
            $('#like').show();
            $('#disliked').hide();
            $('#dislike').show();
        });

        $('#back').on('click', function(event){
            currentPlayingTrack.stop();
            currentTrack = rotation.previousTrack();
            currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true);
            currentPlayingTrack.play();
            $('.trackTitle').html(currentTrack.title);
            //$("#gray_radiobutton").hide();
            //$("#black_radiobutton").show();
            $('#pause').show();
            $('#play').hide();
            $('#pb_pause').show();
            $('#pb_play').hide();
            $('#liked').hide();
            $('#like').show();
            $('#disliked').hide();
            $('#dislike').show();
        });

        $("#fastforward").on('click', function(event){
            var parentOffset = $(this).parent().offset();
            console.log(parentOffset.left);
            console.log("event.pageX: "+event.pageX);

            var ff = (event.pageX-parentOffset.left)/440;
            if(screen.width<600){
                ff=(event.pageX-10)/290;
            }
            
            
            var pos = Math.round(localStorage.duration * ff)
            console.log(ff +" "+ pos);
            currentPlayingTrack.setPos(ff, pos);
            //var posX = $(this).offset().left,
            //posY = $(this).offset().top;
            //alert(event.pageX + ' , ' + event.pageY) 
            //alert((event.pageX - posX) + ' , ' + (event.pageY - posY));
            $('#pause').show();
            $('#play').hide();
            $('#pb_pause').show();
            $('#pb_play').hide();
        });

        $('#profile_toggle').on('click', function(event){

            if (profile){
                $("#play-bar-frame").hide()
                $("#profile_frame").hide();
                $("#music_section").show(); 
                
                $("#search_bar").show();
                $("#search_frame").show();
                $("#events_frame").show();
                $("#calendar_section").show();
                $("#header_section").show();
                $("#lineup_frame").show();
                $("#flyer").show();
                $("#reset").hide();
                profile= false;
            }else{
                $("#music_section").hide();
                $("#search_frame").hide();
                $("#radio_section").hide();
                $("#search_bar").hide();
                $("#events_frame").hide();
                $("#calendar_section").hide();
                $("#header_section").hide();
                $("#lineup_frame").hide();
                $("#flyer").hide();
                //$("#reco_frame").hide()
                $("#profile_frame").show();
                $("#play-bar-frame").show()
                $("#reset").show();
                loadProfile(1)
                profile = true;
                
            }  
        });

        $('#gray_radiobutton').on('click', function(event){
            var t = rotation.currentTrack();
            $.post("stopsradio", {"id": t.soundcloud_id}, function (response) {
                //nada
            });
            $("#radio_section").hide();
            $("#black_radiobutton").show();
            $("#gray_radiobutton").hide();
            radio=false;
            $("#search_bar").show();
            $("#playing_radio").empty();

        });

        $('#reset').on('click', function(event){
            $.post("reset", {"id": 1}, function (response) {
                //nada
                loadProfile(1)
            });
        });

        $('#current_radio_name').on('click', function(event){
            $("#radio_section").hide();
            $("#black_radiobutton").show();
            $("#gray_radiobutton").hide();
            $("#playing_radio").empty();
            radio=false;
            $("#search_bar").show();
        });


        $("#love").on('click', function(event){
            console.log("love it");
            $('#liked').show();
            $('#like').hide();
            $('#disliked').hide();
            $('#dislike').show();
            $('#play').hide();
            $('#pause').show();
            $("#saved_likes").append($("#playing_track").html());  
            // TODO: adjust radio
            var t = rotation.currentTrack();
            $.post("likes", {"id": t.soundcloud_id}, function (response) {
                //nada
            });
            if(radio){
                $.post("likeupdateradio", {"id": t.soundcloud_id}, function (response) {
                //nada
                });
                $.post("getRadio", {"id": 1}, function (response) {
                var data=JSON.parse(response);
                //console.log(data);
                var l = data.length;
                var results = [];
                $("#saved-list").text("");


                //seed
                results.push({"title":t.title,"song_url": t.song_url,"soundcloud_id":t.soundcloud_id});
                $.post("playupdateradio", {"id": t.soundcloud_id}, function (response) {
                      //need to update seed item as played in radio
                });
                var i=0;
                for (i=0; i<l; i++) {
                   //console.log(data[i])
                   var track_id = data[i]['tid'];
                   user_name = data[i]['username'];
                   title = data[i]['title'];
                   song_url = ""

                   var art = data[i]['artwork_url'];
                   //console.log(art);

                   if (art=="https://a1.sndcdn.com/images/default_avatar_large.png"){
                        art = "../img/soundcloud5.png"
                   }

                
                   //console.log("should be playing" + track_id +" "+ title);
                   results.push({"title": user_name+" - "+title,"song_url": song_url,"soundcloud_id":track_id});
                   if (i>0){//don't skip the first track 
                    $("#saved-list").append('<li id="'+i+'" class="res" ><a href="#"><img id="res'+i+'" class="preview_img" src="../img/soundcloud5.png" width="30" alt=""><span class="resname">'+user_name+'<br><span class="restitle">'+title+'</span></span></a></li>'); 
                    }
                    loadImage("res"+i, "src", art, "../img/soundcloud5.png", 30, 30);
                }

                var dur = currentPlayingTrack.getDur();
                var pos = currentPlayingTrack.getPosition();
                var ff = pos/dur 
                console.log(dur, ff, pos);
                currentPlayingTrack.stop();
                rotation = new Rotation(results);
                currentTrack = rotation.currentTrack();
                currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true);
                currentPlayingTrack.play();
                //currentPlayingTrack.setPos(ff, pos); # Error with line set :-(

                $("li").click(function( event ) {
                    /*if(event.currentTarget.id =="nav_home" 
                        || event.currentTarget.id =="nav_search"
                        || event.currentTarget.id =="nav_radios")
                    {*/
                        //do nothing
                    
                    if(event.currentTarget.classList[0]=="res") {
                        $('#play').hide();
                        $('#pause').show();
                        $("#pb_pause").show();
                        $("#pb_play").hide();
                        $('#liked').hide();
                        $('#like').show();
                        $('#disliked').hide();
                        $('#dislike').show();
                        playing=true;
                        console.log(event);
                        var pos = parseInt(event.currentTarget.id);
                        $('.res:nth-of-type(odd)').css({'background-color' : 'white'});
                        $('.res:nth-of-type(even)').css({'background-color' : 'white'});
                        $('.res:nth-of-type('+(pos)+')').css({'background-color' : '#E9E9E9'});
                        /*$('li:nth-child(even)').css({'background-color' : 'white'});
                        $('li:nth-child(odd)').css({'background-color' : 'white'});
                        $('li:nth-child('+(pos+1)+')').css({'background-color' : '#E9E9E9'});
                        $('li:nth-child('+(pos+1)+')').css({'color' : 'red'});
                        */

                        console.log(event.currentTarget);
                        currentPlayingTrack.stop();
                        //rotation = new Rotation(results);
                        rotation.goTo(pos+1);
                        currentTrack = rotation.currentTrack();
                        currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true);
                        currentPlayingTrack.play();
                        $('.trackTitle').html(currentTrack.title); 
                        //$("#gray_radiobutton").hide();
                        //$("#black_radiobutton").show();
                        //console.log('hallo?')
                        //$("#search_frame").show();
                        //$("#radio_section").hide();
                        //$("#playing_radio").empty();
                        //radio=false;
                    }
                });
            
            });

            }
        });

        $("#unlove").on('click', function(event){
            console.log("unloved");
            $('#like').show();
            $('#liked').hide();
            // TODO: adjust radio
        });

        $("#hate").on('click', function(event){
            $('#disliked').show();
            $('#dislike').hide();
            $('#like').show();
            $('#liked').hide();
            console.log("hate it");
            $("#saved_hates").append($("#playing_track").html());
            // TODO: adjust radio
            var t = rotation.currentTrack();
            $.post("hates", {"id": t.soundcloud_id}, function (response) {
                //nada
            });
            if(radio){
                $.post("hateupdateradio", {"id": t.soundcloud_id}, function (response) {
                //nada
                });
                $.post("getRadio", {"id": 1}, function (response) {
                var data=JSON.parse(response);
                //console.log(data);
                var l = data.length;
                var results = [];
                $("#saved-list").text("");


                //seed
                results.push({"title":t.title,"song_url": t.song_url,"soundcloud_id":t.soundcloud_id});
                $.post("playupdateradio", {"id": t.soundcloud_id}, function (response) {
                      //need to update seed item as played in radio
                });
                var i=0;
                for (i=0; i<l; i++) {
                   //console.log(data[i])
                   var track_id = data[i]['tid'];
                   user_name = data[i]['username'];
                   title = data[i]['title'];
                   song_url = ""

                   var art = data[i]['artwork_url'];
                   //console.log(art);

                   if (art=="https://a1.sndcdn.com/images/default_avatar_large.png"){
                        art = "../img/soundcloud5.png"
                   }

                
                   //console.log("should be playing" + track_id +" "+ title);
                   results.push({"title": user_name+" - "+title,"song_url": song_url,"soundcloud_id":track_id});
                   if (i>0){//don't skip the first track 
                    $("#saved-list").append('<li id="'+i+'" class="res" ><a href="#"><img id="res'+i+'" class="preview_img" src="../img/soundcloud5.png" width="30" alt=""><span class="resname">'+user_name+'<br><span class="restitle">'+title+'</span></span></a></li>'); 
                    }
                    loadImage("res"+i, "src", art, "../img/soundcloud5.png", 30, 30);
                }

                var dur = currentPlayingTrack.getDur();
                var pos = currentPlayingTrack.getPosition();
                var ff = pos/dur 
                console.log(dur, ff, pos);
                currentPlayingTrack.stop();
                rotation = new Rotation(results);
                currentTrack = rotation.currentTrack();
                currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true);
                currentPlayingTrack.play();
                //currentPlayingTrack.setPos(ff, pos); # Error with line set :-(

                $("li").click(function( event ) {
                    /*if(event.currentTarget.id =="nav_home" 
                        || event.currentTarget.id =="nav_search"
                        || event.currentTarget.id =="nav_radios")
                    {*/
                        //do nothing
                    
                    if(event.currentTarget.classList[0]=="res") {
                        $('#play').hide();
                        $('#pause').show();
                        $("#pb_pause").show();
                        $("#pb_play").hide();
                        $('#liked').hide();
                        $('#like').show();
                        $('#disliked').hide();
                        $('#dislike').show();
                        playing=true;
                        console.log(event);
                        var pos = parseInt(event.currentTarget.id);
                        $('.res:nth-of-type(odd)').css({'background-color' : 'white'});
                        $('.res:nth-of-type(even)').css({'background-color' : 'white'});
                        $('.res:nth-of-type('+(pos)+')').css({'background-color' : '#E9E9E9'});
                        /*$('li:nth-child(even)').css({'background-color' : 'white'});
                        $('li:nth-child(odd)').css({'background-color' : 'white'});
                        $('li:nth-child('+(pos+1)+')').css({'background-color' : '#E9E9E9'});
                        $('li:nth-child('+(pos+1)+')').css({'color' : 'red'});
                        */

                        console.log(event.currentTarget);
                        currentPlayingTrack.stop();
                        //rotation = new Rotation(results);
                        rotation.goTo(pos+1);
                        currentTrack = rotation.currentTrack();
                        currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true);
                        currentPlayingTrack.play();
                        $('.trackTitle').html(currentTrack.title); 
                        //$("#gray_radiobutton").hide();
                        //$("#black_radiobutton").show();
                        //console.log('hallo?')
                        //$("#search_frame").show();
                        //$("#radio_section").hide();
                        //$("#playing_radio").empty();
                        //radio=false;
                    }
                });
            
            });
            }
        });

        $("#unhate").on('click', function(event){
            console.log("unhated");
            $('#dislike').show();
            $('#disliked').hide();
            // TODO: adjust radio
        });

        $('#logo').on('click', function(event){
            $('#nav_home').trigger("click");
        });

        $('#nav_home').on('click', function(event){
            $("#nav_home").addClass("active");
            $("#nav_search").removeClass("active");
            $("#nav_radios").removeClass("active");
            $("#music_section").show();
            //$("#search_frame").hide();
            $("#play-bar-frame").hide();
            $("#profile_frame").hide();
            if(radio){
                $("#search_bar").hide();
                $("#radio_section").show();
            }
        });

         $('#nav_radios').on('click', function(event){
            $("#nav_home").removeClass("active");
            $("#nav_search").removeClass("active");
            $("#nav_radios").addClass("active");
            //$("#search_frame").hide();
            $("#music_section").hide();
            $("#play-bar-frame").show();
            $("#radio_section").hide();
            $("#search_bar").show();
            $("#profile_frame").show();
        });

        $('#nav_search').on('click', function(event){
            $("#nav_home").removeClass("active");
            $("#nav_search").addClass("active");
            $("#nav_radios").removeClass("active");
            $("#music_section").hide();
            //$("#search_frame").show();
            $("#play-bar-frame").show();
            $("#radio_section").hide();
            $("#search_bar").show();
            $("#profile_frame").hide();
        });

        $('#black_radiobutton').on('click', function(event){
            var t = rotation.currentTrack();
            $.post("startsradio", {"id": t.soundcloud_id}, function (response) {
                //nada
            });
            $.post("storeradio", {"id": t.soundcloud_id}, function (response) {
                //nada
            });

            console.log("startRadio("+t.title+")");
            //$("#current_radio_name").html('<a class="radio_click" id="radio_click" href="#">Radio based on: ' +t.title+'</a>');
            if(screen.width<600){
                $("#current_radio_name").html('Radio based on:<br> ' +t.title);
                
            }else{
                //$("#current_radio_name").html('Radio based on: ' +t.title);
                $("#search_input").val('Radio based on: ' +t.title);
            }
            $("#playing_radio").empty();
            $("#playing_radio").append($("#playing_track").html()); 
            $("#saved_radios").append($("#playing_track").html());     
            $("#radio_section").show();
            $("#gray_radiobutton").show();
            $("#black_radiobutton").hide();
            $('#liked').hide();
            $('#like').show();

            //$("#radio_section").show();
            //$("#reco_frame").show()
            //$("#search_bar").hide();
            //$("#search_frame").hide();

            radio=true;

            $.post("getRecos2", {"id": t.soundcloud_id}, function (response) {
                var data=JSON.parse(response);
                //console.log(data);
                var l = data.length;
                var results = [];
                $("#saved-list").text("");


                //seed
                results.push({"title":t.title,"song_url": t.song_url,"soundcloud_id":t.soundcloud_id});
                $.post("playupdateradio", {"id": t.soundcloud_id}, function (response) {
                      //need to update seed item as played in radio
                });
                var i=0;
                for (i=0; i<l; i++) {
                   //console.log(data[i])
                   var track_id = data[i]['tid'];
                   user_name = data[i]['username'];
                   title = data[i]['title'];
                   song_url = ""

                   var art = data[i]['artwork_url'];
                   //console.log(art);

                   if (art=="https://a1.sndcdn.com/images/default_avatar_large.png"){
                        art = "../img/soundcloud5.png"
                   }

                
                   //console.log("should be playing" + track_id +" "+ title);
                   results.push({"title": user_name+" - "+title,"song_url": song_url,"soundcloud_id":track_id});
                   if (i>0){//don't skip the first track 
                    $("#saved-list").append('<li id="'+i+'" class="res" ><a href="#"><img id="res'+i+'" class="preview_img" src="../img/soundcloud5.png" width="30" alt=""><span class="resname">'+user_name+'<br><span class="restitle">'+title+'</span></span></a></li>'); 
                    }
                    loadImage("res"+i, "src", art, "../img/soundcloud5.png", 30, 30);
                }




                currentPlayingTrack.stop();
                rotation = new Rotation(results);
                rotation.goTo(1);
                currentTrack = rotation.currentTrack();
                currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true);
                currentPlayingTrack.play();
                $("#pause").show();
                $("#play").hide();

                $("li").click(function( event ) {
                    /*if(event.currentTarget.id =="nav_home" 
                        || event.currentTarget.id =="nav_search"
                        || event.currentTarget.id =="nav_radios")
                    {*/
                        //do nothing
                    
                    if(event.currentTarget.classList[0]=="res") {
                        $('#play').hide();
                        $('#pause').show();
                        $("#pb_pause").show();
                        $("#pb_play").hide();
                        $('#liked').hide();
                        $('#like').show();
                        $('#disliked').hide();
                        $('#dislike').show();
                        playing=true;
                        console.log(event);
                        var pos = parseInt(event.currentTarget.id);
                        $('.res:nth-of-type(odd)').css({'background-color' : 'white'});
                        $('.res:nth-of-type(even)').css({'background-color' : 'white'});
                        $('.res:nth-of-type('+(pos)+')').css({'background-color' : '#E9E9E9'});
                        /*$('li:nth-child(even)').css({'background-color' : 'white'});
                        $('li:nth-child(odd)').css({'background-color' : 'white'});
                        $('li:nth-child('+(pos+1)+')').css({'background-color' : '#E9E9E9'});
                        $('li:nth-child('+(pos+1)+')').css({'color' : 'red'});
                        */

                        console.log(event.currentTarget);
                        currentPlayingTrack.stop();
                        //rotation = new Rotation(results);
                        rotation.goTo(pos+1);
                        currentTrack = rotation.currentTrack();
                        currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true);
                        currentPlayingTrack.play();
                        $('.trackTitle').html(currentTrack.title); 
                        //$("#gray_radiobutton").hide();
                        //$("#black_radiobutton").show();
                        //console.log('hallo?')
                        //$("#search_frame").show();
                        //$("#radio_section").hide();
                        //$("#playing_radio").empty();
                        //radio=false;
                    }
                });
            
            });
        });

        $('#datepicker').datepicker({
           onSelect: function(dateText, inst) { 
            console.log("Date selected: "+dateText);
            loadEvents(dateText);
            }
        });

        $("#search-form").submit(function(){ // TODO: store search history
            var query = $("#search_input").val();
            console.log("Search for '"+query+'"');
            $("#saved_searches").append('<li id="recent_search" class="recent_search" ><a href="#" class="recent_search" id="recent_search">'+query+'</a></li>');
            $("#search_results").hide();
            $("#profile_frame").hide();
            $("#search_heading").html("Searching for '"+query+"'...");
            /*var timeInMs = Date.now();
            var search_event = JSON.stringify({time: timeInMs, q: query});
            addToLS("search_history", search_event);
            $("#search_history").prepend(search_event);*/
            //htmlAdd($"#search_history", search_event);
            $("#search_input").blur();
            $("#search_input").css("color","gray"); 
            $("#search_input").css("font-family","Courier");
            //$("#search_frame").show();
            //$("#reco_frame").hide();
            $("#radio_section").hide();
            $("#gray_radiobutton").hide();
            $("#black_radiobutton").show();
            var t = rotation.currentTrack();
            $.post("stopsradio", {"id": 1}, function (response) {
                //nada
            });
        
            $.post("search", {"q": query}, function (response) {
                var data=response;
                //console.log(data);
                var l = data.length;
                var results = [];
                $("#saved-list").text("");
                //$("#search_heading").html("<h3>"+l+" results for '"+query+"': "+"<a href=\"#\"><img class=\"close_search\" src=\"img/icons/kill.png\" width=\"15px\"></a></h3>");
                //$("#search_heading").html("<h3>"+l+" results for '"+query+"': </a></h3>");
                
                if(l>0){
                    $("#search_heading").text("");
                    $("#search_results").css("top","0px");
                }else{
                    $("#search_heading").text("No results for '"+query+"'");
                    $("#search_heading").css("top","18px");
                }

                $("#search_results").show();
                var i=0;

                var t = rotation.currentTrack();
                results.push({"title": t.title,"song_url": t.song_url,"soundcloud_id":t.soundcloud_id});

                for (i=0; i<l; i++) {
                   var title = data[i].title;
                   var track_id = data[i].id;
                   var song_url = data[i].permalink_url;
                   var dur = data[i].duration;
                   var min = Math.floor((dur/1000/60) << 0);
                   var sec = zeroPad(Math.floor((dur/1000) % 60),2);

                   var user_name = data[i].user.username.charAt(0).toUpperCase() + data[i].user.username.slice(1);
                   var art = data[i].artwork_url;
                   if (art ==null){                     
                     art = data[i].user.avatar_url;
                   }
                   if (art=="https://a1.sndcdn.com/images/default_avatar_large.png"){
                        art = "../img/soundcloud5.png"
                    }
                   


                   title=title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
                   user_name=user_name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
                   

                   results.push({"title": user_name+" - "+title,"song_url": song_url,"soundcloud_id":track_id});
                   //console.log('<li id="'+i+'"><a href="#">'+user_name+" - "+title+' ['+min+':'+sec+']</a></li>');
                   //$("#search_results").append("<a href=\"javascript:nthResult("+i+")\">"+title+"</a><br>"); // how to link to play?
                   
                   $("#saved-list").append('<li id="'+i+'" class="res" ><a href="#"><img id="res'+i+'" class="preview_img" src="" width="30" alt=""><span class="resname">'+user_name+'<br><span class="restitle">'+title+' ['+min+':'+sec+']</span></span></a></li>'); 
                   loadImage("res"+i, "src", art, "../img/soundcloud5.png", 30, 30);
                }


                currentPlayingTrack.stop();
                rotation = new Rotation(results);
                rotation.goTo(1);
                currentTrack = rotation.currentTrack();
                currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true);
                currentPlayingTrack.play();
                $('.trackTitle').html(currentTrack.title); 
                $("#gray_radiobutton").hide();
                $("#black_radiobutton").show();
                //console.log('hallo?')
                //$("#search_frame").show();
                $("#radio_section").hide();
                $("#playing_radio").empty();
                radio=false;
                $("#play").hide();
                $("#pause").show();

                $("li").click(function( event ) {
                    console.log("res event "+event.currentTarget.classList[0])
                /*if(event.currentTarget.id =="nav_home" 
                    || event.currentTarget.id =="nav_search"
                    || event.currentTarget.id =="nav_radios")
                {
                    //do nothing*/
                    if(event.currentTarget.classList[0]=="res") {
                        $('#play').hide();
                        $('#pause').show();
                        $("#pb_pause").show();
                        $("#pb_play").hide();
                        $('#liked').hide();
                        $('#like').show();
                        $('#disliked').hide();
                        $('#dislike').show();
                        playing=true;
                        console.log(event);
                        var pos = parseInt(event.currentTarget.id);
                        $('.res:nth-of-type(odd)').css({'background-color' : 'white'});
                        $('.res:nth-of-type(even)').css({'background-color' : 'white'});
                        $('.res:nth-of-type('+(pos+1)+')').css({'background-color' : '#E9E9E9'});
                        /*$('li:nth-child(even)').css({'background-color' : 'white'});
                        $('li:nth-child(odd)').css({'background-color' : 'white'});
                        $('li:nth-child('+(pos+1)+')').css({'background-color' : '#E9E9E9'});
                        $('li:nth-child('+(pos+1)+')').css({'color' : 'red'});
                        */

                        console.log(event.currentTarget);
                        
                        currentPlayingTrack.stop();
                        rotation.goTo(pos+1);
                        currentTrack = rotation.currentTrack();
                        currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true);
                        currentPlayingTrack.play();

                        /*currentPlayingTrack.stop();
                        rotation = new Rotation(results);
                        rotation.goTo(pos);
                        currentTrack = rotation.currentTrack();
                        currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true);
                        currentPlayingTrack.play();
                        $('.trackTitle').html(currentTrack.title); 
                        $("#gray_radiobutton").hide();
                        $("#black_radiobutton").show();
                        //console.log('hallo?')
                        //$("#search_frame").show();
                        $("#radio_section").hide();
                        $("#playing_radio").empty();
                        radio=false;*/
                    }
                });
            });

            return false;
        });

    $('#nav_home').trigger("click");


    });
