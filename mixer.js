var toHEX = function(){
  if (arguments.length === 0) {
    throw "toHex no args";
    return "FFFF00";
  }
  if (arguments[0].constructor === Array){
    args = Array.prototype.slice.call(arguments[0]);
  } else {
    args = Array.prototype.slice.call(arguments);
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
var bg = document.querySelector("body");
var swa = document.querySelectorAll(".swatch");
swa = Array.prototype.slice.call(swa);
var clos = 0;
var pos = 0;
var cie = [];
Leap.loop(function(a){
  clos = a;
  var of = [75.3472, -78.2791, -100.713];
  var mu = [197.35219999999995, 182.87890000000002, -226.148];
  pos = clos.pointables[0].tipPosition;
  win = [(pos[0] + of[0])/mu[0], (pos[1] + of[1])/mu[1], (pos[2] + of[2])/mu[2]]
  bg.style.background = "#"+toHEX(win);
  cie = jankyColor(toHEX(win));
});
setInterval(function(){put({xy:cie})},1000);
