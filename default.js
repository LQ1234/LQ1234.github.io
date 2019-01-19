window.lc = {
  mobile: navigator.userAgent.indexOf("Mobile") !== -1 ||
    navigator.userAgent.indexOf("iPhone") !== -1 ||
    navigator.userAgent.indexOf("Android") !== -1 ||
    navigator.userAgent.indexOf("Windows Phone") !== -1,
  download: function(url) {
    var x = document.createElement("A");
    $(x).attr("href", url);
    $(x).attr("download", "");
    x.click();
  },
  hide: function(itm, hid) {
    if (hid) {
      if (!itm.hasClass("lc_hidden")) {
        itm.addClass("lc_hidden");
      }
    } else {
      if (itm.hasClass("lc_hidden")) {
        itm.removeClass("lc_hidden");
      }
    }
  },
  checkoverflow: function() {

    $(".lc_cap").each(function(i) {
      var bounding = this.getBoundingClientRect();
      var lb = $(".lc_cap .lc_caphidden")[0].getBoundingClientRect();

      var overflowing = false;
      $(this).children().each(function() {
        if ($(this).hasClass("lc_caphidden")) return;
        lc.hide($(this), false)

        var tbounding = this.getBoundingClientRect();

        if (bounding.left + bounding.width - lb.width - 10 < tbounding.left + tbounding.width) {
          lc.hide($(this), true);
          overflowing = true;
          console.log(this);
        } else {
          lc.hide($(this), false);

        }
      });
      var lc_caphidden = $(".lc_cap .lc_caphidden");
      lc.hide(lc_caphidden, !overflowing)

    });
  },

};

$(function() {
  if (lc.mobile) {
    $("body").addClass("lc_mobile");
  }
  $('body').css("display", "block")

  var header = $('#lc_header')[0];
  var name = document.createElement("div");
  name.id = "name";
  name.innerHTML = "Larrys<span>.</span>Tech";
  header.appendChild(name);

  var subname = document.createElement("div");
  subname.id = "subname";
  subname.innerHTML = "My code and other stuff";
  header.appendChild(subname);
  /*
  $(window).resize(lc.checkoverflow);

  lc.checkoverflow();
  setInterval(lc.checkoverflow, 1000);
  */
  var nav = document.createElement("div");
  nav.id = "lc_nav";
  header.appendChild(nav);
  var itms=Object.keys(files);
  for (var i = 0; i < itms.length; i++) {
    var itmsi=itms[i];
    var itmse=files[itmsi];
    var spi = document.createElement("div");
    spi.className = "lc_dropdown"

    if((typeof itmse)=== 'string'){
      var ahr = document.createElement("a");
      spi.innerHTML=itmsi;
      ahr.href = itmse;
      ahr.appendChild(spi);
      nav.appendChild(ahr);

    }else{
      var pps = document.createElement("div");
      pps.className = "lc_dropdownoptions";

      spi.innerHTML=itmsi;
      var dds=Object.keys(itmse);


      for (var j = 0; j < dds.length; j++) {
        var ddsi=dds[j];
        var ddse=itmse[ddsi];
        var lts = document.createElement("div");

        var ahr = document.createElement("a");
        ahr.innerHTML=ddsi;
        //ahr.appendChild(lts);
        ahr.href = ddse;
        pps.appendChild(ahr);
      }
      spi.appendChild(pps);
      nav.appendChild(spi);

    }

  }


  function detect() {
    $('#lc_nav').removeClass('fullwidth')

      var mwidh=$("#lc_nav").width();
      var wdth=0;
      $('#lc_nav > *').each(function() {
        wdth +=$(this).outerWidth(true);

      });
    if (mwidh<=wdth) { // If media query matches
      $('#lc_nav').addClass('fullwidth');

    } else {

    }
  }

  $(window).resize(detect);
  detect(); // Call listener function at run time
});
