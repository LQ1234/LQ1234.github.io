window.onload = function(){
fetch('files.json')
  .then(function(json) {
    console.log(json)
    createHeaders(json)
  });

function createHeaders(obj) {

  var header = document.createElement("div");
  header.id = "header";
  var name = document.createElement("div");
  name.id = "name";
  name.innerHTML = "Larrys<span>.</span>Tech";
  header.appendChild(name);




  var headermenu = document.createElement("div");
  headermenu.id = "header-menu";
  header.appendChild(headermenu);
  var list = document.createElement("ul");
  headermenu.appendChild(list);

  var ld = Object.keys(obj);
  for (var i = 0; i < ld.length; i++) {
    var tn = ld[i];
    if (typeof obj[tn] === "string") {
      var nw = document.createElement("a");
      nw.href = obj[tn];
      var nwc = document.createElement("li");
      nwc.innerHTML = tn;
      nw.appendChild(nwc);
      list.appendChild(nw);
    } else {
      var nwc = document.createElement("li");
      list.appendChild(nwc);
      nwc.className = "dropdown";
      nwc.innerHTML += tn;
      var ddi = document.createElement("div");
      ddi.className = "dropdown-items"
      nwc.appendChild(ddi);
      var ldi = Object.keys(obj[tn]);
      for (var p = 0; p < ldi.length; p++) {
        var nwi = document.createElement("a");
        nwi.innerHTML = ldi[p];
        nwi.href = obj[tn][ldi[p]];
        ddi.appendChild(nwi);
      }
    }
  }
  document.body.insertBefore(header, document.body.childNodes[0]);


}



var head = document.head;
var link = document.createElement("link");
link.type = "text/css";
link.rel = "stylesheet";
link.href = "defcss.css";
head.appendChild(link);

var link2 = document.createElement("link");
link2.type = "text/css";
link2.rel = "stylesheet";
link2.href = "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css";
head.appendChild(link2);



} ;