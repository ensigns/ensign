var http = require('http');

class Ensign{
  constructor(id, route, auth, access, sign){
    this.id = id;
    this.pub= pub;
    this.pri= pri;
    this.route = route;
    this.auth = auth;
    this.access = access;
    this.sign = sign;
  }
  // be sure to describe what's expected for req and path
  request(path, req, done){
    var routed = this.route.route(path);
    var host = routed[0];
    var uri = routed[1];
    var name = req.header.From;
    // check if user is who they say and can access
    var valid = this.access.access(name, path) && this.auth.auth(name, req.header.Authorization);
    if (valid){
      var out = req;
      out.host = host;
      out.path = uri;
      // send this new request
      // forward result to user
      var options = {};
      options.method = req.method;
      options.headers = req.header;
      options.headers.Via = this.id;
      var signature = this.sign.sign(req);
      options.headers.Authorization = signature;
      options.host = host;
      optins.path = uri;
      http.request(options, function(rsp){
        if (res.statusCode == 404){
          done(404);
        }
        else {
          var chunks = [];
          res.on('data', (c)=>chunks.push(c))
          .on('end', () => done(Buffer.concat(chunks)));
        }
      });
    }
    else{
      // DO NOT send this request
      done(401);
    }
  }
}

// route like /host/redirected/uri
class TestRoute{
  route(path){
    // TODO if leading slash, increment each by 1
    var host = path.split("/")[0];
    var route = path.slice(1);
    return [host, path];
  }

}

//very trusting authentication module
class TestAuth(){
  auth(name, auth){
    return true;
  }

}

// anyone can access anything
class TestAccess{
  access(name, path){
    return true;
  }

}

// return empty string
// TODO make actually sign
class TestSign{
  constructor(pub, pri){
    this.pub = pub;
    this.pri = pri;
  }
  sign(req){
    return "";
  }
}

module.exports = {"Ensign": Ensign, "TestRoute": TestRoute, "TestAuth": TestAuth, "TestAccess": TestAccess, "TestSign": TestSign};

// TODO -- big TODO document this protocol
