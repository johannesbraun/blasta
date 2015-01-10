
function loadSong(track_id){
		console.log("playSong("+track_id+")");

		getInfo(track_id);
		
		//if(navigator.platform !=="MacIntel"){
		
		/*var artwork = "false";
		var comments = "true";
		var iframe = "<iframe id=\"soundcloud_widget\" src=\"https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/"+track_id+"&amp;auto_play=true&amp;hide_related=true&amp;show_comments="+comments+"&amp;show_user=false&amp;show_reposts=false&amp;visual=false&show_artwork="+artwork+"&liking=false&sharing=false&download=false&buying=false&show_playcount=false&singleplay=true&color=FF7538\" width=\""+width+"\" height=\""+height+"\" frameborder=\"no\"></iframe>";
		*/

		var line = new ProgressBar.Line('#container', {
			color: '#FF6600',
			duration: localStorage.duration,
			strokeWidth: 16.5,
		});

		line.animate(1);


		//$("#music_frame").html(iframe);

		$("#wave").html('<img id="waveform_url" src="'+localStorage.waveform_url+'" width="600" height="100" alt="wave">')
		
		$("#track_title").html(localStorage.current_title + " ["+localStorage.duration/60000+"]");

		if(localStorage.current_radio !== undefined){
			stopRadio();//TODO: move
		}
		
		};

function getInfo(track_id){
		console.log("getInfo("+track_id+")");
			var timeInMs = Date.now(); //better here ?
			$.post("getTrackInfo", {"id":track_id, "time": timeInMs}, function (response) {
    			//this callback is called with the server responds 
        		//console.log("We posted and the server responded!"); 
        		insertInfoIntoLS(response, track_id, timeInMs);
    		});
			
		};

function insertInfoIntoLS(data, track_id, timeInMs){
		console.log("insertInfoIntoLS(data, "+track_id+", time)");
		var art = data.artwork_url;
		var title = data.title;
		var duration = data.duration;
		var waveform_url = data.waveform_url;
		setLS("current_track",JSON.stringify({time: timeInMs, id: track_id, name: title}));
		$("#current_track").text(localStorage.current_track);
		//TODO: pretty history, unique?, group?
		$("#track_history").prepend(localStorage.current_track+"<br>");
		addToLS("track_history",localStorage.current_track);
		setLS("artwork_url",art);
		setLS("duration",duration);
		setLS("waveform_url",waveform_url);
		setLS("current_title",title);

}

function startRadio(id){
			console.log("startRadio("+id+")");
			
			//------------
			//html
			//------------
			//top display:
			var t = JSON.parse(localStorage.current_track).name;
			$("#current_radio_name").html('<a class="radio_name">'+t+'</a>');
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

function insertResultsIntoDOM (data, query) {
		console.log("insertResultsIntoDOM(data, "+query+")");
        var l = data.length;
        $("#search_heading").html("<h3>"+l+" results for '"+query+"': "+"<a href=\"javascript:hideSearch()\">[x]</a></h3>");
        var i=0;
        for (i=0; i<l; i++) {
           var title = data[i].title;
           var track_id = data[i].id;
           //console.log(title);
           $("#search_results").append("<a href=\"javascript:playSong("+track_id+");\">"+title+"</a><br>"); // how to link to play?
        }
        $("#search_section").show();
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


function iphoneApp(){
	console.log("iphoneApp()");
	var iframe = '<iframe id=\"soundcloud_widget\" width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/4210067&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false&amp;visual=false&liking=false&sharing=false&download=false&buying=false&show_playcount=false&singleplay=true&color=FF7538"></iframe>';
	$("#whitebox").html('<img src="img/whitebox.png">');
	$("#music_frame").html(iframe);
};


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


var main = function () {
    "use strict";

	$(document).ready(function() {
			
		setLS("profile_frame","hidden"); 

		var tracks = [{"title":"Digitalism - Blitz","song_url":"https://soundcloud.com/linamescobarr/15-digitalism-blitz","soundcloud_id":"38843238"},{"title":"Sad Trombone2","song_url":"https://soundcloud.com/sheckylovejoy/sad-trombone","soundcloud_id":"18321000"},{"title":"Sad Trombone3","song_url":"https://soundcloud.com/sheckylovejoy/sad-trombone","soundcloud_id":"18321000"},{"title":"AraabMUZIK - \"Beauty\"","song_url":"  https://soundcloud.com/selftitledmag/araabmuzik-beauty","soundcloud_id":"79408289"}]
        
		var track_id =  tracks[0].soundcloud_id;

		loadSong(track_id);

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


			$("#loves").text(localStorage.loves);
			$("#hates").text(localStorage.hates);
			$("#track_history").text(localStorage.track_history);
			$("#search_history").text(localStorage.search_history);
			$("#radio_history").text(localStorage.radio_history);
			

 			$("#search-form").submit(function(){ // TODO: store search history
					clear();
					if (iphone) { hideProfile(); }
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


$(document).ready(main);

