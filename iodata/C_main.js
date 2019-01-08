var TESTING=false;

var lastframe=Date.now();
var lastdata=Date.now();
var lastdatadisplay=0;
var lastping=Date.now();
var lastpingdisplay=0;



var supposedScreenSize = {
  'x': 2400,
  'y': 1400
};
var crispness = 2;
var images = {
  "hi": "https://dummyimage.com/600x400/000/fff"
};
var playerSize=[-5,-5,5,5];
var entitySize={
  0:[-5,-5,5,5]
}
if(TESTING){
var ipaddress="http://localhost:9999";
}else{
var ipaddress="https://server.larrys.tech:9999";

}
var cam={
  x:0,
  y:0,
  rot:1
}
function drawIGBG(ctx){
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(-1700,-1700, 3400, 3400);

  var xr={
    'x': 240,
    'y': 140
  }
  var po={
    'x':Math.floor(cam.x/xr.x+.5),
    'y':Math.floor(cam.y/xr.y+.5),
  }
  var qo={
    'x':Math.floor(cam.x/xr.x-.5),
    'y':Math.floor(cam.y/xr.y-.5),
  }
  function doRect(x,y,w,h,seed){
    rng = new Math.seedrandom(seed);
    var amo=rng()*6+8
    for(var i=0;i<amo;i++){
      var pos={
        'x':rng()*w+x,
        'y':rng()*h+y
      }
      var rad=rng()*2.5+.5;
      var col=rng()*255;
      ctx.fillStyle = 'rgb('+col+', '+col+', '+col+')';
      ctx.fillRect(pos.x-rad/4,pos.y-rad/1,rad/2,rad/.5);
      ctx.fillRect(pos.x-rad/1,pos.y-rad/4,rad/.5,rad/2);
      ctx.fillRect(pos.x-rad/2,pos.y-rad/2,rad/1,rad/1);

    }
  }
  ctx.fillStyle = 'rgb(14, 214, 18)';
  doRect(10*(xr.x*po.x-cam.x),10*(xr.y*po.y-cam.y), 10*xr.x,10*xr.y,po.x+po.y*34262456);//down right
  doRect(10*(xr.x*qo.x-cam.x),10*(xr.y*qo.y-cam.y), 10*xr.x,10*xr.y,qo.x+qo.y*34262456);//up left
  doRect(10*(xr.x*qo.x-cam.x),10*(xr.y*po.y-cam.y), 10*xr.x,10*xr.y,qo.x+po.y*34262456);//down left
  doRect(10*(xr.x*po.x-cam.x),10*(xr.y*qo.y-cam.y), 10*xr.x,10*xr.y,po.x+qo.y*34262456);//top right


}
function drawBG(ctx) {

  ctx.rotate(cam.rot);

  drawIGBG(ctx);
  for (var i = world.planets.length-1; i >=0; i--) {
    if(shouldBeLoaded(bodyuser,world.planets[i])){
      display(world.planets[i],ctx);
    }else{
      world.planets.splice(i,1);
    }
  }
  for (var i = world.asteroids.length-1; i >=0; i--) {
    if(shouldBeLoaded(bodyuser,world.asteroids[i])){
      display(world.asteroids[i],ctx);
    }else{
      world.asteroids.splice(i,1);
    }
  }
  display(bodyuser,ctx);

  for (var i = world.players.length-1; i >=0; i--) {
    if(shouldBeLoaded(bodyuser,world.players[i])){
      display(world.players[i],ctx);
    }else{
      world.players.splice(i,1);
    }
  }

}
function shouldBeLoaded(player,object){
  if(player===object){
    return false;
  }
  var dist=140;

  if(object instanceof Entity){
    dist+=50;
  }
  if(object instanceof Planet){
    dist+=1.5*object.outerRadius();
  }
  if(object instanceof Asteroid){
    dist+=71;
  }
  if(object instanceof Player){
    dist+=20;
  }
  return(MPL.dist(player.p,object.p)<dist);
}
function display(itm,ctx){
  var displayPos={x:10*(itm.p.x-cam.x),y:10*(itm.p.y-cam.y)};
  if(itm instanceof Asteroid){
    ctx.translate(displayPos.x,displayPos.y);
    ctx.rotate(itm.p.rot);

    var blocks=itm.phys.blocks.entries();
    for (var i = 0; i < blocks.length; i++) {
      var blok=itm.phys.blocks.get(blocks[i].x,blocks[i].y);

      ctx.translate(blocks[i].x*100,blocks[i].y*100);
      drawTile(ctx,blok);
      ctx.translate(blocks[i].x*-100,blocks[i].y*-100);

    }

    for (var i = 0; i <itm.phys.entities.length; i++) {
      var a=itm.phys.entities[i];
      var pos={x:a.p.x*10,y:a.p.y*10};

      ctx.translate(pos.x,pos.y);
      ctx.rotate(a.p.rot);
      drawItem(ctx,a);
      ctx.rotate(-a.p.rot);
      ctx.translate(-pos.x,-pos.y);

    }



    ctx.rotate(-itm.p.rot);
    ctx.translate(-displayPos.x,-displayPos.y);
  }
  if(itm instanceof Planet){
    ctx.translate(displayPos.x,displayPos.y);
    ctx.rotate(itm.p.rot);
    var o=itm.outerRadius()*10;
    var i=itm.innerRadius()*10;

    ctx.fillStyle = 'rgba(0, 153, 204,.7)';
    ctx.fillRect(-o,-o, 2*o, 2*o);

    ctx.fillStyle = 'rgb(0, 102, 0)';
    ctx.fillRect(-i,-i, 2*i, 2*i);
    var blocks=itm.phys.blocks.entries();
    for (var i = 0; i < blocks.length; i++) {
      var blok=itm.phys.blocks.get(blocks[i].x,blocks[i].y);

      ctx.translate(blocks[i].x*100,blocks[i].y*100);
      drawTile(ctx,blok);
      ctx.translate(blocks[i].x*-100,blocks[i].y*-100);

    }
    for (var i = 0; i <itm.phys.entities.length; i++) {
      var a=itm.phys.entities[i];
      var pos={x:a.p.x*10,y:a.p.y*10};

      ctx.translate(pos.x,pos.y);
      ctx.rotate(a.p.rot);
      drawItem(ctx,a);
      ctx.rotate(-a.p.rot);
      ctx.translate(-pos.x,-pos.y);

    }

    ctx.rotate(-itm.p.rot);
    ctx.translate(-displayPos.x,-displayPos.y);
  }
  if(itm instanceof Player){
    ctx.translate(displayPos.x,displayPos.y);
    ctx.rotate(itm.p.rot);
    ctx.fillStyle='red';
    ctx.fillRect(-50,-50, 100, 100);
    ctx.rotate(-itm.p.rot);
    ctx.translate(-displayPos.x,-displayPos.y);
  }
}
function drawItem(ctx,ent){
  if(ent.type===0){

    ctx.fillStyle = 'white';
    ctx.fillRect(-50,-50,100,100);
  }
}
function drawTile(ctx,tile){
  ctx.fillStyle = 'gray';

  ctx.fillRect(-50,-50,100,100);

}
function drawFG(ctx) {
  ctx.font="lighter 40px Helvetica";
  ctx.fillStyle = 'white';

  ctx.fillText("FPS: "+(1000/(Date.now()-lastframe)).toFixed(0)+"/20",-1150,-650);
  if(Date.now()-1000>lastdata){
    lastdatadisplay=0;
  }
  ctx.fillText("UPS: "+(lastdatadisplay).toFixed(0)+"/20",-1150,-605);

  ctx.fillText("Ping: "+(lastpingdisplay).toFixed(0)+"ms",-1150,-560);
lastframe=Date.now();

}

function gametick(){
  cam.x=bodyuser.p.x+bodyuser.p.xv*.2;
  cam.y=bodyuser.p.y+bodyuser.p.yv*.2;
  if(world.planets.some((a)=>a.inAtmo(bodyuser))){
    cam.rot=cam.rot*.7+.3*(-bodyuser.p.rot-Math.PI/2);

  }else{
    //cam.rot=cam.rot*.5;

  }
  socket.emit(schemapacks.punchUpdateSchema.id,schemapacks.punchUpdateSchema.encode({
    dist:Math.hypot(mouse.bg.x-10*(bodyuser.p.x-cam.x),mouse.bg.y-10*(bodyuser.p.y-cam.y))/10,
    dir:cam.rot+Math.atan2(mouse.bg.x-10*(bodyuser.p.x-cam.x),mouse.bg.y-10*(bodyuser.p.y-cam.y)),
    is:mouse.down
  }));
}

var bodyuser=null;

var world={
  players:[],
  objects:[],
  planets:[],
  asteroids:[]
};
/*   DATA   */
function BlockSet(){
  this._map=new Map();
}
function putArray(array,item){
  for (var i = 0; i < array.length; i++) {
    if(array[i].id===item.id){
      array[i]=item;
      return;
    }
  }
  array.push(item);
}
function remId(array,id){
  for (var i =array.length-1; i >=0; i--) {
    if(array[i].id===id){
      array.splice(i,1);
      return;
    }
  }
}
BlockSet.prototype.load = function(blockarray, centered) {
  for (var y = 0; y < blockarray.length; y++) {
    for (var x = 0; x < blockarray[0].length; x++) {
      this.set(x-(centered?Math.min(blockarray[0].length/2):0),y-(centered?Math.min(blockarray.length/2):0),blockarray[y][x]);
    }
  }
};
BlockSet.prototype.pop = function(x,y) {
    var a=this.get(x,y);
    this._map.delete(x+"|"+y);
    return(a);
};
BlockSet.prototype.set = function(x,y,val) {
    this._map.set(x+"|"+y,val);
};
BlockSet.prototype.get = function(x,y) {
    return(this._map.get(x+"|"+y));
};
BlockSet.prototype.size = function() {
    return(this._map.size);
};
BlockSet.prototype.clear = function() {
    this._map.clear();
};
BlockSet.prototype.entries = function() {
  var ret=[];
  for (let v of this._map.keys()) {
      var a=v.split("|").map(e=>Number.parseInt(e))
      ret.push({
        x:a[0],
        y:a[1]
      });
  }
  return(ret);
};
function Physical(creator){
  this.blocks=new BlockSet();
  this.entities=[];
}
function Entity(type,id){
  this.id=id;
  this.p={
    x:0,
    y:0,
    xv:0,
    yv:0,
    rot:0
  }
  this.type=type;
  this.special=0;
  this.health=100;
}

function Asteroid(){//9 blocks wide
  this.p={
    x:0,
    y:0,
    xv:0,             //.5 blocks per sec
    yv:0,
    rot:0
  }
  this.phys=new Physical(this);

  this.id=0;
}
function Planet(){
  this.p={
    x:0,
    y:0,
    xv:0,             //.5 blocks per sec
    yv:0,
    rot:0
  }
  this.expPlan=0;
  this.phys=new Physical(this);
  this.ownername="";
  this.id=0;
}
Planet.prototype.innerRadius = function() {
    return 10*(7.5+this.expPlan);
};
Planet.prototype.outerRadius = function() {
    return 10*(14.5+1.5*this.expPlan);
};
Planet.prototype.sideLength = function() {
    return 10*(15+2*this.expPlan);
};
Planet.prototype.inAtmo = function(player) {
	return (
		new MPL.Rect(
			new MPL.P(this.p.x - this.outerRadius(), this.p.y - this.outerRadius()), new MPL.P(this.p.x + this.outerRadius(), this.p.y + this.outerRadius()), this.p.rot, this.p)
		.touching(
			new MPL.Rect(
				new MPL.P(player.p.x +playerSize[0], player.p.y +playerSize[1]), new MPL.P(player.p.x+playerSize[2], player.p.y +playerSize[3]), player.p.rot, player.p)
		)
	);
};
function decodeObject(type,buf){
  if(type==="entity"){
    var n=schemapacks.entityUpdateSchema.decode(buf);
    var obj=new Entity(n.type,n.id);
    obj.p={
      x:n.pos[0],
      y:n.pos[1],
      xv:n.vol[0],
      yv:n.pos[1],
      rot:n.rot
    };
    obj.health=n.health;
    obj.special=n.special;
    return obj;
  }else if(type==="player"){
    var n=schemapacks.playerUpdateSchema.decode(buf);
    var obj=new Player();
    obj.username="fixthiscode";
    obj.id=n.id;
    obj.health=n.health;
    obj.p={
      x:n.pos[0],
      y:n.pos[1],
      xv:n.vol[0],
      yv:n.vol[1],
      rot:n.rot
    };
    return obj;
  }else if(type==="otherPlayer"){
    var n=schemapacks.otherPlayerUpdateSchema.decode(buf);
    var obj=new Player();
    obj.username=obj.name;
    obj.id=n.id;
    obj.health=n.health;
    obj.p={
      x:n.pos[0],
      y:n.pos[1],
      xv:n.vol[0],
      yv:n.vol[1],
      rot:n.rot
    };
    return obj;
  }else if (type==="world") {
    var n=schemapacks.worldUpdateSchema.decode(buf);

    var obj=n.isPlanet?new Planet():new Asteroid();
    obj.id=n.id;
    obj.expPlan=n.size;
    if(n.isPlanet){
      obj.expPlan=n.size;
      obj.ownername=n.ownername;
    }
    obj.p={
      x:n.pos[0],
      y:n.pos[1],
      xv:n.vol[0],
      yv:n.vol[1],
      rot:n.rot
    };
    n.entities.map(function(e) {
      var j=new Entity(e.type,e.id);
      j.p={
        x:e.pos[0],
        y:e.pos[1],
        xv:e.vol[0],
        yv:e.vol[1],
        rot:e.rot
      };
      j.health=e.health;
      j.special=e.special;
      obj.phys.entities.push(j);
      return e;
    });
    n.blocks.map(function(e) {
      obj.phys.blocks.set(e.pos[0],e.pos[1],{type:e.type,special:e.special});
      return e;
    });
    return obj;
  }else if (type==="block") {
    var n=schemapacks.blockUpdateSchema.decode(buf);


    return n;
  }
  return "ERROR";
}

function Player(){
  this.id=0;
  this.username="";
  this.p={
    x:0,
    y:0,
    xv:0,
    yv:0,
    rot:0
  }

  this.health=100;
  this.planet=new Planet();
}
/*    SOCK   */

if(TESTING){
var socket = io.connect(ipaddress);
}else{
  var socket = io.connect(ipaddress, {secure: true});

}
socket.on('pong', (latency) => {
 console.log("her")
});
socket.on(schemapacks.playerUpdateSchema.id, function(msg){
  lastdatadisplay=1000/(Date.now()-lastdata);
  lastdata=Date.now();
  bodyuser= decodeObject("player",msg);
  putArray(world.players,bodyuser);
});

socket.on(schemapacks.entityUpdateSchema.idea, function(msg){
  var obj= decodeObject("entity",msg);
  putArray(world.objects,obj);

});

socket.on(schemapacks.worldUpdateSchema.id, function(msg){
  var obj= decodeObject("world",msg);
  console.log(obj);
  if(obj instanceof Planet){
    putArray(world.planets,obj);
    if(obj.expPlan<0){
       remId(world.planets,obj.id);
       console.log("aahh");
    }else{
      putArray(world.planets,obj);
    }
  }else{
    putArray(world.asteroids,obj);
  }

});

socket.on(schemapacks.otherPlayerUpdateSchema.id, function(msg){
  var obj= decodeObject("otherPlayer",msg);
  if(obj.health<=0){
    remId(world.players,obj.id);
  }else{
    putArray(world.players,obj);
  }
});

socket.on("Ipong",function(msg){
  lastpingdisplay=Date.now()-lastping;

});
window.setInterval(()=>{
  socket.emit("Iping","")
  lastping=Date.now();
},1000)


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
document.onload=function(){loadImages();}

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
  'down': false,
  'bg':{
    'x': 0,
    'y': 0
  }
}
var keyboard = {
  code: {
  }
}
window.setInterval(()=>{gametick();draw();}, 50);

window.onresize = draw;

function handleMouseEvent(x, y) {
  var canvas = document.getElementById('bg');
  scale = supposedScreenSize.x / supposedScreenSize.y > canvas.width / canvas.height ? canvas.width / supposedScreenSize.x : canvas.height / supposedScreenSize.y;
  mouse.x = (x - window.innerWidth / 2) / scale * crispness;
  mouse.y = (y - window.innerHeight / 2) / scale * crispness;
  var _scale = supposedScreenSize.x / supposedScreenSize.y < canvas.width / canvas.height ? canvas.width / supposedScreenSize.x : canvas.height / supposedScreenSize.y;
  mouse.bg.x = (x - window.innerWidth / 2) / _scale * crispness;
  mouse.bg.y = (y - window.innerHeight / 2) / _scale * crispness;

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
  if(!keyboard[e.key]&&([37,38,39,40,87,83,65,68].includes(e.keyCode))){
    socket.emit(schemapacks.keyUpdateSchema.id,schemapacks.keyUpdateSchema.encode({is:true,key:e.keyCode}));
  }
  keyboard[e.key] = true;
  keyboard.code[e.keyCode] = true;
  if([37,38,39,40,32].includes(e.keyCode)){
    e.preventDefault();
  }
}
window.onkeyup = function(e) {
  if(keyboard[e.key]&&([37,38,39,40,87,83,65,68].includes(e.keyCode))){
    socket.emit(schemapacks.keyUpdateSchema.id,schemapacks.keyUpdateSchema.encode({is:false,key:e.keyCode}));
  }
  keyboard[e.key] = false;
  keyboard.code[e.keyCode] = false;
  if([37,38,39,40,32].includes(e.keyCode)){

  e.preventDefault();
}
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}
