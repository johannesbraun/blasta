
function loadSong(track_id){
		console.log("loadSong("+track_id+")");

		getInfo(track_id);
		
		//if(navigator.platform !=="MacIntel"){
		
		/*var artwork = "false";
		var comments = "true";
		var iframe = "<iframe id=\"soundcloud_widget\" src=\"https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/"+track_id+"&amp;auto_play=true&amp;hide_related=true&amp;show_comments="+comments+"&amp;show_user=false&amp;show_reposts=false&amp;visual=false&show_artwork="+artwork+"&liking=false&sharing=false&download=false&buying=false&show_playcount=false&singleplay=true&color=FF7538\" width=\""+width+"\" height=\""+height+"\" frameborder=\"no\"></iframe>";
		*/

		defer(function () {//make sure everything is loaded
		var dur = localStorage.duration;
		var min = Math.floor((dur/1000/60) << 0);
		var sec = Math.floor((dur/1000) % 60);


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

		//$("#music_frame").html(iframe);
		$("#wave").html('<img class="waveform_url" id="waveform_url" src="'+localStorage.waveform_url+'" width="'+w_width+'" height="'+w_height+'" alt="wave">');
		
		//$("#wave").css("background-image", "url("+localStorage.waveform_url+")");
		//$("#wave").css("background-size", "100%");

		

		$("#artwork").html('<img id="artwork_url" src="'+localStorage.artwork_url+'" width="'+a_width+'" height="'+a_height+'" alt="art">')
		//$("#artwork").html('<img id="artwork_url" src="'+localStorage.artwork_url+'" alt="art">')
		
		$("#wavebackground").css("background", "#777777");
		
		$("#track_title").html(localStorage.current_title + " ["+min+":"+sec+"]");

		if(localStorage.current_radio !== undefined){
			stopRadio();//TODO: move
		}
		setLS("loaded", "false");
		});
		
}
		

function defer(method) {
    if (localStorage.loaded === "true"){
        method();
	}
    else{
    	$("#track_title").html("loading...");
    	console.log("waiting 50ms for localStorage to load ...")
    	setTimeout(function() { defer(method) }, 50);
    }
}


function defers(method) {
    if (localStorage.last_track_index !== localStorage.current_track_index){
        method();
	}
    else{
    	$("#track_title").html("loading...");
    	console.log("waiting 50ms for localStorage to load ...")
    	setTimeout(function() { defers(method) }, 200);
    }
}



function animate(){
	//todo
}

function getInfo(track_id){
		console.log("getInfo("+track_id+")");
			var timeInMs = Date.now(); //better here ?
			$.post("getTrackInfo", {"id":track_id, "time": timeInMs}, function (response) {
    			//this callback is called with the server responds 
        		//console.log("We posted and the server responded!"); 
        		insertInfoIntoLS(response, track_id, timeInMs);
        		logToProfile();
    		});
			
		};

function logToProfile(){
		$("#current_track").text(localStorage.current_track);
		$("#track_history").prepend(localStorage.current_track+"<br>");
}


function insertInfoIntoLS(data, track_id, timeInMs){
		console.log("insertInfoIntoLS(data, "+track_id+", time)");
		//console.log(data.user);
		var art = data.artwork_url;
		var title = data.title;
		var duration = data.duration;
		var waveform_url = data.waveform_url;
		var permalink_url = data.permalink_url;
		var avatar_url = data.user.avatar_url;

		setLS("duration",duration);
		setLS("current_track",JSON.stringify({time: timeInMs, id: track_id, name: title}));

		addToLS("track_history",localStorage.current_track);
		
		setLS("current_track_id",track_id);
		setLS("current_title",title);


		if(art === null){
			setLS("artwork_url",avatar_url);
		}else{
			setLS("artwork_url",art);
		}

		setLS("waveform_url",waveform_url);

		setLS("permalink_url",permalink_url);


		setLS("loaded","true");
}




	Track = function (trackId){
        var currentTrack = "";
        var nextTrack ="";
        var currentTrackTitle="";
        var currentIndex =0;
        var nextTrackIndex = 0;
        var l =0;


        loadSong(trackId);

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

        console.log("duration: "+ localStorage.duration);

		/*var line = new ProgressBar.Line('#container', {
			color: '#FF6600',
			duration: localStorage.duration,
			strokeWidth: 17,
		});
		var lineProgress =0;*/


        this.play = function() {
            currentTrack.play();
            //line.set(lineProgress);
            //line.animate(1);
        };

        this.pause = function() {
            currentTrack.pause();
            //line.stop();
            //lineProgress = line.value(); 
        };

        this.stop = function() {
            currentTrack.stop();
            //line.stop();
            //line.set(0);
            //lineProgress=0;
        };

        next = function(){
            console.log("next");
            currentTrack.stop();

            //line.stop();
            //line.set(0);
            //lineProgress=0;

            currentIndex = parseInt(localStorage.current_track_index);
            
            
            

            l = JSON.parse(localStorage.playlist).length;
            
            nextTrackIndex =0;
            if(currentIndex<l){
                nextTrackIndex = currentIndex + 1; 
            }
            currentTrack = JSON.parse(localStorage.playlist)[nextTrackIndex];
            
            console.log(currentTrack);
            
            setLS("current_track_index", nextTrackIndex);
            setLS("last_track_index", nextTrackIndex);

			//console.log("line:"+line);
			//line.destroy();
			//$("#container").text("");
		
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

			
            currentIndex = parseInt(localStorage.current_track_index);
            l = JSON.parse(localStorage.playlist).length;
            
            nextTrackIndex =0;
            if(currentIndex>0){
                nextTrackIndex = currentIndex - 1; 
            }
            currentTrack = JSON.parse(localStorage.playlist)[nextTrackIndex];
            
            console.log(currentTrack);
            
            setLS("current_track_index", nextTrackIndex);

            currentTrack = new Track(currentTrack.soundcloud_id);
            currentTrack.play();
        }

    };

 Stream = function (tracks){
		//

		return currentPlayingTrack;
	}


var main = function () {
    "use strict";

	$(document).ready( function() {
		
		clearHistory();

		setLS("profile_frame","hidden"); 
		// get tracks from mongodb
		// key: current_id, value: list of candidates
		
		var tracks = [{"title":"Digitalism - Blitz","song_url":"https://soundcloud.com/linamescobarr/15-digitalism-blitz","soundcloud_id":"38843238"},{"title":"Paul Laklbrenner - Sky And Sand (Feat. Fritz Kalkbrenner)","song_url":"https://soundcloud.com/paulkalkbrenner/paul-kalkbrenner-sky-and","soundcloud_id":"37032471"},{"title":"Sad Trombone2","song_url":"https://soundcloud.com/sheckylovejoy/sad-trombone","soundcloud_id":"18321000"},{"title":"Sad Trombone3","song_url":"https://soundcloud.com/sheckylovejoy/sad-trombone","soundcloud_id":"18321000"},{"title":"AraabMUZIK - \"Beauty\"","song_url":"  https://soundcloud.com/selftitledmag/araabmuzik-beauty","soundcloud_id":"79408289"}]
        

		var currentTrack = tracks[0];
        var track_id =  tracks[0].soundcloud_id;

		// init 
		// put {key:user, value:currenttrack} into redis 
		// if I have very few users that will mean <25MB

        setLS("current_track_index", 0);
        setLS("last_track_index", 0);

        setLS("playlist",JSON.stringify(tracks));

        // GO!
        //defer2(function(){
        var currentPlayingTrack = new Track(track_id);

        $('#play').on('click', function(event){
            console.log('play');
            currentPlayingTrack.play();
            //$('.trackTitle').html(currentTrack.title);
            $('#pause').show();
            $('#play').hide();

        });

        $('#pause').on('click', function(event){
            console.log('pause');
            currentPlayingTrack.pause();
            $('#pause').hide();
            $('#play').show();

        });

        $('#stop').on('click', function(event){
            console.log('stop');
            currentPlayingTrack.stop();
            $('#pause').hide();
            $('#play').show();
        });


        $('#next').on('click', function(event){
            console.log('next');
            $('#pause').show();
            $('#play').hide();
            currentPlayingTrack.nextTrack();

        });

        $('#back').on('click', function(event){
            console.log('back');
            $('#pause').show();
            $('#play').hide();
            currentPlayingTrack.previousTrack();

        });

        $("#search_results").on('click', function(event){
            console.log('srp');
           	$('#pause').show();
            $('#play').hide();
            /*var posX = $(this).offset().left,
            posY = $(this).offset().top;
            alert(event.pageX + ' , ' + event.pageY) ;
        	alert((event.pageX - posX) + ' , ' + (event.pageY - posY));*/
        	defers(function () {
        		currentPlayingTrack.nextTrack();
        		localStorage.search_ready = "false";
        	});

        });


			$("#loves").text(localStorage.loves);
			$("#hates").text(localStorage.hates);
			$("#track_history").text(localStorage.track_history);
			$("#search_history").text(localStorage.search_history);
			$("#radio_history").text(localStorage.radio_history);


		$("#search-form").submit(function(){ // TODO: store search history
			clear();
			hideProfile(); 
			var query = $("#search_input").val();
			console.log("Search for '"+query+'"');
			$("#search_heading").html("<h3>Searching for '"+query+"'...</h3>");
			var timeInMs = Date.now();
			var search_event = JSON.stringify({time: timeInMs, q: query});
			addToLS("search_history", search_event);
			$("#search_history").prepend(search_event);
			//htmlAdd($"#search_history", search_event);
			$("#search_input").blur();
			$("#search_input").css("color","gray"); 
			$("#search_input").css("font-family","Courier");
			$.post("search", {"q": query}, function (response) {
				insertResultsIntoDOM(response, query);
			});
			showSearch();
			return false;
		});

	});
};

function nthResult(n, callback){
	setLS("current_track_index",(parseInt(n)-1));
}


function getPageData(page,wait,extra_data,callback) {
    if (localStorage.getItem(unique_param+page)) {
        callback(localStorage.getItem(unique_param+page, extra_data));
    } else {
        if (typeof(extra_data) == 'undefined') {extra_data = '';}
        $.post(server_path + 'index.php?module=API&pname=' + page + '&pmode=empg&application_id=' + application_id + extra_data,
                function(response) {
                    localStorage.setItem(unique_param+page,JSON.stringify(response));
                    callback(response);
                }
        ,'json'
        );
    }
}


function insertResultsIntoDOM (data, query) {
		console.log("insertResultsIntoDOM(data, "+query+")");
        var l = data.length;
        var results = [];
        $("#search_heading").html("<h3>"+l+" results for '"+query+"': "+"<a href=\"javascript:hideSearch()\">[x]</a></h3>");
        var i=0;
        for (i=0; i<l; i++) {
           var title = data[i].title;
           var track_id = data[i].id;
           var song_url = data[i].permalink_url;
           results.push({"title":title,"song_url": song_url,"soundcloud_id":track_id});
           //console.log(title);
           $("#search_results").append("<a href=\"javascript:nthResult("+i+")\">"+title+"</a><br>"); // how to link to play?
        }
        $("#search_frame").show();
        setLS("playlist",JSON.stringify(results));
        setLS("current_track_index",0);
        setLS("last_track_index", 0);
        localStorage.search_ready = "false";

    };

function startRadio(id){
			console.log("startRadio("+id+")");
			
			//------------
			//html
			//------------
			//top display:
			var t = JSON.parse(localStorage.current_track).name;
			$("#current_radio_name").html(t);
			$("#radio_section").show();
			$("#gray_radiobutton").show();
			$("#black_radiobutton").hide();
			// in profile:
			$("#current_radio").html(localStorage.current_track);
			//in history
			$("#radio_history").prepend(localStorage.current_track);

			//------------
			//localStorage
			//------------
			setLS("current_radio",localStorage.current_track);
			addToLS("radio_history",localStorage.current_track);
	};


function stopRadio(){
			console.log("stopRadio()");
			
			//------------
			//html
			//------------
			
			//top display:
			$("#current_radio_name").text("");
			$("#radio_section").hide();
			$("#gray_radiobutton").hide();
			$("#black_radiobutton").show();
			// in profile:
			$("#current_radio").text("");
			//------------
			//localStorage
			//------------
			dropFromLS("current_radio");
};



// takes item and appends it to localStorage.name
function addToLS(name, item){
	console.log("addToLS("+name+", " +item+")");
	var arr = [];
		if (typeof localStorage[name] !== 'undefined'){ 
			arr = [localStorage[name]];
			arr.unshift(item);
			localStorage[name] = arr;
		}else{
			localStorage[name] = item;
		}
}

// takes item and appends it to localStorage.name
function setLS(name, item){
		console.log("setLS("+name+", " +item+")");
		localStorage[name] = item;
}


function htmlAdd(name, item){
	if(name.text()=== ""){
		name.html(item)
	}else{
		name.prepend(item + "<br>")
	}
}


function dropFromLS(name){
	console.log("dropFromLS("+name+")");
	delete localStorage[name];
}

function clear(){
			$("#search_heading").text("");
			$("#search_results").text("")
		};


/*
function play(){
	console.log("play()");
	var widget = SC.Widget(document.getElementById('soundcloud_widget'));
	setTimeout(function (){
		console.log("go");
		widget.toggle();
	},3000);
	//widget["play"](true);
}


function love(){
	console.log("love()");
	$("#loves").prepend(localStorage.current_track);
	addToLS("loves", localStorage.current_track);
}

function hate(){
	console.log("hate()");
	$("#hates").prepend(localStorage.current_track);
	addToLS("hates", localStorage.current_track);
	skip(3);
}

function next(iphone){

	console.log("next()");
	if(iphone){
		var widget = SC.Widget(document.getElementById('soundcloud_widget'));
		widget.next();
	}else{
		playSong(37032471);
	}


	/*var newSoundUrl = "https://api.soundcloud.com/tracks/37032471"
	var options = {	auto_play: false,
					buying: false,			
					liking: false,			
					download: false,		
					sharing: false,			
					show_artwork: false,	
					show_comments: false,	
					show_playcount: false,	
					show_user: false		
					//start_track: 0
				}
	widget.load(newSoundUrl, options)
	//https://developers.soundcloud.com/blog/html5-widget-api
}


function skip(n){
	console.log("skip("+n+")");
	var widget = SC.Widget(document.getElementById('soundcloud_widget'));
	widget.skip(n);
	//playSong(37032471);
}*/

function toggleProfile(){
	console.log("profile_toggle()");
	if (localStorage.profile_frame === "visible"){
		$("#profile_frame").hide();
		setLS("profile_frame","hidden"); 
	}else {
		hideSearch();
		$("#profile_frame").show();
		setLS("profile_frame","visible"); 
	};
}

function hideProfile(){
	console.log("hideProfile()");
	$("#profile_frame").hide();
	setLS("profile_frame","hidden"); 
}

function hideSearch(){
	console.log("hideSearch()");
	$("#search_frame").hide();
	setLS("search_frame","hidden"); 
}

function showSearch(){
	console.log("showSearch()");
	$("#search_frame").show();
	setLS("search_frame","visible"); 
}

function clearHistory(){
	dropFromLS("loves");
	dropFromLS("hates");
	dropFromLS("radio_history");
	dropFromLS("search_history");
	$("#loves").text("");
	$("#hates").text("");
	$("#search_history").text("");
	$("#radio_history").text("");
	setLS("track_history",localStorage.current_track);
	$("#track_history").text(localStorage.current_track);
}



$(document).ready(main);

