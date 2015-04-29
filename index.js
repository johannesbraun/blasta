var express = require("express"),
  http = require("http"),
  app = express(),
  cors = require('cors'),
  request = require('request'),
  bodyParser = require('body-parser');

var credentials = require('./credentials.json');
var mysql = require('mysql')
var port = process.env.PORT || 3000

// set up a static file directory to use for default routing __dirname will resolve to the directory the executing script resides in. So if your script resides in /home/sites/app.js, __dirname will resolve to /home/sites.
app.use(express.static(__dirname + "/views"));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


// set up our routes
app.get("/", function (req, res) { 
   res.send("index.html");
});


app.get("/callback", function (req, res) { 
   res.render("callback.html");
});

app.get("/ip", function (req, res) { 
   res.render("ipgetter.html");
});


app.get("/player", function (req, res) { 
   res.render("player.html");
});

app.get("/datepicker", function (req, res) { 
   res.render("datepicker.html");
});

app.get("/profile", function (req, res) { 
   res.render("profile.html");
});


app.get("/connect", function (req, res) { 
   res.render("connect.html");
});


app.get("/goodbye", function (req, res) { 
   res.send("Goodbye World!");
});


app.post("/search", function (req, res) {
    // res.json returns the entire object as a JSON file
      query = req.body.q;
      //console.log(query);
      var url = "http://api.soundcloud.com/tracks?q="+query+"&client_id="+credentials.client_id+"&format=json&_status_code_map[302]=200";
      console.log("Search: " + url);
        
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var info = JSON.parse(body)
          // do more stuff
          res.send(info);
        }
      })
});

app.post("/getTrackInfo", function (req, res) {
      track_id = req.body.tid;
      var url = "https://api.soundcloud.com/tracks/"+track_id+".json?client_id="+credentials.client_id;
      console.log("getInfo: " + url);
        
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var info = JSON.parse(body)
          res.send(info);
        }
      })
});


app.post("/getEchoRecos", function (req, res) {
      track_id = req.body.tid;
      var url = "https://guarded-crag-2399.herokuapp.com/reco/"+track_id;
      console.log("getEchoRecos: " + url);
        
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var info = JSON.parse(body)
          console.log(info);
          res.send(info);
        }
      })
});


app.post("/getRecentRadios", function (req, res) {
      user_id = req.body.userid;

      var connection = mysql.createConnection({
        host     : 'blastafast.c7dfxf4q39rn.us-east-1.rds.amazonaws.com',
        user     : 'blastafast',
        password : 'blastafast',
        database : 'blastafast'
      });

      connection.connect();

      var stmt = "select t.tid, NOW()-last_startsradio_timestamp, username, title  \
                  from user_sessions u \
                  inner join dj_unique_tracks_v3 t \
                  on u.tid = t.tid \
                  where u.userid = " + user_id + "\
                  and last_startsradio_timestamp > coalesce(last_stopsradio_timestamp,0) \
                  # and NOW()-last_played_timestamp < 300 \
                  order by last_startsradio_timestamp desc \
                  limit 1"

      console.log(stmt);

      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);

          rows.forEach(function(entry) {
              //console.log(entry);
          });

          res.send(JSON.stringify(rows));
        }
        else
          console.log('Error while performing Query.');
      });

      connection.end();

      
});

app.post("/recenttracks", function (req, res) {
      user_id = req.body.userid;

      var connection = mysql.createConnection({
        host     : 'blastafast.c7dfxf4q39rn.us-east-1.rds.amazonaws.com',
        user     : 'blastafast',
        password : 'blastafast',
        database : 'blastafast'
      });

      connection.connect();

      var stmt = "select u.tid, t.username, t.title, case when artwork_url is not null then artwork_url else avatar_url end as artwork_url \
                  from user_sessions u \
                  inner join dj_artwork a on u.tid = a.tid \
                  inner join dj_unique_tracks_v3 t on t.tid = u.tid \
                  where u.userid = "+user_id+"\
                  order by last_played_timestamp desc"

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 

      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);

          rows.forEach(function(entry) {
              //console.log(entry);
          });

          res.send(JSON.stringify(rows));
        }
        else
          console.log('Error while performing Query.');
      });

      connection.end();

      
});

app.post("/recentradios", function (req, res) {
      user_id = req.body.userid;

      var connection = mysql.createConnection({
        host     : 'blastafast.c7dfxf4q39rn.us-east-1.rds.amazonaws.com',
        user     : 'blastafast',
        password : 'blastafast',
        database : 'blastafast'
      });

      connection.connect();

      var stmt = "select u.tid, t.username, t.title, case when artwork_url is not null then artwork_url else avatar_url end as artwork_url \
                  from user_sessions u \
                  inner join dj_artwork a on u.tid = a.tid \
                  inner join dj_unique_tracks_v3 t on t.tid = u.tid \
                  where u.userid = "+user_id+"\
                  and startsradio >0 \
                  order by last_startsradio_timestamp desc"

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 
       connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);

          rows.forEach(function(entry) {
              //console.log(entry);
          });

          res.send(JSON.stringify(rows));
        }
        else
          console.log('Error while performing Query.');
      });

      connection.end();

      
});

app.post("/preferences", function (req, res) {
      user_id = req.body.userid;

      var connection = mysql.createConnection({
        host     : 'blastafast.c7dfxf4q39rn.us-east-1.rds.amazonaws.com',
        user     : 'blastafast',
        password : 'blastafast',
        database : 'blastafast'
      });

      connection.connect();

      var stmt = "select case when u.likes > 0 then 1 else 0 end as kind, u.tid, t.username, t.title, case when artwork_url is not null then artwork_url else avatar_url end as artwork_url \
                  from user_sessions u \
                  inner join dj_artwork a on u.tid = a.tid \
                  inner join dj_unique_tracks_v3 t on t.tid = u.tid \
                  where u.userid = "+user_id+"\
                  and (u.likes + u.hates) >0 \
                  order by last_played_timestamp desc"

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 

      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);

          rows.forEach(function(entry) {
              console.log(entry);
          });

          res.send(JSON.stringify(rows));
        }
        else
          console.log('Error while performing Query.');
      });

      connection.end();

      
});

app.post("/radiocheck", function (req, res) {
      var track_id = req.body.tid;

      var connection = mysql.createConnection({
        host     : 'blastafast.c7dfxf4q39rn.us-east-1.rds.amazonaws.com',
        user     : 'blastafast',
        password : 'blastafast',
        database : 'blastafast'
      });

      connection.connect();

      var stmt = "select count(*) as available from cached_recos_fast where tid1 = "+track_id

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 

      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);

          rows.forEach(function(entry) {
              //console.log(entry);
          });

          res.send(JSON.stringify(rows));
        }
        else
          console.log('Error while performing Query.');
      });

      connection.end();

      
});



app.post("/getRadio", function (req, res) {
      user_id = req.body.userid;

      var connection = mysql.createConnection({
        host     : 'blastafast.c7dfxf4q39rn.us-east-1.rds.amazonaws.com',
        user     : 'blastafast',
        password : 'blastafast',
        database : 'blastafast'
      });

      connection.connect();

      var stmt = "select seedtid, t.tid, t.userid, case when artwork_url is not null then artwork_url else avatar_url end as artwork_url, \
              t.permalink, t.title, t.username, last_startsradio_timestamp  \
              from radio_stations l \
              inner join user_sessions u\
              on u.userid = l.userid\
              and u.tid =l.seedtid \
              inner join dj_unique_tracks_v3 t \
              on l.tid = t.tid \
              inner join dj_artwork a \
              on a.tid = l.tid \
              and a.streamable = 1 \
              where l.userid = "+user_id+" \
              and coalesce(NOW()-played_timestamp,1000)>=1000 \
              and last_startsradio_timestamp > coalesce(last_stopsradio_timestamp,0)\
              group by 1,2,3,4,5,6,7,8 \
              order by last_startsradio_timestamp desc,  l.score desc limit 50" 



      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 
      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);

          rows.forEach(function(entry) {
              //console.log(entry);
          });

          res.send(JSON.stringify(rows));
        }
        else
          console.log('Error while performing Query.');
      });

      connection.end();

      
});

app.post("/getRecos2", function (req, res) {
      track_id = req.body.tid;
      var user_id = req.body.userid;

      var connection = mysql.createConnection({
        host     : 'blastafast.c7dfxf4q39rn.us-east-1.rds.amazonaws.com',
        user     : 'blastafast',
        password : 'blastafast',
        database : 'blastafast'
      });

      connection.connect();

      var stmt = "select t.tid, t.userid, case when l.aid1 = l.aid2 then 'y' else 'n' end as same_artist , case when artwork_url is not null then artwork_url else avatar_url end as artwork_url\
              ,t.permalink, t.title, t.username, weighted_intersection, intersection, cosine, cosine, \
              llr, case when llr >0 then llr else cosine end as ranking  \
              from cached_recos_fast l \
              inner join dj_unique_tracks_v3 t \
              on l.tid2 = t.tid \
              inner join dj_artwork a \
              on a.tid = l.tid2 \
              and a.streamable = 1 \
              where l.tid1 = "+track_id+" \
              and l.tid1 <> l.tid2 \
              order by cosine desc limit 50"

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 
      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);

          rows.forEach(function(entry) {
              //console.log(entry);
          });

          res.send(JSON.stringify(rows));
        }
        else
          console.log('Error while performing Query.');
      });

      connection.end();

      
});


app.post("/getSession", function (req, res) {
      var track_id = req.body.tid;
      var user_id = req.body.userid;

      var connection = mysql.createConnection({
        host     : 'blastafast.c7dfxf4q39rn.us-east-1.rds.amazonaws.com',
        user     : 'blastafast',
        password : 'blastafast',
        database : 'blastafast'
      });

      connection.connect();

      var stmt = "select t.tid , userid, permalink, title, username, case when artwork_url is not null then artwork_url else avatar_url end as artwork_url \
                  from dj_unique_tracks_v3 t \
                  inner join dj_artwork a \
                  on a.tid = t.tid \
                  and a.streamable = 1 \
                  where t.userid  in (  \
                    select userid from \
                    dj_profiles_v3 \
                    where djID in ( \
                      select djID \
                      from new_ra_event_lineup \
                      where eventid in ( \
                        select eventid from \
                            (select e.eventid, eventName, venueName, flyer, attending, extract(day from eventDate) as eday, MONTHNAME(eventDate) as emonth, eventDate-NOW() as howsoon  \
                                    from new_ra_events e  \
                                    where eventDate-NOW() >0  \
                                    and e.eventid in ( \
                                      select l.eventid from \
                                      new_ra_event_lineup l  \
                                      inner join dj_profiles_v3 p  \
                                      on p.djID = l.djID  \
                                      and p.number_of_tracks >0 \
                                      group by 1)  \
                                    order by howsoon, attending desc limit 1 \
                                    ) event \
                      ) \
                    ) \
                  )order by plays desc"

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 

      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);

          rows.forEach(function(entry) {
              //console.log(entry);
          });

          res.send(JSON.stringify(rows));
        }
        else
          console.log('Error while performing Query.');
      });

      connection.end();

      
});

app.post("/playFirst", function (req, res) {
      track_id = req.body.userid;

      var connection = mysql.createConnection({
        host     : 'blasta.chiim1n4uxwu.eu-central-1.rds.amazonaws.com',
        user     : 'blasta',
        password : '27051980',
        database : 'blasta'
      });

      connection.connect();

      var stmt = "select t.tid , userid, permalink, title, username, case when artwork_url is not null then artwork_url else avatar_url end as artwork_url \
                  from dj_unique_tracks_v3 t \
                  inner join dj_artwork a \
                  on a.tid = t.tid \
                  and a.streamable = 1 \
                  where t.userid  in (  \
                    select userid from \
                    dj_profiles_v3 \
                    where djID in ( \
                      select djID \
                      from new_ra_event_lineup \
                      where eventid in ( \
                        select eventid from \
                            (select e.eventid, eventName, venueName, flyer, attending, extract(day from eventDate) as eday, MONTHNAME(eventDate) as emonth, eventDate-NOW() as howsoon  \
                                    from new_ra_events e  \
                                    where eventDate- NOW() >0  \
                                    and e.eventid in ( \
                                      select l.eventid from \
                                      new_ra_event_lineup l  \
                                      inner join dj_profiles_v3 p  \
                                      on p.djID = l.djID  \
                                      and p.number_of_tracks >0 \
                                      group by 1)  \
                                    order by howsoon, attending desc limit 1 \
                                    ) event \
                      ) \
                    ) \
                  )order by plays desc"

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 
      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);

          rows.forEach(function(entry) {
              //console.log(entry);
          });

          res.send(JSON.stringify(rows));
        }
        else
          console.log('Error while performing Query.');
      });

      connection.end();

      
});


app.post("/storeradio", function (req, res) {
      var track_id = req.body.tid;
      var user_id = req.body.userid;

      var connection = mysql.createConnection({
        host     : 'blastafast.c7dfxf4q39rn.us-east-1.rds.amazonaws.com',
        user     : 'blastafast',
        password : 'blastafast',
        database : 'blastafast'
      });

      connection.connect();

      var stmt = "insert ignore into radio_stations \
                  select "+user_id+" as userid, r.tid1 as seedtid, r.tid2 as tid, r.cosine as score, NULL as played_timestamp, NULL as last_updated_timestamp  \
                  from cached_recos_fast r \
                  where r.tid1 = "+track_id

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 
      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);

          res.send(JSON.stringify({"radio":"created"}));
        }
        else
          console.log('Error while performing Query.');
      });

      connection.end();

      
});


app.post("/likeupdateradio", function (req, res) {
      var track_id = req.body.tid;
      var user_id = req.body.userid;

      var connection = mysql.createConnection({
        host     : 'blastafast.c7dfxf4q39rn.us-east-1.rds.amazonaws.com',
        user     : 'blastafast',
        password : 'blastafast',
        database : 'blastafast'
      });

      connection.connect();

      var stmt = "insert into radio_stations \
                  select "+user_id+", lastradio.tid as seedid, r.tid2 as tid, r.cosine score, NULL as played_timestamp, NOW() as last_updated_timestamp \
                  from cached_recos_fast r \
                  left join ( \
                  select tid from user_sessions \
                  where userid ="+user_id+" \
                  and last_startsradio_timestamp > coalesce(last_stopsradio_timestamp,0) \
                  order by last_startsradio_timestamp desc \
                  limit 1) lastradio \
                  on 1=1  \
                  where r.tid1 = "+track_id+" \
                  ON DUPLICATE KEY UPDATE score=score+ (0.5*r.cosine), last_updated_timestamp = NOW();" 

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 
      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);
          res.send(JSON.stringify({"radio_update":"like"}));
        }
        else
          console.log('Error while performing Query.');
      });
      connection.end();
});

app.post("/playupdateradio", function (req, res) {
      var track_id = req.body.tid;
      var user_id = req.body.userid;

      var connection = mysql.createConnection({
        host     : 'blastafast.c7dfxf4q39rn.us-east-1.rds.amazonaws.com',
        user     : 'blastafast',
        password : 'blastafast',
        database : 'blastafast'
      });

      connection.connect();

      var stmt = "update radio_stations r , (select tid from user_sessions \
                  where userid ="+user_id+" \
                  and last_startsradio_timestamp > coalesce(last_stopsradio_timestamp,0) \
                  order by last_startsradio_timestamp desc \
                  limit 1) lastradio \
                  set r.played_timestamp = NOW() \
                  where userid = "+user_id+" \
                  and r.seedtid  = lastradio.tid \
                  and r.tid = " +track_id

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 
      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);
          res.send(JSON.stringify({"radio_update":"like"}));
        }
        else
          console.log('Error while performing Query.');
      });
      connection.end();
});



app.post("/hateupdateradio", function (req, res) {
      var track_id = req.body.tid;
      var user_id = req.body.userid;

      var connection = mysql.createConnection({
        host     : 'blastafast.c7dfxf4q39rn.us-east-1.rds.amazonaws.com',
        user     : 'blastafast',
        password : 'blastafast',
        database : 'blastafast'
      });

      connection.connect();

      var stmt = "insert into radio_stations \
                  select "+user_id+", lastradio.tid as seedid, r.tid2 as tid,  r.cosine*-1 as score, NULL as played_timestamp, NOW() as last_updated_timestamp \
                  from cached_recos_fast r \
                  left join ( \
                  select tid from user_sessions \
                  where userid = "+user_id+" \
                  and last_startsradio_timestamp > coalesce(last_stopsradio_timestamp,0) \
                  order by last_startsradio_timestamp desc \
                  limit 1) lastradio \
                  on 1=1  \
                  where r.tid1 = "+track_id+" \
                  ON DUPLICATE KEY UPDATE score=score- r.cosine, last_updated_timestamp = NOW();" 

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 
      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);
          res.send(JSON.stringify({"radio_update":"hate"}));
        }
        else
          console.log('Error while performing Query.');
      });
      connection.end();
});

app.post("/reset", function (req, res) {
      var user_id = req.body.userid;

      var connection = mysql.createConnection({
        host     : 'blastafast.c7dfxf4q39rn.us-east-1.rds.amazonaws.com',
        user     : 'blastafast',
        password : 'blastafast',
        database : 'blastafast'
      });

      connection.connect();

      var stmt = "delete from user_sessions \
                  where userid ="+user_id 
      var stmt1 = "delete from radio_stations \
                  where userid ="+user_id

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 
      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);
        }
        else
          console.log('Error while performing Query.');
      });

      connection.query(stmt1, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);
        }
        else
          console.log('Error while performing Query.');
      });

      res.send(JSON.stringify({"profile_update":"reset"}));
      connection.end();
});



app.post("/getEvents", function (req, res) {
      //var location_id = req.body.id;
      var dateText = req.body.dateText;
      console.log(dateText)
      var dateString = "NOW()" //-864000
      if (dateText != "now"){
          dateString = "STR_TO_DATE(\'"+dateText+"\',\'%m/%d/%Y\')"
      }
      console.log(dateString);

      var connection = mysql.createConnection({
        host     : 'blasta.chiim1n4uxwu.eu-central-1.rds.amazonaws.com',
        user     : 'blasta',
        password : '27051980',
        database : 'blasta'
      });

      connection.connect();

      /*var stmt = "select e.eventid, eventName, venueName, flyer, attending, extract(day from eventDate) as eday, MONTHNAME(eventDate) as emonth, eventDate-NOW() as howsoon \
                  from new_ra_events e \
                  where eventDate-NOW() >0  \
                  and e.eventid in \
                  (select l.eventid from \
                  new_ra_event_lineup l \
                  inner join dj_profiles_v3 p \
                  on p.djID = l.djID  \
                  group by 1)  \
                  order by attending desc limit 20"*/
      var stmt = " select eventid, eventName, venueName, eventDate, now, now < eventDate, flyer, attending, extract(day from eventDate) as eday, MONTHNAME(eventDate) as emonth from( \
                  select e.eventid, eventName, venueName, eventDate, "+dateString+" as now, flyer, attending, extract(day from eventDate) as eday, MONTHNAME(eventDate) as emonth \
                  from new_ra_events e  \
                    where \
                    e.eventid in ( \
                    select l.eventid from \
                    new_ra_event_lineup l  \
                    inner join dj_profiles_v3 p  \
                    on p.djID = l.djID  \
                    and p.number_of_tracks >0 \
                    group by 1)  \
                  and attending >5  )p \
                  where now <= eventDate\
                  order by eventDate, attending desc limit 50" 

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 

      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);

          rows.forEach(function(entry) {
              //console.log(entry);
          });

          res.send(JSON.stringify(rows));
        }
        else
          console.log('Error while performing Query.');
      });

      connection.end();

      
});

app.post("/getLineup", function (req, res) {
      var eventid = req.body.id;

      var connection = mysql.createConnection({
        host     : 'blasta.chiim1n4uxwu.eu-central-1.rds.amazonaws.com',
        user     : 'blasta',
        password : '27051980',
        database : 'blasta'
      });

      connection.connect();

      var stmt = "select l.djID, l.djname, p.userid, e.eventid, eventName, venueName, flyer, attending, eventDate, eventDate-NOW() as howsoon \
                  from new_ra_events e \
                  left join new_ra_event_lineup l \
                  on e.eventID = l.eventID \
                  left join dj_profiles_v3 p  \
                  on p.djID = l.djID \
                  where  e.eventid = "+eventid

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 
      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);

          rows.forEach(function(entry) {
              //console.log(entry);
          });

          res.send(JSON.stringify(rows));
        }
        else
          console.log('Error while performing Query.');
      });

      connection.end();

      
});


app.post("/getEchonest", function (req, res) {
      track_id = req.body.tid;

      var connection = mysql.createConnection({
        host     : 'blasta.chiim1n4uxwu.eu-central-1.rds.amazonaws.com',
        user     : 'blasta',
        password : '27051980',
        database : 'blasta'
      });

      connection.connect();

      /*var stmt = "select e.tid, case when " +track_id +" = e.tid then 1 else 0 end as have_echo, coalesce(avg(danceability),0) as danceability, coalesce(avg(energy),0) as energy, coalesce(avg(acousticness),0) as acousticness, coalesce(avg(tempo)/200,0) as tempo, coalesce(avg(instrumentalness),0) as instrumentalness, coalesce(avg(valence),0) as valence, coalesce(avg(liveness),0) as liveness, coalesce(avg(speechiness),0) as speechiness, coalesce(avg(`key`)/12,0)  as `key`\
                  from dj_echonest e\
                  inner join dj_unique_tracks_v3 t \
                  on e.aid = t.userid \
                  where  t.tid =" +track_id +"\
                  and e.danceability is not null \
                  group by 1,2 \
                  order by have_echo desc limit 1"*/

      var stmt = "select tid, have_echo, coalesce(avg(danceability),0) as danceability, coalesce(avg(energy),0) as energy, coalesce(avg(acousticness),0) as acousticness, coalesce(avg(tempo),0) as tempo, coalesce(avg(instrumentalness),0) as instrumentalness, coalesce(avg(valence),0) as valence, coalesce(avg(liveness),0) as liveness, coalesce(avg(speechiness),0) as speechiness, coalesce(avg(`key`),0)  as `key`\
                  from echoproxies e\
                  where  tid =" +track_id +"\
                  and danceability is not null \
                  group by 1,2 \
                  order by have_echo desc limit 1"

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");


      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);

          rows.forEach(function(entry) {
              //console.log(entry);
          });

          res.send(JSON.stringify(rows));
        }
        else
          console.log('Error while performing Query.');
      });

      connection.end();

      
});


app.post("/likes", function (req, res) {
      var track_id = req.body.tid;
      var user_id = req.body.userid;

      var connection = mysql.createConnection({
        host     : 'blastafast.c7dfxf4q39rn.us-east-1.rds.amazonaws.com',
        user     : 'blastafast',
        password : 'blastafast',
        database : 'blastafast'
      });

      connection.connect();

      var stmt = "insert into user_sessions values ("+user_id+", 1, "+track_id+", 1, NOW(), 0, NULL, 1, NOW(), 0, NULL, 0, NULL, 0, NULL) ON DUPLICATE KEY UPDATE likes=likes+1, last_liked_timestamp = NOW()"

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 
      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);
          res.send(JSON.stringify({"profile_update":"like"}));
        }
        else
          console.log('Error while performing Query.');
      });
      connection.end();
});


app.post("/plays", function (req, res) {
      var track_id = req.body.tid;
      var user_id = req.body.userid;
      console.log("user "+user_id+" plays "+track_id)
      var connection = mysql.createConnection({
        host     : 'blastafast.c7dfxf4q39rn.us-east-1.rds.amazonaws.com',
        user     : 'blastafast',
        password : 'blastafast',
        database : 'blastafast'
      });

      connection.connect();

      var stmt = "insert into user_sessions values ("+user_id+", 1, "+track_id+", 1, NOW(), 0, NULL, 0, NULL, 0, NULL, 0, NULL, 0, NULL) ON DUPLICATE KEY UPDATE plays=plays+1, last_played_timestamp = NOW()"

      console.log(stmt);

      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);
          res.send(JSON.stringify({"profile_update":"play"}));
        }
        else
          console.log('Error while performing Query.');
      });
      connection.end();
});

app.post("/hates", function (req, res) {
      var track_id = req.body.tid;
      var user_id = req.body.userid;

      var connection = mysql.createConnection({
        host     : 'blastafast.c7dfxf4q39rn.us-east-1.rds.amazonaws.com',
        user     : 'blastafast',
        password : 'blastafast',
        database : 'blastafast'
      });

      connection.connect();

      var stmt = "insert into user_sessions values ("+user_id+", 1, "+track_id+", 1, NOW(), 0, NULL, 0, NULL, 1, NOW(), 0, NULL, 0, NULL) ON DUPLICATE KEY UPDATE hates=hates+1, last_hated_timestamp = NOW()"

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 
      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);
          res.send(JSON.stringify({"profile_update":"hate"}));
        }
        else
          console.log('Error while performing Query.');
      });
      connection.end();
});



app.post("/skips", function (req, res) {
      var track_id = req.body.tid;
      var user_id = req.body.userid;

      var connection = mysql.createConnection({
        host     : 'blastafast.c7dfxf4q39rn.us-east-1.rds.amazonaws.com',
        user     : 'blastafast',
        password : 'blastafast',
        database : 'blastafast'
      });

      connection.connect();

      var stmt = "insert into user_sessions values ("+user_id+", 1, "+track_id+", 1, NOW(), 1, NOW(), 0, NULL, 0, NULL, 0, NULL, 0, NULL) ON DUPLICATE KEY UPDATE skips=skips+1, last_skip_timestamp = NOW()"

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 
      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);
          res.send(JSON.stringify({"profile_update":"skip"}));
        }
        else
          console.log('Error while performing Query.');
      });
      connection.end();
});


app.post("/startsradio", function (req, res) {
      var track_id = req.body.tid;
      var user_id = req.body.userid;

      var connection = mysql.createConnection({
        host     : 'blastafast.c7dfxf4q39rn.us-east-1.rds.amazonaws.com',
        user     : 'blastafast',
        password : 'blastafast',
        database : 'blastafast'
      });

      connection.connect();

      var stmt = "insert into user_sessions values ("+user_id+", 1, "+track_id+", 1, NOW(), 0, NULL, 0, NULL, 0, NULL, 1, NOW(), 0, NULL) ON DUPLICATE KEY UPDATE startsradio=startsradio+1, last_startsradio_timestamp = NOW()"

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 
      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);
          res.send(JSON.stringify({"profile_update":"startsradio"}));
        }
        else
          console.log('Error while performing Query.');
      });
      connection.end();
});


app.post("/stopsradio", function (req, res) {
      var user_id = req.body.userid;

      var connection = mysql.createConnection({
        host     : 'blastafast.c7dfxf4q39rn.us-east-1.rds.amazonaws.com',
        user     : 'blastafast',
        password : 'blastafast',
        database : 'blastafast'
      });

      connection.connect();

      var stmt = "insert into user_sessions select "+user_id+", 1, tid, 1, NOW(), 0, NULL, 0, NULL, 0, NULL, 1, NOW(), 0, NULL \
                  from (select tid from user_sessions \
                  where userid = "+user_id+" \
                  and last_startsradio_timestamp > coalesce(last_stopsradio_timestamp,0) \
                  order by last_startsradio_timestamp desc \
                  limit 1) lastradio \
                  ON DUPLICATE KEY UPDATE stopsradio=stopsradio+1, last_stopsradio_timestamp = NOW()"

      console.log(stmt);
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
 
      connection.query(stmt, function(err, rows, fields) {
        if (!err){
          //console.log('mysql returns: ', rows);
          res.send(JSON.stringify({"profile_update":"stopsradio"}));
        }
        else
          console.log('Error while performing Query.');
      });
      connection.end();
});




//app.listen(3000);
//console.log("The server is now running on port 3000.");

//Create our Express-powered HTTP server: http.createServer(app).listen(port);

app.listen(port, function () { 
   console.log('Our app is running on http://localhost:' +port);
});
