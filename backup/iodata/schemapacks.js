
(function () {
    if(typeof module !== 'undefined'){
    var schemapack=require('schemapack');
  }else{
      var schemapack=window.schemapack;
  }
  function setid(obj,id){
    obj.id=id;
    return obj;
  }
  var _schemapacks={
    //SERVER -> CLIENT
    playerUpdateSchema:setid(schemapack.build({
        health: "uint8",
        pos: [ "float64" ],
        vol: [ "float32" ],
        rot:"float32",
        id:"varuint"

    }),0),
    worldUpdateSchema:setid(schemapack.build({
      pos: [ "float64" ],
      vol: [ "float32" ],
      rot:"float32",
      id:"varuint",
      isPlanet:"bool",
      size:"int8"	,
      ownername:"string",
      entities:[
        {
          pos: [ "float64" ],
          vol: [ "float32" ],
          rot:"float32",
          id:"varuint",
          type:"uint8",
          health:"uint8",
          special:"uint8"
        }
      ],
      blocks:[
        {
          pos: [ "int8" ],
          type:"uint8",
          special:"uint8"
        }
      ]
    }),1),
    blockUpdateSchema:setid(schemapack.build({
      onPlanet:"bool",
      onId:"varuint",
      pos: [ "int8" ],
      type:"uint8",
      special:"uint8"
    }),2),
    otherPlayerUpdateSchema:setid(schemapack.build({
      name:"string",
      health: "uint8",
      pos: [ "float64" ],
      vol: [ "float32" ],
      rot:"float32",
      id:"varuint"
    }),3),
    entityUpdateSchema:setid(schemapack.build({
      pos: [ "float64" ],
      vol: [ "float32" ],
      rot:"float32",
      id:"varuint",
      type:"uint8",
      health:"uint8",
      special:"uint8"
    }),4),

    //CLIENT -> SERVER

    keyUpdateSchema:setid(schemapack.build({
      is:"bool",
      key:"uint8"
    }),5),
    punchUpdateSchema:setid(schemapack.build({
      dist:"float32",
      dir:"float32",
      is:"bool"
    }),6)
  };
  if(typeof module !== 'undefined'){
    module.exports=_schemapacks;
  }else{
    window.schemapacks=_schemapacks;
  }
})();
