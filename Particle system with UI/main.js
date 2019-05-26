var supposedScreenSize = {
  'x': 100,
  'y': 100
};
var crispness = 3;
var canvas;

function format() {
  document.getElementById("codeedit").value = js_beautify(document.getElementById("codeedit").value, {
    indent_size: 2,
    space_in_empty_paren: true
  });
}

function run() {
  try {

    eval(document.getElementById("codeedit").value);
  } catch (e) {
    $("#error").html(e.message);

    $("#error").show().delay(2000).fadeOut(200);


  }
}

function preset(x) {
  var objs = [
    `ps = new Particlesys(function(particle, world) {
  world.getWithinRange(particle, 50).forEach((i) => {
    particle.xv += (i.x - particle.x) * i.size / Math.max(.0000000000000000000000000000000001, Math.pow(Math.hypot(particle.x - i.x, particle.y - i.y), 2)) / 70;
    particle.yv += (i.y - particle.y) * i.size / Math.max(.0000000000000000000000000000000001, Math.pow(Math.hypot(particle.x - i.x, particle.y - i.y), 2)) / 70;
  });
}, new generators.allOut(1, 600, 8), 10);`,
    `ps = new Particlesys(function(particle, world) {

  var newxv = 0,
    newyv = 0;

  world.getWithinRange(particle, 40).forEach((i) => {
    var dist = Math.hypot(particle.x - i.x, particle.y - i.y);
    if (dist > 6) {
      newxv += (i.x - particle.x) * i.size / Math.pow(dist, 2.1) / 2;
      newyv += (i.y - particle.y) * i.size / Math.pow(dist, 2.1) / 2;
    }
    if (dist > 0) {
      newxv += (particle.x - i.x) * i.size / dist * Math.pow(Math.max(0, 5 - dist), 1.3) / 2;
      newyv += (particle.y - i.y) * i.size / dist * Math.pow(Math.max(0, 5 - dist), 1.3) / 2;
    }
  });
  newyv = Math.max(newyv, -1);
  newyv = Math.min(newyv, 1);
  newxv = Math.max(newxv, -1);
  newxv = Math.min(newxv, 1);

  particle.yv += newyv;
  particle.xv += newxv;

  particle.yv += 2;

  if (particle.y > 0) {
    particle.y -= particle.yv;

    particle.yv *= -.1;
  }

  particle.xv *= .9;
  particle.yv *= .9;

}, new generators.randomDir(800, 700, 1300, 10), 10);
ps.forEach(function(i) {
  i.y -= 4000
});`,
    `ps = new Particlesys(function(particle, world) {

  var newxv = particle.xv,
    newyv = particle.yv;

  world.getWithinRange(particle, 40).forEach((i) => {
    var dist = Math.hypot(particle.x - i.x, particle.y - i.y);
    if (dist > 4) {
      newxv += (i.x - particle.x) * i.size / Math.pow(dist, 2.2) / 1;
      newxv += (i.y - particle.y) * i.size / Math.pow(dist, 2.2) / 1;
    }
    if (dist > 0) {
      newxv += (particle.x - i.x) * i.size / dist * Math.max(0, 5 - dist) / 2;
      newxv += (particle.y - i.y) * i.size / dist * Math.max(0, 5 - dist) / 2;
    }
  });

  particle.yv = newyv;
  particle.xv = newxv;

  if (particle.y > 0) {
    particle.y -= particle.yv;

    particle.yv *= -.5;
  }

  particle.xv *= .9;
  particle.yv *= .9;

}, new generators.randomDir(1000, 1000, 1500, 6), 10);`

  ];
  document.getElementById("codeedit").value = objs[x];
  run();
}
var ps;
window.onload = function() {
  preset(0);

  $("#error").hide();

  canvas = document.getElementById("bg");

  var mousescrool = 0;

  function drawBG(ctx) {
    ps.userControl(ctx, mouse.fg.x, mouse.fg.y, mouse.down, mousescrool);
    mousescrool = 0;
  }

  function tick() {
    ps.tick();
  }

  canvas.onwheel = function(event) {
    event.preventDefault()
    mousescrool = (event.deltaY);
  }
  /*               EXER               */



  function draw() {
    var sty = getComputedStyle(canvas);

    canvas.width = parseInt(sty.width.slice(0, -2)) * crispness;
    canvas.height = parseInt(sty.height.slice(0, -2)) * crispness;

    //  canvas.style.transform = " scale(" + (1 / crispness) + ")";
    var ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    var scale = supposedScreenSize.x / supposedScreenSize.y < canvas.width / canvas.height ? canvas.width / supposedScreenSize.x : canvas.height / supposedScreenSize.y;
    ctx.scale(scale, scale);
    drawBG(ctx);


  }

  var mouse = {
    x: 0,
    y: 0,
    fg: {
      x: 0,
      y: 0
    },
    down: false
  }
  var keyboard = {
    code: {

    }
  }

  window.setInterval(draw, 50);
  window.onresize = draw;
  window.setInterval(tick, 50);

  function handleMouseEvent(x, y) {
    scale = supposedScreenSize.x / supposedScreenSize.y < canvas.width / canvas.height ? canvas.width / supposedScreenSize.x : canvas.height / supposedScreenSize.y;
    mouse.fg.x = x / scale * crispness;
    mouse.fg.y = y / scale * crispness;
  }
  canvas.onmousedown = function(e) {
    mouse.down = true;
    handleMouseEvent(e.clientX, e.clientY);
  }
  canvas.onmouseup = function(e) {
    mouse.down = false;
  }
  canvas.onmousemove = function(e) {
    handleMouseEvent(e.clientX, e.clientY);
  }
  canvas.onkeydown = function(e) {
    keyboard[e.key] = true;
    keyboard.code[e.keyCode] = true;
  }
  canvas.onkeyup = function(e) {
    keyboard[e.key] = false;
    keyboard.code[e.keyCode] = false;
  }
}
