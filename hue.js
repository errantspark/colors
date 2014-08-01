var req = new XMLHttpRequest();
var developerid = 'newdeveloper';
var basestation = "http://10.0.0.55/";
var group0uri = basestation+"api/"+developerid+"/groups/0";
var defcon = {on:true, ct:280, sat:255, bri:255};
   // For the hue bulb the corners of the triangle are:
    // -Red: 0.675, 0.322
    // -Green: 0.4091, 0.518
    // -Blue: 0.167, 0.04

var Group = function(resource){
  this.resource = resource;
  var xml = new XMLHttpRequest();
  this.xml = xml;
  var put = function(json){
    xml.open('put', resource+"/action", true);
    xml.send(JSON.stringify(json));
  };
  var get = function(){
    //this probably shouldn't be synchronous maybe? but how fix?
    xml.open('get', resource, false);
    xml.send();
    return JSON.parse(xml.response);
  };
  this.put = put; 
  this.get = get; 
};

var Lumi = function(resource){
  this.resource = resource;
  var xml = new XMLHttpRequest();
  this.xml = xml;
  var put = function(json){
    xml.open('put', resource+"/state", true);
    xml.send(JSON.stringify(json));
  };
   var get = function(){
    //this probably shouldn't be synchronous maybe? but how fix?
    xml.open('get', resource, false);
    xml.send();
    return JSON.parse(xml.response);
  };
   this.get = get; 
  this.put = put; 
};

//this entire function is awful and needs to go
var initiate = function(n){
  req.open('get', basestation+"api/"+developerid+"/lights", false);
  req.send();
  var lindex = JSON.parse(req.response);
  var lights = [];
  for(var attrname in lindex){ lights.push(attrname)};
  lights = lights.map(function(n){return new Lumi(basestation+"api/"+developerid+"/lights/"+n)});
  n.lights = lights;
  n.group0 = new Group(group0uri);
};
  
initiate(window);
//var group0 = new Group(group0uri);
group0.put({alert:'select'});

var jankyColor = function(color){
  var r = parseInt(color.substr(0,2), 16)/255
  var g = parseInt(color.substr(2,2), 16)/255
  var b = parseInt(color.substr(4,2), 16)/255
  var bright = Math.round((r + g + b)/3);
  var X = 0.4124*r + 0.3576*g + 0.1805*b;
  var Y = 0.2126*r + 0.7152*g + 0.0722*b;
  var Z = 0.0193*r + 0.1192*g + 0.9505*b;
  var x = X / (X + Y + Z)
  var y = Y / (X + Y + Z)
  return [x,y];
  //var hue = Math.atan2(Math.sqrt(3)*(g-b), 2*(r-g-b))
  //return Math.round((hue+Math.PI)*(65280/(Math.PI*2)));   
} 

var slope = function(p0,p1){
  return (p1[1]-p0[1])/(p1[0] - p0[0])
}

var sqr = function(x) { return x * x }
var distnc = function(v, w) { return Math.sqrt((sqr(w[0]-v[0]) + sqr(w[1] - v[1]))) }

var perline = function(a, b, r){
  return [((b[0]-a[0])*r)+a[0],((b[1]-a[1])*r)+a[1]]
}

var tricen = function(p0,p1,p2){
  return [(p0[0]+p1[0]+p2[0])/3,(p0[1]+p1[1]+p2[1])/3]
}

var incenter = function(a,b,c){
  var aBC = distnc(b,c);
  //console.log("b="+b+" c="+c+" distbc="+aBC)
  var bAC = distnc(a,c);
  var cAB = distnc(a,b);
  var peri = aBC + bAC + cAB;
  //console.log("xx: ("+aBC+"*"+a[0]+") + ("+bAC+"*"+b[0]+") + ("+cAB+"*"+c[0]+") / "+peri);
  var xx = (aBC*a[0] + bAC*b[0] + cAB*c[0]) / peri
  var yy = (aBC*a[1] + bAC*b[1] + cAB*c[1]) / peri
  return [xx, yy];
}

//i have to invert this function easy peasy, you get an incenter and a triangle and youfigure out, wait don't distances to the points/distances to edges work? no
//
var retri = function(r,g,b,p0,p1,p2){
  //console.profile()
  //console.time("retri")
  var ration = function(l, n){
    if (l+n === 0) {
      return 0.5;
    } else {
      return (n/(l+n));
    }
  }
  var n0 = perline(p0, p1, ration(r,g));  
  var n1 = perline(p0, p2, ration(r,b));  
  var n2 = perline(p1, p2, ration(g,b));  
  //console.log("barytri: "+n0+", "+n1+", "+n2)
  var end =  incenter(n0,n1,n2);
  //console.timeEnd("retri");
  //console.log("wtf");
  //console.profileEnd();
  return end;
}

var garbage = function(){
  console.log("test")
}

var jankyColor2 = function(color){
  var r = parseInt(color.substr(0,2), 16)/255
  var g = parseInt(color.substr(2,2), 16)/255
  var b = parseInt(color.substr(4,2), 16)/255
  //console.log(r+":"+g+":"+b)
  return retri(r,g,b,[0.675, 0.322],[0.4091, 0.518],[0.167, 0.04])
}

var retri2 = function(r,g,b,p0,p1,p2){
  //console.profile()
  //console.time("retri")
  var ration = function(l, n){
   if (l+n === 0) {
      return 0.5;
    } else {
      return (n/(l+n));
    }
  }
  var n0 = perline(p0, p1, ration(r,g));  
  var n1 = perline(n0, p2, ration((r+g),b));  
  //console.timeEnd("retri");
  //console.profileEnd()
  return n1;
}
//make a function that takes some arguments and outputs a curried put from another thing and allows it to take more arguments
var fade = function(put, scale, time, steps){
  var t = [];
  for (var i = 0; i < steps; i++) {
    var pos = (i/(steps-1))
    //console.log(pos);
    var color = scale(pos).hex().substr(1);
    //console.log(color);
    var xyc = jankyColor2(color);
    t[i] = xyc;
    if (i === 0) {
      put({xy: t[0], transitime:0});
    } else {
    setTimeout(
        function(n, tt){
          //console.log(tt);
          put({xy: t[n], transitiontime:Math.round(tt/100)});
        }, (time*(pos-(1/steps))), i , (time/steps))
    }
  }
}
var bez = chroma.interpolate.bezier(['red', 'yellow', 'blue', 'purple']);
var testscale = chroma.scale(bez).correctLightness(true);
//fade(lights[0].put, testscale, 10000, 5)
//[0.4078,0.5144] green lights
//ARCHITECTURE NOTES should have functions to put/set/get etc that take a function that generates the json and a function? or maybe just object that has easy paths to different things, like the different bulbs and such, have to read up more on the API
