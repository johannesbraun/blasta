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

            $.post("getEchonest", {"tid": tid}, function (response) {
                var data=JSON.parse(response);
                
                if(data.length>0){
                    if (data[0]['danceability']>0){
                        toggleEchonest('on'); 
                        //console.log(data);
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
        console.log("EchoNest:"+param);
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
            //console.log("hide echo")
        }else{
            $("#echonest_section").show();
        }
    }

    function loadRadioButton(tid){
        $("#rbox").hide();
        $.post("radiocheck", {"tid": tid}, function (response) {
            var data=JSON.parse(response);
            console.log("Radio available: "+data[0]['available']);
            var l = data.length;
            available  = data[0]['available'];
            if (available>0){
                 $("#rbox").show();
            }
        });
    }


    function loadProfile(uid){
        //recent tracks
        $.post("recenttracks", {"userid": uid}, function (response) {
                var data=JSON.parse(response);
                //console.log(data);
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
        $.post("recentradios", {"userid": uid}, function (response) {
                var data=JSON.parse(response);
                //console.log(data);
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
        $.post("preferences", {"userid": uid}, function (response) {
                var data=JSON.parse(response);
                //console.log(data);
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
        toggleEchonest('off')
        console.log(screen.width)
        if(screen.width>600){

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
        }else{
            //nothing
        }
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
                   if (i==0){
                    loadLineup(eventid)
                   }
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
                    //console.log("Event clicked: "+event.currentTarget.classList[0])
                    //console.log(event)
                    if(event.currentTarget.classList[0]=="eres"){
                        var eventtargetid = event.currentTarget.attributes[0].nodeValue
                        var eventid = eventtargetid.split("_")[1];
                        var eventpos = eventtargetid.split("_")[0];
                        console.log("Event clicked: "+eventid)
                        loadLineup(eventid)
                        changeEventSelectionBackground(parseInt(eventpos)+1);

                        if(screen.width<600){
                            $("#events_frame").hide()
                            $("#flyer").show()
                            $("#lineup_frame").show()
                        }
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

    function replaceUmlauts(str){
        s = str.replace(/\u00e4/g, "ae")
        s = s.replace(/\u00c4/g, "Ae")
        s = s.replace(/\u00d6/g, "Oe")
        s = s.replace(/\u00f6/g, "oe")
        s = s.replace(/\u00dc/g, "Ue")
        s = s.replace(/\u00fc/g, "ue")
        s = s.replace(/\u00df/g, "ss")
        return s
    }

    function latinizeKeyword(str){
        var Latinise={};Latinise.latin_map={"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"};
        String.prototype.latinise=function(){return this.replace(/[^A-Za-z0-9\[\] ]/g,function(a){return Latinise.latin_map[a]||a})};
        String.prototype.latinize=String.prototype.latinise;
        String.prototype.isLatin=function(){return this==this.latinise()}
        return str.latinise()
    }

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
                   var aid = data[i]['userid'];
                   if(aid ===null){
                    $("#lineup-list").append('<li id='+djstring+' class="djsres" ><a href="#"><span class="padded_link">'+djname+'</span></a></li>'); 
                   }
                   else{
                    $("#lineup-list").append('<li id='+djstring+' class="djres" ><a href="#"><span class="padded_link">'+djname+'</span></a></li>'); 
                   }

                }
                if (flyer ==""){
                        //nothing
                }else{
                    flyer = "http://www.residentadvisor.net/"+flyer
                    $("#flyer").append('<a href="#" id="fly"><img src='+flyer+' width="340" alt=""></a>');
                }
                

                $("li").click(function( event ) {
                    if(event.currentTarget.classList[0]=="djsres") {
                        var djstring = event.currentTarget.attributes[0].nodeValue
                        var djname = djstring.replace(/_/g, " ");
                        console.log("DJ clicked: "+djstring)
                        //console.log(event)
                        //startStation(djID)
                        $("#search_input").val(latinizeKeyword(djname));
                        $("#search_input").blur();
                        $("#search_input").css("color","gray");

                        $("#search_input").trigger("submit");
                        $("#search_bar").show();
                    }
                    if(event.currentTarget.classList[0]=="djres") {
                        var djstring = event.currentTarget.attributes[0].nodeValue
                        var djname = djstring.replace(/_/g, " ");
                        console.log("Found DJ clicked: "+djstring)
                        //console.log(event)
                        //startStation(djID)
                        $("#search_input").val(latinizeKeyword(djname));
                        $("#search_input").trigger("submit");
                        $("#search_input").blur();
                        $("#search_input").css("color","gray");
                        $("#search_bar").show();
                    }

            });
    });
}



    Track = function (trackId, rotation, nextSong){
        var currentTrack = "";
        var lineProgress=0;
        var line='';
        var userid = rotation.getUserid();
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
            console.log('track finished, looking for next...');

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
                

                $.post("plays", {"tid": trackId, "userid": userid}, function (response) {
                //nada
                });

                $.post("getTrackInfo", {"tid":trackId}, function (response) {
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
                    $.post("playupdateradio", {"tid": trackId, "userid":userid}, function (response) {
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
                        //console.log(art)
                        //console.log(art_large)
                        $("#artwork").css('opacity', '1');
                        $("#artwork").html('<img id="artwork_url" src="'+art+'" width="'+a_width+'" height="'+a_height+'" alt="art">')
                        loadImage("artwork","div",art_large, "", a_width, a_height);
                    }

                    console.log(userid +' is playing: '+ username +" : " +title + " (" + data.id +"): "+ data.permalink_url);
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
                        $("#search_input").blur();
                        $("#search_input").css("color","gray");
                    });

                    $('#recent_search').on('click', function(event){
                        var rq = event.toElement.innerText;
                        //console.log(rq)
                        $("#search_input").val(rq);
                        $("#search_input").trigger("submit");
                        $("#search_input").blur();
                        $("#search_input").css("color","gray");
                    });

                    $('#prefix').on('click', function(event){
                        $("#search_input").val(prefix);
                        $("#search_input").trigger("submit");
                        $("#search_input").blur();
                        $("#search_input").css("color","gray");
                    });

                    //console.log("streamable " + streamable)
                    if(streamable == false){
                        console.log("not streamable")
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

    Rotation = function(tracks, uid) {
        var currentTrack = tracks[0];
        var userid = uid;

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
            //console.log('currentIndex:'+currentIndex);
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

        this.getUserid = function (){
            return userid;
        }

        this.setUserid = function(uid){
            userid = uid
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

    function DisplayIP(response) {
        document.getElementById("ipaddress").innerHTML = response.ip;
        localStorage['ip'] = response.ip;
        //console.log(response);
    }

    $(document).ready (function(){
        var songs = [{"user": "", "title":"Four Tet - Lion (Jamie xx remix)","song_url":"Four Tet - Lion (Jamie xx remix)","soundcloud_id":"65161040"},{"user": "", "title":"Digitalism - Zdarlight - Chopstick & Johnjon remix","song_url":"Digitalism - Zdarlight - Chopstick & Johnjon remix","soundcloud_id":"71567061"},{"user": "","title":"A New Error","song_url":"https://soundcloud.com/apparat/a-new-error?in=apparat/sets/moderat-moderat","soundcloud_id":"24510445"},{"user": "","title":"DIGITALISM MAY 2013 US TOUR MIXTAPE","song_url":"http://soundcloud.com/digitalism_official/digitalism-may-mix","soundcloud_id":"90603702"},{"user": "","title":"Paul Kalkbrenner - Sky And Sand (Feat. Fritz Kalkbrenner)","song_url":"http://soundcloud.com/paulkalkbrenner/paul-kalkbrenner-sky-and","soundcloud_id":"37032471"},{"user": "","title":"Sad Trombone","song_url":"https://soundcloud.com/sheckylovejoy/sad-trombone","soundcloud_id":"18321000"}];
        //console.log(songs);
        //songs will actually be a full track object coming from the server
        

        var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') == -1;

        if (false) {
            document.write("This is a toy project and tested on Chrome only")
            //document.write(navigator.userAgent.toLowerCase())
        }else{


            if(screen.width<600){
                $("#calendar_section").hide()
                $("#echonest_section").hide()
                $("#search_frame").hide()
                $("#reco_frame").hide
                $("#events_frame").hide()
                $("#flyer").hide()
                $("#lineup_frame").hide()
                $('#nav_home').trigger("click");

            }


            loadEvents("now");
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "http://www.telize.com/jsonip?callback=DisplayIP";
            document.getElementsByTagName("head")[0].appendChild(script);
            
            var userid = 1;

            if(localStorage['ip']===undefined){
                //nada
            } else{
                userid = parseInt(localStorage['ip'].replace(/\./g,""));
                console.log("local storage ip found: " + localStorage['ip']);
            }

            var rotation = new Rotation(songs, userid);
            var searchResults = "";
            var radio =false;
            var playing=false;
            var profile = false;
            //rotation.setUserid(userid);
            console.log("Userid: "+userid);

            $.getJSON( "http://www.telize.com/jsonip?callback=?",
                function(data){
                userid = data.ip;
                userid = parseInt(userid.replace(/\./g,""));
                rotation.setUserid(userid);
                console.log("Replaced userid with: "+userid+ " proof:"+ rotation.getUserid());
            });  

            var currentTrack = rotation.currentTrack();
            //var currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, false);
            var currentPlayingTrack = []

            $.post("getRecentRadios", {"userid": userid}, function (response) {
                var data=JSON.parse(response);
                //console.log(data);
                var l = data.length;
            
                if (l>0){
                    
                    $("#gray_radiobutton").show();
                    $("#black_radiobutton").hide();
                    radio = true;
                    var ttl = data[0]['username'] + "-" +data[0]['title']; 
                    $("#search_input").val('Radio based on: ' +ttl);
                    $("#search_input").blur();
                    $("#search_input").css("color","gray");

                    $.post("getRadio", {"userid": userid}, function (response) {
                        var data=JSON.parse(response);
                        //console.log(data);
                        var l = data.length;
                        var results = [];
                        $("#saved-list").text("");
                        console.log("Recent radio found:"+data[0]['seedtid']);

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

                        
                        rotation = new Rotation(results, userid);
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
                                //console.log(event);
                                var pos = parseInt(event.currentTarget.id);
                                $('.res:nth-of-type(odd)').css({'background-color' : 'white'});
                                $('.res:nth-of-type(even)').css({'background-color' : 'white'});
                                $('.res:nth-of-type('+(pos)+')').css({'background-color' : '#E9E9E9'});
                                /*$('li:nth-child(even)').css({'background-color' : 'white'});
                                $('li:nth-child(odd)').css({'background-color' : 'white'});
                                $('li:nth-child('+(pos+1)+')').css({'background-color' : '#E9E9E9'});
                                $('li:nth-child('+(pos+1)+')').css({'color' : 'red'});
                                */

                                //console.log(event.currentTarget);
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
                $.post("playFirst", {"userid": userid}, function (response) {
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
                rotation = new Rotation(results, userid);
                rotation.goTo(1);
                currentTrack = rotation.currentTrack();
                currentPlayingTrack = new Track(currentTrack.soundcloud_id, rotation, true);
                //currentPlayingTrack.play();
                $('.trackTitle').html(currentTrack.title);

                $("li").click(function( event ) {
                    //console.log("res event "+event.currentTarget.classList[0])
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
                        //console.log(event);
                        var pos = parseInt(event.currentTarget.id);
                        $('.res:nth-of-type(odd)').css({'background-color' : 'white'});
                        $('.res:nth-of-type(even)').css({'background-color' : 'white'});
                        $('.res:nth-of-type('+(pos-1)+')').css({'background-color' : '#E9E9E9'});
                        /*$('li:nth-child(even)').css({'background-color' : 'white'});
                        $('li:nth-child(odd)').css({'background-color' : 'white'});
                        $('li:nth-child('+(pos+1)+')').css({'background-color' : '#E9E9E9'});
                        $('li:nth-child('+(pos+1)+')').css({'color' : 'red'});
                        */

                        console.log("Pos: "+pos);
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


            /*$('#artwork_link').on('click', function(event){
                if(!playing){
                    $('#play').trigger("click");
                }else{  
                    $('#pause').trigger("click");
                }
            });*/

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
                $.post("skips", {"tid": t.soundcloud_id, "userid":userid}, function (response) {
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
                //console.log(parentOffset.left);
                //console.log("event.pageX: "+event.pageX);

                var ff = (event.pageX-parentOffset.left)/440;
                if(screen.width<600){
                    ff=(event.pageX-10)/290;
                }
                
                
                var pos = Math.round(localStorage.duration * ff)
                console.log("Fast forward: "+ff +" "+ pos);
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
                    $("#ipaddress").hide();
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
                    $("#ipaddress").show();
                    //$("#reco_frame").hide()
                    $("#profile_frame").show();
                    $("#play-bar-frame").show()
                    $("#reset").show();
                    loadProfile(userid);
                    profile = true;
                    
                }  
            });

            $('#gray_radiobutton').on('click', function(event){
                var t = rotation.currentTrack();
                $.post("stopsradio", {"tid": t.soundcloud_id, "userid":userid}, function (response) {
                    //nada
                });
                $("#radio_section").hide();
                $("#black_radiobutton").show();
                $("#gray_radiobutton").hide();
                radio=false;
                $("#search_input").val('Song or Artist')
                $("#search_input").blur();
                $("#search_input").css("color","gray"); 
                $("#search_input").css("font-family","Courier");
                $("#search_bar").show();
                $("#playing_radio").empty();

            });

            $('#gray_radiobutton').on('click', function(event){
                var t = rotation.currentTrack();
                $.post("stopsradio", {"tid": t.soundcloud_id, "userid":userid}, function (response) {
                    //nada
                });
                $("#radio_section").hide();
                $("#black_radiobutton").show();
                $("#gray_radiobutton").hide();
                radio=false;
                $("#search_input").val('Song or Artist')
                $("#search_input").blur();
                $("#search_input").css("color","gray"); 
                $("#search_input").css("font-family","Courier");
                $("#search_bar").show();
                $("#playing_radio").empty();

            });

            $("#flyer").on('click', function(event){
                $("#events_frame").show()
                $("#flyer").hide()
                $("#lineup_frame").hide()
            });
            $("#hidevent").on('click', function(event){
                $("#events_frame").show()
                $("#flyer").hide()
                $("#lineup_frame").hide()
            });



            $('#reset').on('click', function(event){
                $.post("reset", {"userid": userid}, function (response) {
                    //nada
                    loadProfile(userid)
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
                var t = rotation.currentTrack();
                console.log(userid + " likes " + t.soundcloud_id);
                $('#liked').show();
                $('#like').hide();
                $('#disliked').hide();
                $('#dislike').show();
                $("#saved_likes").append($("#playing_track").html());  
                // TODO: adjust radio
                
                $.post("likes", {"tid": t.soundcloud_id, "userid":userid}, function (response) {
                    //nada
                });
                if(radio){
                    $.post("likeupdateradio", {"tid": t.soundcloud_id, "userid":userid}, function (response) {
                    //nada
                    
                        $.post("getRadio", {"userid": userid}, function (response) {
                        var data=JSON.parse(response);
                        //console.log(data);
                        var l = data.length;
                        var results = [];
                        $("#saved-list").text("");
                        $('#play').hide();
                        $('#pause').show();

                        //seed
                        results.push({"title":t.title,"song_url": t.song_url,"soundcloud_id":t.soundcloud_id});
                        $.post("playupdateradio", {"tid": t.soundcloud_id, "userid":userid}, function (response) {
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
                           if (i>=0){//don't skip the first track 
                            $("#saved-list").append('<li id="'+i+'" class="res" ><a href="#"><img id="res'+i+'" class="preview_img" src="../img/soundcloud5.png" width="30" alt=""><span class="resname">'+user_name+'<br><span class="restitle">'+title+'</span></span></a></li>'); 
                            }
                            loadImage("res"+i, "src", art, "../img/soundcloud5.png", 30, 30);
                        }

                        var dur = currentPlayingTrack.getDur();
                        var pos = currentPlayingTrack.getPosition();
                        var ff = pos/dur 
                        //console.log(dur, ff, pos);
                        currentPlayingTrack.stop();
                        rotation = new Rotation(results, userid);
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
                                //console.log(event);
                                var pos = parseInt(event.currentTarget.id);
                                $('.res:nth-of-type(odd)').css({'background-color' : 'white'});
                                $('.res:nth-of-type(even)').css({'background-color' : 'white'});
                                $('.res:nth-of-type('+(pos+1)+')').css({'background-color' : '#E9E9E9'});
                                /*$('li:nth-child(even)').css({'background-color' : 'white'});
                                $('li:nth-child(odd)').css({'background-color' : 'white'});
                                $('li:nth-child('+(pos+1)+')').css({'background-color' : '#E9E9E9'});
                                $('li:nth-child('+(pos+1)+')').css({'color' : 'red'});
                                */

                                console.log("Pos: "+pos);
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
                            } //end if
                        });//end click
                    
                    });//end get radio
                });//end likeupdate
            }//end if radio
            });// end love

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
                
                $("#saved_hates").append($("#playing_track").html());
                // TODO: adjust radio
                var t = rotation.currentTrack();
                console.log(userid + " hates " + t.soundcloud_id);
                $.post("hates", {"tid": t.soundcloud_id, "userid":userid}, function (response) {
                    //nada
                });
                if(radio){
                    $.post("hateupdateradio", {"tid": t.soundcloud_id, "userid":userid}, function (response) {
                    //nada
                    
                        $.post("getRadio", {"userid": userid}, function (response) {
                        var data=JSON.parse(response);
                        //console.log(data);
                        var l = data.length;
                        var results = [];
                        $("#saved-list").text("");


                        //seed
                        results.push({"title":t.title,"song_url": t.song_url,"soundcloud_id":t.soundcloud_id});
                        $.post("playupdateradio", {"tid": t.soundcloud_id, "userid":userid}, function (response) {
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
                           if (i>=0){//don't skip the first track 
                            $("#saved-list").append('<li id="'+i+'" class="res" ><a href="#"><img id="res'+i+'" class="preview_img" src="../img/soundcloud5.png" width="30" alt=""><span class="resname">'+user_name+'<br><span class="restitle">'+title+'</span></span></a></li>'); 
                            }
                            loadImage("res"+i, "src", art, "../img/soundcloud5.png", 30, 30);
                        }

                        var dur = currentPlayingTrack.getDur();
                        var pos = currentPlayingTrack.getPosition();
                        var ff = pos/dur 
                        //console.log(dur, ff, pos);
                        currentPlayingTrack.stop();
                        rotation = new Rotation(results, userid);
                        rotation.goTo(1);
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
                                //console.log(event);
                                var pos = parseInt(event.currentTarget.id);
                                $('.res:nth-of-type(odd)').css({'background-color' : 'white'});
                                $('.res:nth-of-type(even)').css({'background-color' : 'white'});
                                $('.res:nth-of-type('+(pos+1)+')').css({'background-color' : '#E9E9E9'});
                                /*$('li:nth-child(even)').css({'background-color' : 'white'});
                                $('li:nth-child(odd)').css({'background-color' : 'white'});
                                $('li:nth-child('+(pos+1)+')').css({'background-color' : '#E9E9E9'});
                                $('li:nth-child('+(pos+1)+')').css({'color' : 'red'});
                                */

                                console.log("Pos:" +pos);
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

                $("#search_frame").hide()
                $("#events_frame").hide()
                $("#flyer").hide()
                $("#lineup_frame").hide()

            });

             $('#nav_events').on('click', function(event){
                $("#nav_home").removeClass("active");
                $("#nav_search").removeClass("active");
                $("#nav_events").addClass("active");
                //$("#search_frame").hide();
                $("#music_section").hide();
                $("#play-bar-frame").show();
                $("#radio_section").hide();
                $("#search_bar").show();
                $("#profile_frame").hide();

                $("#search_frame").hide()
                $("#events_frame").show()
                $("#flyer").hide()
                $("#lineup_frame").hide()

            });

            $('#nav_search').on('click', function(event){
                $("#nav_home").removeClass("active");
                $("#nav_search").addClass("active");
                $("#nav_events").removeClass("active");
                
                $("#music_section").hide();
                //$("#search_frame").show();
                $("#play-bar-frame").show();
                
                $("#radio_section").hide();
                $("#search_bar").show();
                $("#profile_frame").hide();

                $("#search_frame").show()
                $("#events_frame").hide()
                $("#flyer").hide()
                $("#lineup_frame").hide()
            });

            $('#black_radiobutton').on('click', function(event){
                var t = rotation.currentTrack();
                $.post("startsradio", {"tid": t.soundcloud_id,  "userid":userid}, function (response) {
                    //nada
                });
                $.post("storeradio", {"tid": t.soundcloud_id, "userid":userid}, function (response) {
                    //nada
                });

                console.log(userid +" starts radio based on: "+t.title);
                //$("#current_radio_name").html('<a class="radio_click" id="radio_click" href="#">Radio based on: ' +t.title+'</a>');
                if(screen.width<600){
                    $("#search_input").val('Radio: ' +t.title);
                    
                }else{
                    //$("#current_radio_name").html('Radio based on: ' +t.title);
                    $("#search_input").val('Radio based on: ' +t.title);

                }
                $("#search_input").blur();
                $("#search_input").css("color","gray"); 
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

                $.post("getRecos2", {"tid": t.soundcloud_id, "userid":userid}, function (response) {
                    var data=JSON.parse(response);
                    //console.log(data);
                    var l = data.length;
                    var results = [];
                    $("#saved-list").text("");


                    //seed
                    results.push({"title":t.title,"song_url": t.song_url,"soundcloud_id":t.soundcloud_id});
                    $.post("playupdateradio", {"tid": t.soundcloud_id, "userid":userid}, function (response) {
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
                    rotation = new Rotation(results, userid);
                    //rotation.goTo(0);
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
                            //console.log(event);
                            var pos = parseInt(event.currentTarget.id);
                            $('.res:nth-of-type(odd)').css({'background-color' : 'white'});
                            $('.res:nth-of-type(even)').css({'background-color' : 'white'});
                            $('.res:nth-of-type('+(pos)+')').css({'background-color' : '#E9E9E9'});
                            /*$('li:nth-child(even)').css({'background-color' : 'white'});
                            $('li:nth-child(odd)').css({'background-color' : 'white'});
                            $('li:nth-child('+(pos+1)+')').css({'background-color' : '#E9E9E9'});
                            $('li:nth-child('+(pos+1)+')').css({'color' : 'red'});
                            */

                            console.log("Pos:"+pos);
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

            $('#echoreco').on('click', function(event){
                var t = rotation.currentTrack();
                

                console.log(userid +" starts EchoNest radio("+t.title+")");
                //$("#current_radio_name").html('<a class="radio_click" id="radio_click" href="#">Radio based on: ' +t.title+'</a>');
                if(screen.width<600){
                    $("#current_radio_name").html('Similar audio features to:<br> ' +t.title);
                    
                }else{
                    //$("#current_radio_name").html('Radio based on: ' +t.title);
                    $("#search_input").val('Similar audio features to: ' +t.title);
                }
                $("#search_input").blur();
                $("#search_input").css("color","gray");
                $("#playing_radio").empty();
                $("#playing_radio").append($("#playing_track").html()); 
                $("#saved_radios").append($("#playing_track").html());     
                $("#radio_section").show();
                $("#gray_radiobutton").hide();
                $("#black_radiobutton").show();
                $('#liked').hide();
                $('#like').show();
                $('#hated').hide();
                $('#hate').show();

                //$("#radio_section").show();
                //$("#reco_frame").show()
                //$("#search_bar").hide();
                //$("#search_frame").hide();

                radio=true;

                $.post("getEchoRecos", {"tid": t.soundcloud_id, "userid":userid}, function (response) {
                    console.log("Echo response:")
                    var data =response
                    //var data=JSON.parse(response);
                    //console.log("after")
                    console.log(data);
                    var l = data.length;
                    var results = [];
                    $("#saved-list").text("");


                    //seed
                    results.push({"title":t.title,"song_url": t.song_url,"soundcloud_id":t.soundcloud_id});
                    
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
                    rotation = new Rotation(results, userid);
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
                            //console.log(event);
                            var pos = parseInt(event.currentTarget.id);
                            $('.res:nth-of-type(odd)').css({'background-color' : 'white'});
                            $('.res:nth-of-type(even)').css({'background-color' : 'white'});
                            $('.res:nth-of-type('+(pos)+')').css({'background-color' : '#E9E9E9'});
                            /*$('li:nth-child(even)').css({'background-color' : 'white'});
                            $('li:nth-child(odd)').css({'background-color' : 'white'});
                            $('li:nth-child('+(pos+1)+')').css({'background-color' : '#E9E9E9'});
                            $('li:nth-child('+(pos+1)+')').css({'color' : 'red'});
                            */

                            console.log("Pos"+pos);
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
                query = latinizeKeyword(query);
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
                $.post("stopsradio", {"userid": userid}, function (response) {
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
                    rotation = new Rotation(results, userid);
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
                        ///console.log("res event "+event.currentTarget.classList[0])
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
                            //console.log(event);
                            var pos = parseInt(event.currentTarget.id);
                            $('.res:nth-of-type(odd)').css({'background-color' : 'white'});
                            $('.res:nth-of-type(even)').css({'background-color' : 'white'});
                            $('.res:nth-of-type('+(pos+1)+')').css({'background-color' : '#E9E9E9'});
                            /*$('li:nth-child(even)').css({'background-color' : 'white'});
                            $('li:nth-child(odd)').css({'background-color' : 'white'});
                            $('li:nth-child('+(pos+1)+')').css({'background-color' : '#E9E9E9'});
                            $('li:nth-child('+(pos+1)+')').css({'color' : 'red'});
                            */

                            console.log("Pos"+pos);
                            
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

        
        }
    });

