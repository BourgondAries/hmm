var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var btnHov = new Audio("Audio/button_hov.mp3"); // buffers automatically when created

var canvasTopLeft = {x:0, y:0};

var canvasTopLeftTemp = canvasTopLeft;

var infoBox = {show:false, text:'' };

var circles;

init();



function renderButton(context, x, y, r, name, highlighted) {
  context.save();

	context.beginPath();
  context.lineWidth = 3;
  context.shadowBlur = 10;
  context.shadowColor = '#4E8800';
  context.strokeStyle = '#4E8800';

	context.arc(x, y, r, 0, 2 * Math.PI);
	
  if (highlighted) {
    context.lineWidth = 4;
    context.shadowBlur = 15;
    context.shadowColor = '#6ED80D';
    context.strokeStyle = '#69B00C';
  } 

	context.stroke();
  context.restore();

	wrapText(context, name, x, y, r, highlighted)

  
}

//function wrapText(context, name, x, y, maxWidth, lineHeight) {
function wrapText(context, name, x, y, r, hl) {
  context.save();
  if (hl) {
    context.shadowBlur = 2.5;
    context.shadowColor = '#FFFFFF';
  }

  var AVG_CHAR_SIZE = 0.4586; // Calibri 1px, unit: [px/(ch 1px)]
  //var maxWidth = 0.9*2*r;
  //console.log(context.fillStyle)
  context.fillStyle = '#DDDDDD';
  context.textAlign="center";
  
  var words = name.split(' ');

  if (words.length == 1) {
    var fontSize = (0.85*2*r)/(AVG_CHAR_SIZE*words[0].length);
    y = y + fontSize/3;
    
  } else if (words.length == 2) {
    var maxLen = Math.max(words[0].length, words[1].length)
    var fontSize = (0.75*2*r)/(AVG_CHAR_SIZE*maxLen);
    y = y - fontSize*0.1;

  } else if (words.length == 3) {
    var maxLen = Math.max(words[0].length, words[1].length, words[2].length)
    var fontSize = (0.6*2*r)/(AVG_CHAR_SIZE*maxLen);
    y = y - fontSize/2;

  } else {
    words = [name];
    var fontSize = (0.85*2*r)/(AVG_CHAR_SIZE*words[0].length);
    y = y + fontSize/3;
  }
  //totlen = avgCharSize*name.length*fontSize
  //console.log(fontSize)
  var lineHeight = fontSize;
  context.font = fontSize + "px Calibri";

  for(var n = 0; n < words.length; n++) {
      context.fillText(words[n], x, y);
      y += lineHeight/1.25;
    }

  context.restore();
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function renderCanvas(xOffset, yOffset, circles) {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  
  renderBackground(ctx);

  drawLine(ctx, xOffset, yOffset, circles[0], circles[1])
  //drawLine(circles[0], circles[2])

  for (var i=0; i < circles.length; i++) {
    renderButton(ctx, circles[i].x - xOffset, circles[i].y - yOffset, circles[i].r, circles[i].name, circles[i].hl);
  }

  if (infoBox.show) {
    drawInfoBox(ctx, infoBox.text)
  }
}

function renderBackground(context) {
  context.save();
  gradient = context.createRadialGradient(canvas.width/2, canvas.height/2, 5, canvas.width/2, canvas.height/2, 300);
  gradient.addColorStop(0, '#000028');
  gradient.addColorStop(1, '#080808');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.restore();
}


function drawLine(context, xOffset, yOffset, c1, c2) {

  context.save();
  var c1x = c1.x - xOffset;
  var c1y = c1.y - yOffset;
  var c2x = c2.x - xOffset;
  var c2y = c2.y - yOffset;
  var dx = c2x-(c1.x)
  var dy = (c2y)-(c1y)
  
  a = Math.atan2(dy, dx);

  x0 = c1x + c1.r*Math.cos(a + 0.5) + 5*Math.sign(dx);
  y0 = c1y + c1.r*Math.sin(a + 0.5) + 5*Math.sign(dy);

  x1 = c1x + 2*c1.r*Math.cos(a + 0.5);
  y1 = c1y + 2*c1.r*Math.sin(a + 0.5);

  a = a + Math.PI;

  x2 = c2x + 2*c2.r*Math.cos(a - 0.5);
  y2 = c2y + 2*c2.r*Math.sin(a - 0.5);

  x3 = c2x + c2.r*Math.cos(a - 0.5) - 5*Math.sign(dx);
  y3 = c2y + c2.r*Math.sin(a - 0.5) - 5*Math.sign(dy);

  context.beginPath();
  context.moveTo(x0, y0);
  context.bezierCurveTo(x1,y1,x2,y2,x3,y3);
  context.lineWidth = 2;
  context.shadowBlur = 2.5;
  context.shadowColor = '#4E8800';
  context.strokeStyle = '#4E8800';
  context.lineCap = 'round';
  context.stroke();

  context.restore();
}
function drawInfoBox(context, infoText) {
  context.save();
  context.beginPath();
  context.lineWidth = 1;
  context.strokeStyle = '#DDDDDD';
  context.shadowColor = '#000028';
  context.globalAlpha = 0.4;
  context.fillStyle = '#DDDDDD';
  context.fillRect(canvas.width/2 + 50, 50, canvas.width/2 - 100, canvas.height - 100);
  context.stroke();

  context.restore();

  writeToBox(context, infoText);
  
}

function writeToBox(context, infoText) {
  context.save();
  context.fillStyle = '#FFFFFF';
  context.textAlign = "center";
  context.font = '30px Calibri';
  context.fillText(infoText, 3/4*canvas.width , 100);
  context.restore();
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  //console.log(rect)
  return {
    x: (evt.clientX - rect.left)*(canvas.width/rect.width),
    y: (evt.clientY - rect.top)*(canvas.height/rect.height)
  };
}

function hitTest(mousePos, circle) {
  
  rMouseCenter = (mousePos.x-circle.x+canvasTopLeft.x)*(mousePos.x-circle.x+canvasTopLeft.x) +
   (mousePos.y-circle.y+canvasTopLeft.y)*(mousePos.y-circle.y+canvasTopLeft.y);

  if (rMouseCenter < (circle.r)*(circle.r)) {
    return true;
  } else {
    return false;
  }
}


function mouseHoverListener(evt) {
  //
  var mousePos = getMousePos(canvas, evt);
  for (var i=0; i < circles.length; i++) {
    if (hitTest(mousePos, circles[i])) {
      if (circles[i].hl == false) {
        btnHov.play();
        circles[i].hl = true;
      } 
    } else {
        circles[i].hl = false;  
      }
  }

  renderCanvas(canvasTopLeft.x, canvasTopLeft.y, circles);    
}

function mouseDownListener(evt) {
  var onCircle = false;
  canvas.removeEventListener('mousemove', mouseHoverListener , false);
  window.addEventListener("mouseup", mouseUpListener, false);

  mouseOnClick = getMousePos(canvas, evt);

  for (var i=0; i < circles.length; i++) {
    if (hitTest(mouseOnClick, circles[i])) {
      infoBox.text = circles[i].facts;
      onCircle = true;
      break;
    }
  }
  if (onCircle) {
      window.removeEventListener("mouseup", mouseUpListener, false);
      //drawInfoBox(ctx, circles[i].facts);
      infoBox.show = true;
      canvas.addEventListener('mousemove', mouseHoverListener , false);
  } else {
    infoBox.show = false;
    canvas.addEventListener('mousemove', mouseMoveListener , false);   
  }

  renderCanvas(canvasTopLeft.x, canvasTopLeft.y, circles)
}

function mouseMoveListener(evt) {
  var mousePos = getMousePos(canvas, evt);
  var dx = mouseOnClick.x - mousePos.x;
  var dy = mouseOnClick.y - mousePos.y;

  renderCanvas(canvasTopLeft.x + dx, canvasTopLeft.y + dy,  circles)
}

function mouseUpListener(evt) {
  canvas.removeEventListener('mousemove', mouseMoveListener , false);
  window.removeEventListener("mouseup", mouseUpListener, false);
  canvas.addEventListener('mousemove', mouseHoverListener , false);
 
  var mouseOnUp = getMousePos(canvas, evt);
  canvasTopLeft.x += mouseOnClick.x - mouseOnUp.x;
  canvasTopLeft.y += mouseOnClick.y - mouseOnUp.y;

  renderCanvas(canvasTopLeft.x, canvasTopLeft.y, circles)
}

function zoom(evt) {

}

function init() {
  var oneonetwo = {x:canvas.width/2, y:canvas.height/2 , r:100, name:'1 + 1 = 2', facts:'Nothing here yet1' , hl:false}
  var aksiom = {x:canvas.width/2 + 600, y:canvas.height/2 - 600 , r:60, name:'Axiom', facts:'Nothing here yet2' , hl:false}
  var circle1 = {x:canvas.width/2, y:canvas.height/2 , r:50, name:'Natural numbers', facts:'Nothing here yet' , hl:false}
  var circle2 = {x:canvas.width/2 + 300, y:canvas.height/2 + 200, r:40, name:'Complex numbers', facts:'Nothing here yet' , hl:false}
  var circle3 = {x:canvas.width/2 - 100, y:canvas.height/2 - 200, r:45, name:'Irrational numbers', facts:'Nothing here yet' , hl:false}

  //circles = [circle1, circle2, circle3];
  circles = [oneonetwo, aksiom];

  renderCanvas(canvasTopLeft.x, canvasTopLeft.y, circles)
  canvas.addEventListener('mousemove', mouseHoverListener , false);
  canvas.addEventListener("mousedown", mouseDownListener, false);
}

