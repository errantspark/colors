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
//[0.4078,0.5144] green lights
//ARCHITECTURE NOTES should have functions to put/set/get etc that take a function that generates the json and a function? or maybe just object that has easy paths to different things, like the different bulbs and such, have to read up more on the API
