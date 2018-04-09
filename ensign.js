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
  request(path, req){
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
      var signature = this.sign.sign();
      out.header.Via = this.id;
      out.header.Authorization = signature;
      // send this new request
      // forward result to user
      return "";
    }
    else{
      // DO NOT send this request
      return 401;
    }
  }
}

// route like /host/redirected/uri
class EnRoute{
  route(path){
    var host = path;
    var route = path;
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


// TODO -- big TODO document this protocol
