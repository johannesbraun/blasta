var express = require("express");
var http = require("http");
var app = express();


var port = process.env.PORT || 3000
// set up a static file directory to use for default routing 
//__dirname will resolve to the directory the executing script resides in. 
//So if your script resides in /home/sites/app.js, __dirname will resolve to /home/sites.
app.use(express.static(__dirname + "/public"));

// Create our Express-powered HTTP server
//http.createServer(app).listen(port);

// set up our routes
app.get("/", function (req, res) { 
   res.render("index.html");
});

app.get("/goodbye", function (req, res) { 
   res.send("Goodbye World!");
});


app.listen(port, function () { 
   console.log('Our app is running on http;//localhost:' +port);
});
