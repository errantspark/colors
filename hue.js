var req = new XMLHttpRequest();
var developerid = 'newdeveloper';
var basestation = "http://10.0.0.55/";
var group0uri = basestation+"api/"+developerid+"/groups/0";
var defcon = {on:true, ct:280, sat:255, bri:255};

//gamut of various things in the CIE 1931 color space
var hueGamut = [[0.675,0.322],[0.409,0.518],[0.167,0.04]]
var delGamut = [[0.675,0.329],[0.316,0.598],[0.157,0.063]]

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

group0.put({alert:'select'});

var jankyColor2 = function(color){
  var r = parseInt(color.substr(0,2), 16)/255
  var g = parseInt(color.substr(2,2), 16)/255
  var b = parseInt(color.substr(4,2), 16)/255
  return toCart(r,g,b,hueGamut[0],hueGamut[1],hueGamut[2])
}

var toCart = function(r,g,b,d,e,f){
  var sum = [r,g,b].reduce(function(a,b){return a + b})
  r = (r/sum);
  g = (g/sum);
  b = (b/sum);
  var x = r*d[0]+g*e[0]+b*f[0];
  var y = r*d[1]+g*e[1]+b*f[1];
  return [x,y];
}

var toBary = function(p,r,g,b){
  var end = {};
  end.r = ((g[1]-b[1])*(p[0]-b[0])+(b[0]-g[0])*(p[1]-b[1]))/((g[1]-b[1])*(r[0]-b[0])+(b[0]-g[0])*(r[1]-b[1]));
  end.g = ((b[1]-r[1])*(p[0]-b[0])+(r[0]-b[0])*(p[1]-b[1]))/((g[1]-b[1])*(r[0]-b[0])+(b[0]-g[0])*(r[1]-b[1]));
  end.b = 1-end.r-end.g;
  return end;
};

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
//ARCHITECTURE NOTES should have functions to put/set/get etc that take a function that generates the json and a function? or maybe just object that has easy paths to different things, like the different bulbs and such, have to read up more on the API
