var express = require('express');
var ensign = require('ensign')
var app = express();

// are there keys in this dir?
// tell people how to make them
// ensure that they're gitignored.

// set up ensign
var route = ensign.TestRoute();
var auth = ensign.TestAuth();
var access = ensign.TestAccess();
var sign = ensign.TestSign("", "");
// note how to replace the modules

var gateway = new ensign.Ensign(1, route, auth, access, sign);

app.use("/", function(req, res){
  res.send(gateway.request(req.originalUrl, req));
})





app.listen(8081, () => console.log('Listening'));
