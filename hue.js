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

var hexToCIE = function(color, gamut){
  var r = parseInt(color.substr(0,2), 16)/255
  var g = parseInt(color.substr(2,2), 16)/255
  var b = parseInt(color.substr(4,2), 16)/255
  r = Math.pow(r, (2.2));
  g = Math.pow(g, (2.2));
  b = Math.pow(b, (2.2));
  return toCart(r,g,b,gamut[0],gamut[1],gamut[2])
}
//compatibilitycurry
var jankyColor = function(a){return hexToCIE(a,hueGamut)};

var CIEToHex = function(pt, gamut, error){
  var error = (error === true) ? "ff0000" : error;
  var pt = (error === undefined) ? k_co.clipto(pt, gamut[0], gamut[1], gamut[2]) : pt;
  var bary = toBary(pt, gamut[0], gamut[1], gamut[2]);
  var min = Math.min(bary.r, bary.g, bary.b);
  //normalize
  bary.r = Math.pow(bary.r, (1/2.2));
  bary.g = Math.pow(bary.g, (1/2.2));
  bary.b = Math.pow(bary.b, (1/2.2));
  
  if (min < 0){
    return error;
  } else {
    return k_co.toHEX(bary.r, bary.g, bary.b)
  };
}

//make a function that takes some arguments and outputs a curried put from another thing and allows it to take more arguments
var fade = function(put, scale, time, steps){
  var t = [];
  for (var i = 0; i < steps; i++) {
    var pos = (i/(steps-1))
    var color = scale(pos).hex().substr(1);
    var xyc = hexToCIE(color, hueGamut);
    t[i] = xyc;
    if (i === 0) {
      put({xy: t[0], transitime:0});
    } else {
    setTimeout(
        function(n, tt){
          put({xy: t[n], transitiontime:Math.round(tt/100)});
        }, (time*(pos-(1/steps))), i , (time/steps));
    };
  };
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
var bez = chroma.interpolate.bezier(['red', 'yellow', 'blue', 'purple']);
var testscale = chroma.scale(bez).correctLightness(true);
var rotate = chroma.scale(["red","blue", "green", "red"]);
//fade(lights[0].put, testscale, 10000, 5)
