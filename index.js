var express = require("express"),
  http = require("http"),
  app = express(),
  cors = require('cors'),
  request = require('request'),
  bodyParser = require('body-parser');

var credentials = require('./credentials.json');

var port = process.env.PORT || 3000

// set up a static file directory to use for default routing __dirname will resolve to the directory the executing script resides in. So if your script resides in /home/sites/app.js, __dirname will resolve to /home/sites.
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());


// set up our routes
app.get("/", function (req, res) { 
   res.send("index.html");
});

app.get("/stratus", function (req, res) { 
   res.send("stratus.html");
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
      track_id = req.body.id;
      var url = "https://api.soundcloud.com/tracks/"+track_id+".json?client_id="+credentials.client_id;
      console.log("getInfo: " + url);
        
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var info = JSON.parse(body)
          res.send(info);
        }
      })
});
//app.listen(3000);
//console.log("The server is now running on port 3000.");

//Create our Express-powered HTTP server: http.createServer(app).listen(port);

app.listen(port, function () { 
   console.log('Our app is running on http://localhost:' +port);
});
