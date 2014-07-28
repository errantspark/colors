var k_co = {};

(function(){
  
//a horribly overloaded and confusing
k_co.toHEX = function(){
  if (arguments.length === 0) {
    throw "toHex no args";
    return "FFFF00";
  }
  if (arguments[0].constructor === Array){
    var args = Array.prototype.slice.call(arguments[0]);
  } else {
    var args = Array.prototype.slice.call(arguments);
  }
  if (5 < args.length) {
    throw "toHEX got too many things, args was:" + args;
    return;
  }
  var min = args.reduce(function(a,b){if (a < b){return a;} else {return b;}});
  if (0 > min) {
    var shift = 0-min;
    args = args.map(function(a){return a+shift;});
  }
  var max = args.reduce(function(a,b){if (a > b){return a;} else {return b;}});
  if (1 < max) {
    var mult = 1/max;
    args = args.map(function(a){return a*mult;});
  }

  args = args.map(function(a){return Math.round(a*255);});

  with(Math){
    //This turns an array of 3 numbers from 0 to 255 into a single hex string of 3 sets of 2 chars
    return (pow(16,6)+args[0]*pow(16, 4)+args[1]*pow(16, 2)+args[2]).toString(16).substr(1);
  }
}

//http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
var sqr = function(x) { return x * x }
//takes two points and finds the distance between them squared
var dist2 = function(v, w) { return sqr(v[0] - w[0]) + sqr(v[1] - w[1]) }
// 
var closestpoint = function(p, v, w) {
  var l2 = dist2(v, w);
  //if the segment is zero length than it is the closest point on the segment
  //to anything
  if (l2 == 0) return v;
  //what the fuck is t even?
  var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  if (t < 0) return v;
  if (t > 1) return w;
  return [v[0] + t * (w[0] - v[0]),
          v[1] + t * (w[1] - v[1])];
}

//http://stackoverflow.com/questions/2049582/how-to-determine-a-point-in-a-triangle
var intriangle = function(p, p0, p1, p2) {
    var A = 1/2 * (-p1[1] * p2[0] + p0[1] * (-p1[0] + p2[0]) + p0[0] * (p1[1] - p2[1]) + p1[0] * p2[1]);
    var sign = A < 0 ? -1 : 1;
    var s = (p0[1] * p2[0] - p0[0] * p2[1] + (p2[1] - p0[1]) * p[0] + (p0[0] - p2[0]) * p[1]) * sign;
    var t = (p0[0] * p1[1] - p0[1] * p1[0] + (p0[1] - p1[1]) * p[0] + (p1[0] - p0[0]) * p[1]) * sign;
    
    return s > 0 && t > 0 && (s + t) < 2 * A * sign;
}

k_co.intriangle = intriangle;
k_co.clipto = function(p, a, b, c){
  if (intriangle(p, a, b, c)) return p;
  var ab = closestpoint(p,a,b)
  var ac = closestpoint(p,a,c)
  var bc = closestpoint(p,b,c)
  var pt = [];
  if (dist2(ab, p)>dist2(ac, p)) {
    pt = ac;
  } else {
    pt = ab;
  }

  if (dist2(pt, p)>dist2(bc, p)) {
    pt = bc;
  }
  
    return pt;
}

})();
