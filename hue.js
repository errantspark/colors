var req = new XMLHttpRequest();
var HURL = "http://10.0.0.55/";
var put = function(json){
    req.open('put', HURL+"api/newdeveloper/groups/0/action", true);
    req.send(JSON.stringify(json));
};
put({alert:'select'});
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
