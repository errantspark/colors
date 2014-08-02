//points 0,0 and 0.5,0.5 of the cie diagram in image coords
var zero = [66,592]
var ptfive = [376,280]

var select = lights[0].put;

context = document.getElementById('canvas').getContext('2d');
function drawGamut(gamut){
  var cur = function(a){
    return transCoord(a, zero, ptfive);
  }
  var gamut = gamut.map(cur);
  context.strokeStyle = 'white';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(gamut[0][0], gamut[0][1]);
  context.lineTo(gamut[1][0], gamut[1][1]);
  context.lineTo(gamut[2][0], gamut[2][1]);
  context.lineTo(gamut[0][0], gamut[0][1]);
  context.stroke();  
}
drawGamut(hueGamut);
function drawPoint(a) {
  var x = a[0]
    var y = a[1]
    context.strokeStyle = 'rgba(0,0,0,0.5)';
    context.beginPath();
    context.arc(x, y, 3, 0, 2 * Math.PI, true);
    context.lineWidth = 3;
    context.stroke();
    context.strokeStyle = 'white';
    context.lineWidth = 1;
    context.beginPath();
    context.arc(x, y, 5, 0, 2 * Math.PI, true);
    context.stroke();
};
function transCoord(pt, r1, r2){
  var oneone = [(r2[0]-r1[0])*2,-(r2[1]-r1[1])*2];
  var ptr = [pt[0]*oneone[0], pt[1]*oneone[1]];
  var back = [ptr[0]+r1[0],(-(ptr[1]))+r1[1]]
  return back;
}
function transCoord2(pt, r1, r2){
  var oneone = [(r2[0]-r1[0])*2,-(r2[1]-r1[1])*2];
  var ptr = [pt[0]-r1[0], pt[1]-r1[1]]
  var back = [ptr[0]/oneone[0], (-ptr[1])/oneone[1]];
  return back;
}
var lastclick = []
function mouseMove(e)
{
    var mouseX, mouseY;
    if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if(e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
    context.clearRect(0,0,603,660);
    drawGamut(hueGamut);
    drawPoint([mouseX, mouseY]);
    lastclick = [mouseX, mouseY]; 
    select({xy:transCoord2([mouseX, mouseY], zero, ptfive), bri:parseInt(document.getElementById('brightSlider').value)});
}
$("#one").on('click',  function(){select = lights[0].put});
$("#two").on('click',  function(){select = lights[1].put});
$("#three").on('click',  function(){select = lights[2].put});
$("#all").on('click', function(){select = group0.put});
document.getElementById('canvas').onclick = mouseMove;
