var style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode("body{display:none;}"));
var head=document.head;
head.insertBefore(style, head.firstChild);


window.onload = function() {
  fetch('https://larrys.tech/files.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      createHeaders((json))

    });

  function createHeaders(obj) {

    var header = document.createElement("div");
    header.id = "header";
    var name = document.createElement("div");
    name.id = "name";
    name.innerHTML = "Larrys<span>.</span>Tech";
    header.appendChild(name);

    var subname = document.createElement("div");
    subname.id = "subname";
    subname.innerHTML = "My code and other stuff";
    header.appendChild(subname);


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
        nwc.setAttribute("onclick", " ")
        list.appendChild(nwc);
        nwc.className = "dropdown";
        nwc.innerHTML += tn;

        nwc.innerHTML += "<span class=texticon>&#8801;</span>";

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

    var spacefiller = document.createElement("div");
    spacefiller.id = "spacefiller";
    document.body.insertBefore(spacefiller, document.body.childNodes[1]);

    var n = function() {
      var pu=function() {

        $("#spacefiller")[0].style.height = ($("#header").height() + 15) + "px";
      };
      $("#header").ready(pu);
      $(window).resize(pu);
      window.setTimeout(pu,1000);
    }
    if (window.jQuery) {
      n();
    } else {

      var src = document.createElement("script");
      src.src = "https://code.jquery.com/jquery-3.3.1.slim.min.js";
      head.insertBefore(src, head.childNodes[0]);

      src.onload = function() {
        n();
      };
    }
  }



  var head = document.head;
  var defcss = document.createElement("link");
  defcss.type = "text/css";
  defcss.rel = "stylesheet";
  defcss.href = "defcss.css";
  head.appendChild(defcss);

  defcss.onload = function() {
    var bMobile =
      navigator.userAgent.indexOf("Mobile") !== -1 ||
      navigator.userAgent.indexOf("iPhone") !== -1 ||
      navigator.userAgent.indexOf("Android") !== -1 ||
      navigator.userAgent.indexOf("Windows Phone") !== -1;
    console.log("ismoblie:" + bMobile);
    if (bMobile) {
      var head = document.head;
      var link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = "defcssmobile.css";
      head.insertBefore(link, defcss.nextSibling);
    }
  }
  var link2 = document.createElement("link");
  link2.type = "text/css";
  link2.rel = "stylesheet";
  link2.href = "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css";
  head.insertBefore(link2, head.childNodes[0]);

};
