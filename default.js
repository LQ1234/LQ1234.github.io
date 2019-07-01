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
    document.addEventListener("touchstart", function() {}, true);

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
  var navDIV = document.createElement("div");
  navDIV.id = "lc_nav";
  header.appendChild(navDIV);
  var mainItemKeys=Object.keys(files);

  function addTags(element, tags){
    var tagsDiv=document.createElement("div");
    tagsDiv.className = "lc_navTags";
    for(var i=0;i<tags.length;i++){
      var tag=document.createElement("div");
      tag.innerHTML=tags[i];
      tag.className = "lc_navTag";
      if(i%2==0){
        var color="gray";
        var fill="black";
      }else{
        var color="lightgray";
        var fill="gray";
      }
      tag.style.backgroundColor = color;
      tag.style.color = fill;

      tag.style.borderColor = color;

      tagsDiv.appendChild(tag);
    }
    element.appendChild(tagsDiv);


  }
  var thisItemKey="Home";
  var thisItemData=files[thisItemKey];
  function testLink(dir,name,data){
    if(($(`<a href="${dir}">`)[0].href)===window.location.href){
      thisItemKey=name;
      thisItemData=data;
    }
  }
  for (var i = 0; i < mainItemKeys.length; i++) {
    var mainItemKey=mainItemKeys[i];
    var mainItemContent=files[mainItemKey];


    if(mainItemContent.link){
      var linkObj = document.createElement("div");
      linkObj.className = "lc_dropdown";
      var linkAnchor = document.createElement("a");
      linkObj.innerHTML=mainItemKey;
      addTags(linkObj,mainItemContent.tags)

      linkAnchor.href = mainItemContent.link;
      linkAnchor.appendChild(linkObj);
      navDIV.appendChild(linkAnchor);
      testLink(mainItemContent.link,mainItemKey,mainItemContent);
    }else{
      var dropDownContainer = document.createElement("div");
      dropDownContainer.className = "lc_dropdown"
      var dropDownContent = document.createElement("div");
      dropDownContent.className = "lc_dropdownoptions";
      dropDownContainer.innerHTML=mainItemKey;

      var dropDownContentKeys=Object.keys(mainItemContent);

      for (var j = 0; j < dropDownContentKeys.length; j++) {
        var dropDownContentKey=dropDownContentKeys[j];
        var dropDownContentContent=mainItemContent[dropDownContentKey];

        var subAnchor = document.createElement("a");


        subAnchor.href = dropDownContentContent.link;
        var subObj = document.createElement("div");
        subObj.innerHTML=dropDownContentKey;
        addTags(subObj,dropDownContentContent.tags)

        subAnchor.appendChild(subObj);
        dropDownContent.appendChild(subAnchor);
        testLink(dropDownContentContent.link,dropDownContentKey,dropDownContentContent);

      }
      dropDownContainer.appendChild(dropDownContent);
      navDIV.appendChild(dropDownContainer);

    }

  }
  $("#lc_title").append($("<h1>"+thisItemKey+"</h1>"));
  for (var i = 0; i < thisItemData.tags.length; i++) {
    var ne=$("<div class=lc_thisTag>"+thisItemData.tags[i]+"</div>");
    if(i%2==0){
      var color="black";
    }else{
      var color="gray";
    }
    ne.css("color",color);
    ne.css("border-color",color);

    $("#lc_title > *:first-child").append(ne);

  }
  $("#lc_title").append($("<div class=lc_thisCreationDate>"+thisItemData.time+"</div>"));
  console.log(thisItemKey);

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
