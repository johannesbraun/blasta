function playSong(track_id){
		console.log("playSong("+track_id+")");

		var width = 600;
		var height = 200;

		if(navigator.platform !=="MacIntel"){
			//alert('iphone');
			width = 300;
			height = 150;
		}

		var artwork = "false";
		var comments = "true";

		var iframe = "<iframe id=\"soundcloud_widget\" src=\"https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/"+track_id+"&amp;auto_play=true&amp;hide_related=true&amp;show_comments="+comments+"&amp;show_user=false&amp;show_reposts=false&amp;visual=false&show_artwork="+artwork+"&liking=false&sharing=false&download=false&buying=false&show_playcount=false&singleplay=true&color=FF7538\" width=\""+width+"\" height=\""+height+"\" frameborder=\"no\"></iframe>";
		$("#music_frame").html(iframe);

		if(localStorage.current_radio !== undefined){
			stopRadio();//TODO: move
		}
		getInfo(track_id);
		};

function getInfo(track_id){
		console.log("getInfo("+track_id+")");
			var timeInMs = Date.now(); //better here ?
			$.post("getTrackInfo", {"id":track_id, "time": timeInMs}, function (response) {
    			// this callback is called with the server responds 
        		//console.log("We posted and the server responded!"); 
        		insertInfoIntoLS(response, track_id, timeInMs);
    		});
			
		};

function insertInfoIntoLS(data, track_id, timeInMs){
		console.log("insertInfoIntoLS(data, "+track_id+", time)");
		var art = data.artwork_url;
		var title = data.title;
		setLS("current_track",JSON.stringify({time: timeInMs, id: track_id, name: title}));
		$("#current_track").text(localStorage.current_track);
		//TODO: pretty history, unique?, group?
		$("#track_history").prepend(localStorage.current_track+"<br>");
		addToLS("track_history",localStorage.current_track);
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
			arr = JSON.parse(localStorage[name]);
		}
		//arr.push(item);
		arr.unshift(item); // adds item to beginning of array
		localStorage[name] = JSON.stringify(arr);

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

function love(){
	console.log("love()");
	$("#loves").prepend(localStorage.current_track);
	addToLS("loves", localStorage.current_track);
}

function hate(){
	console.log("hate()");
	$("#hates").prepend(localStorage.current_track);
	addToLS("hates", localStorage.current_track);
}

function next(){
	console.log("next()");
	playSong(37032471);
}

function showProfile(){
	console.log("profile_toggle()");
	if (localStorage.profile === "visible"){
		$("#profile_section").hide();
		setLS("profile","hidden"); 
	}else {
		$("#profile_section").show();
		setLS("profile","visible"); 
	};
}

function hideSearch(){
	console.log("hideSearch()");
	$("#search_section").hide();
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


var main = function () {
    "use strict";

	$(document).ready(function() {
			
			var track_id =  38843238;
			//var client_id = "17089d3c7d05cb2cfdffe46c2e486ff0";

			playSong(track_id);
			$("#loves").text(localStorage.loves);
			$("#hates").text(localStorage.hates);
			$("#track_history").text(localStorage.track_history);
			$("#search_history").text(localStorage.search_history);
			$("#radio_history").text(localStorage.radio_history);
			

 			$("#search-form").submit(function(){ // TODO: store search history
					clear();
					var query = $("#search_input").val();
					console.log("Search for '"+query+'"');
					var timeInMs = Date.now();
					var search_event = JSON.stringify({time: timeInMs, q: query});
					addToLS("search_history", search_event);
					$("#search_history").prepend(search_event);
					//htmlAdd($"#search_history", search_event);
					$("#search_input").blur();
					$("#search_input").css("color","gray"); 
					$("#search_input").css("font-family","Courier");
					$.post("search", {"q": query}, function (response) {
    					// this callback is called with the server responds 
        				//console.log("We posted and the server responded!"); 
        				//console.log(response);
        				//console.log(response[0].title);
        				insertResultsIntoDOM(response, query);
    				});
					//$("#search-form").toggle();
					//$("#history").append(query+" <br>");
					return false;
			});

			/*$(".next").on("click", function (event) { 
				console.log("next()");
				//TODO: note the time listened to the song 
				//check if we are ona radio or search results
				playSong(37032471);
			});
			$(".love").on("click", function (event) { 
				console.log("love()");
				//TODO: save only id in localStorage.hist etc. and either store titles in localStorage.titles or get them fom api
				$("#loves").prepend(localStorage.current_track);
				addToLS("loves", localStorage.current_track);
			});
			$(".hate").on("click", function (event) { 
				console.log("hate()");
				$("#hates").prepend(localStorage.current_track);
				addToLS("hates", localStorage.current_track);
			});
			$(".profile_toggle").on("click", function (event) { 
				console.log("profile_toggle()");
				if (localStorage.profile === "visible"){
					$("#profile_section").hide();
					setLS("profile","hidden"); 
				}else {
					$("#profile_section").show();
					setLS("profile","visible"); 
				};
			});*/
		});
};


$(document).ready(main);

