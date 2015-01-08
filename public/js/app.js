function playSong(track_id){

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
		$("#music").html(iframe);

		stopRadio();
		getInfo(track_id);
		};

function getInfo(track_id){
			var timeInMs = Date.now(); //better here ?
			$.post("getTrackInfo", {"id":track_id, "time": timeInMs}, function (response) {
    			// this callback is called with the server responds 
        		console.log("We posted and the server responded!"); 
        		insertInfoIntoLS(response, track_id, timeInMs);
    		});
			
		};

function insertInfoIntoLS(data, track_id, timeInMs){
		var art = data.artwork_url;
		var title = data.title;
		localStorage.track=JSON.stringify({time: timeInMs, id: track_id, name: title}); 
		$("#current_track").text(localStorage.track);
		//TODO: pretty history, unique?, group?
		$("#track_history").prepend(localStorage.track);
		addToLS(localStorage.track, "track_hist");
}

function startRadio(id){
			var t = JSON.parse(localStorage.track).name;
			$("#current_radio").append(localStorage.track);
			console.log(t)
			$("#station").html('<a class="station">'+t+'</a>');
			localStorage.radio=localStorage.track;
			addToLS(localStorage.track, "radio");
			$("#radio").show();
			//TODO: work with css class hidden p. 139 and jQuery removeClass/addClass
			$("#black_radiobutton").css("display","none");
			$("#gray_radiobutton").css("display","inline");
			/*$("#radiobutton").html('<img class="control" src="img/icons/graystartradio.png" width="50" alt="radio">');*/
};


function stopRadio(){
			$("#radio").hide();
			$("#gray_radiobutton").css("display","none");
			$("#black_radiobutton").css("display","inline");
			$("#station").text("");
			$("#stations").prepend(localStorage.radio);
			addToLS(localStorage.track, "stations");
			delete localStorage.radio;
			/*$("#radiobutton").html('<img class="control" src="img/icons/black_radio.png" width="50" alt="redio">');*/
};

function insertResultsIntoDOM (data, query) {
        var l = data.length;
        $("#Results").html("<h3>"+l+" results for '"+query+"':</h3>");
        var i=0;
        for (i=0; i<l; i++) {
           var title = data[i].title;
           var track_id = data[i].id;
           //console.log(title);
           $("#SRP").append("<a href=\"javascript:playSong("+track_id+");\">"+title+"</a><br>"); // how to link to play?
        }
    };

// takes item and appends it to localStorage.name
function addToLS(item, name){
	var arr = [];
		if (typeof localStorage[name] !== 'undefined'){ 
			arr = JSON.parse(localStorage[name]);
		}
		//arr.push(item);
		arr.unshift(item); // adds item to beginning of array
		localStorage[name] = JSON.stringify(arr);

}


function clear(){
			$("#SRP").text("");
			$("#Results").text("")
		};


var main = function () {
    "use strict";

	$(document).ready(function() {
			
			var track_id =  38843238;
			//var client_id = "17089d3c7d05cb2cfdffe46c2e486ff0";

			playSong(track_id);
			$("#loves").text(localStorage.loves);
			$("#hates").text(localStorage.hates);
			$("#track_history").text(localStorage.track_hist);
			$("#search_history").text(localStorage.search_hist);
			$("#stations").text(localStorage.stations);
			

 			$("#search-form").submit(function(){ // TODO: store search history
					clear();
					var query = $("#search").val();
					var timeInMs = Date.now();
					var search_event = {"time": timeInMs, "q": query}
					addToLS(search_event, "search_hist");
					$("#search_history").prepend(search_event)
					$("#search").blur();
					$("#search").css("color","gray"); 
					$("#search").css("font-family","Courier");
					$.post("search", {"q":query}, function (response) {
    					// this callback is called with the server responds 
        				console.log("We posted and the server responded!"); 
        				//console.log(response);
        				//console.log(response[0].title);
        				insertResultsIntoDOM(response, query);
    				});
					//$("#search-form").toggle();
					//$("#history").append(query+" <br>");
					return false;
			});

			$(".next").on("click", function (event) { 
				//alert("next");
				//TODO: note the time listened to the song 
				//check if we are ona radio or search results
				playSong(37032471);
			});
			$(".love").on("click", function (event) { 
				//TODO: save only id in localStorage.hist etc. and either store titles in localStorage.titles or get them fom api
				$("#loves").prepend(localStorage.track);
				appendToLS(localStorage.track, "loves");
			});
			$(".hate").on("click", function (event) { 
				//alert("hate it");
				$("#hates").prepend(localStorage.track);
				appendToLS(localStorage.track, "hates");
			});
			$(".profile_toggle").on("click", function (event) { 
				if (localStorage.profile === "visible"){
					$("#profile").hide();
					localStorage.profile="hidden"; 
				}else {
					$("#profile").show();
					localStorage.profile="visible"; 
				};
			});
			$(".radio").on("click", function (event) { 
				if (localStorage.radio !== undefined){
					stopRadio();
				}else {
					startRadio()
				};
			});
		});
};


$(document).ready(main);

//Notes:
/*var pretty_history = "";
			var history = JSON.parse(localStorage.hist);
			for (i=0; i<history.length; i++){
				pretty_history = pretty_history + history[i] + "<br>";
			}
			$("#history").html(pretty_history);*/



			/* jquery selectors p.112
			$("*"); // selects all elements in the document
			$("h1"); // selects all of the h1 elements
			$("p"); // selects all paragraph elements 
			$("p .first"); selects all paragraph elements with the class 'first'
			$(".first"); // selects all elements with the class 'first'
			$("p:nth-child(3)"); // selects all paragraph elements that are the third child
			*/


			//var url = "http://api.soundcloud.com/tracks/"+track_id+".json?client_id="+client_id;

			//console.log(url);

			/*$.getJSON(url, function(data){
				//console.log(data);
				var art = data.artwork_url;
				var large = art.replace("large", "t500x500");
				console.log(large);
			});

			var widget = SC.Widget(document.getElementById('soundcloud_widget'));
			widget.bind(SC.Widget.Events.READY, function() {
				console.log('Ready...');
			});
			$('button').click(function() {
				widget.toggle();
			});*/