var express = require("express"),
   http = require("http"),
   app;

// Create our Express-powered HTTP server 
// and have it listen on port 3000

app = express(); 
http.createServer(app).listen(3000);

// set up our routes
app.get("/hello", function (req, res) { 
   res.send("Hello World!");
});

app.get("/goodbye", function (req, res) { 
   res.send("Goodbye World!");
});


app.get("/", function (req, res) { 
   res.send("This is the root route!");
});

app.get("/index.html", function (req, res) { 
   res.send("<html><head></head><body><h1>Hello World!</h1></body></html>");
});
