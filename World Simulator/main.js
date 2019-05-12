var supposedScreenSize = {
  'x': 100,
  'y': 100
};
var crispness = 3;
var images = {
  "hi": "https://dummyimage.com/400x400/000/fff"
};


function drawFG(ctx) {

}
var particles = [];

for (var i = 0; i < 500; i++) {
  var obj={
    x: (Math.random() - .5) * 400,
    y: (Math.random() - .5) * 400,

  };
  obj.xv=obj.x/1000+(Math.random() - .5) * 40;
  obj.yv=obj.y/1000+(Math.random() - .5) * 40;

  particles.push(obj);

}
var displayscale=2;
function dist(a, b) {

  return (Math.hypot(a.x - b.x, a.y - b.y));
}

function clock(a, b, c) {
  if (b > c) return (clock(a, c, b));
  return (a + Math.ceil((b - a) / (c - b)) * (c - b));
}
var avrmean = 1,
  avrx = 0,
  avry = 0;

function drawBG(ctx) {
  var mx = 0;
  my = 0, mean = 0;
  for (var ths = 0; ths < particles.length; ths++) {
    for (var other = 0; other < particles.length; other++) {
      var dst = dist(particles[ths], particles[other]);
      if (dst > .1) {
        particles[ths].xv += (particles[other].x - particles[ths].x) / Math.pow(dst, 2) / 20;
        particles[ths].yv += (particles[other].y - particles[ths].y) / Math.pow(dst, 2) / 20;
      }
      mean += dst;
    }
  }

  for (var i = 0; i < particles.length; i++) {
    particles[i].x += particles[i].xv / 20;
    particles[i].y += particles[i].yv / 20;
    mx += particles[i].x;
    my += particles[i].y;

  }
  mean /= particles.length * particles.length * 50;
  mean = 1 / mean;
  mx /= particles.length;
  my /= particles.length;
  avrmean = .5 * avrmean + .5 * mean;
  avrx = .5 * avrx + .5 * mx;
  avry = .5 * avry + .5 * my;


  var viewportxmin = -50 / avrmean + avrx;
  var viewportxmax = 50 / avrmean + avrx;
  var viewportymin = -50 / avrmean + avry;
  var viewportymax = 50 / avrmean + avry;
  ctx.fillStyle = 'lightgray';
  for (var x = clock(0, Math.floor(viewportxmin), Math.ceil(viewportxmin)); x <= Math.ceil(viewportxmax); x += 1) {
    ctx.fillRect((x - avrx) * avrmean, -50, .1 * avrmean*displayscale, 100);
  }
  for (var y = clock(0, Math.floor(viewportymin), Math.ceil(viewportymin)); y <= Math.ceil(viewportymax); y += 1) {
    ctx.fillRect(-50, (y - avry) * avrmean, 100, .1 * avrmean*displayscale);
  }

  ctx.fillStyle = 'black';

  ctx.fillRect((0 - avrx) * avrmean, 50, .2 * avrmean, -100);
  ctx.fillRect(50, (-avry) * avrmean, -100, .2 * avrmean);


  for (var i = 0; i < particles.length; i++) {
    ctx.beginPath();

    ctx.arc((particles[i].x - avrx) * avrmean, (particles[i].y - avry) * avrmean, .2 * avrmean*displayscale, 0, Math.PI * 2);
    ctx.fill();

  }

}

/*               EXER               */

function loadImages() {
  var addTo = document.getElementById("_LOADIMG");
  Object.keys(images).forEach(function(i) {
    var g = document.createElement("img");
    g.src = images[i];
    addTo.appendChild(g);
    images[i] = g;
  });
}
window.onload = function() {
  loadImages();
}

function draw() {
  var canvas = document.getElementById('bg');
  canvas.style.transform = "translate(-50%, -50%) scale(" + (1 / crispness) + ")";
  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth * crispness;
  canvas.height = window.innerHeight * crispness;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  var scale = supposedScreenSize.x / supposedScreenSize.y < canvas.width / canvas.height ? canvas.width / supposedScreenSize.x : canvas.height / supposedScreenSize.y;
  ctx.scale(scale, scale);
  drawBG(ctx);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  scale = supposedScreenSize.x / supposedScreenSize.y > canvas.width / canvas.height ? canvas.width / supposedScreenSize.x : canvas.height / supposedScreenSize.y;
  ctx.scale(scale, scale);
  drawFG(ctx);

}

var mouse = {
  'x': 0,
  'y': 0,
  'down': false
}
var keyboard = {
  code: {

  }
}
//window.setTimeout(draw,1000);

//window.setInterval(draw, 50);

//window.onresize = draw;
function doo(){
  draw();
  window.setTimeout(doo,10);
}
window.setTimeout(doo,100);
function handleMouseEvent(x, y) {
  var canvas = document.getElementById('bg');

  scale = supposedScreenSize.x / supposedScreenSize.y > canvas.width / canvas.height ? canvas.width / supposedScreenSize.x : canvas.height / supposedScreenSize.y;
  mouse.x = (x - window.innerWidth / 2) / scale * crispness;
  mouse.y = (y - window.innerHeight / 2) / scale * crispness;

}
window.onmousedown = function(e) {
  mouse.down = true;
  handleMouseEvent(e.clientX, e.clientY);
}
window.onmouseup = function(e) {
  mouse.down = false;
}
window.onmousemove = function(e) {
  handleMouseEvent(e.clientX, e.clientY);
}
window.onkeydown = function(e) {
  keyboard[e.key] = true;
  keyboard.code[e.keyCode] = true;
}
window.onkeyup = function(e) {
  keyboard[e.key] = false;
  keyboard.code[e.keyCode] = false;
}
