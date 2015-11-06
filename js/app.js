(function() {
  var $document = $(document);

  $document.ready(function () {

    /*** Expand the containers properly when clicked ***/
    $(".container").click(function () {
      var container = $(this);
      container.toggleClass("selected");
      if (container.hasClass("selected")) {
        container.parent().addClass("expanded");
      }
      else {
        container.parent().removeClass("expanded");
      }
    });

    resizeLogo();
    $document.on("scroll", resizeLogo);
    $(window).resize(resizeLogo);

  });

  function resizeLogo() {
    var landingHeight = $(".landing").height();
    var logoDimensions = landingHeight;
    if ($document.width() < logoDimensions) {
      logoDimensions = $document.width();
    }

    var scroll = $document.scrollTop();

    logoDimensions -= scroll;

    var logo = $(".logo");

    if(logoDimensions < 0) {
      logo.css("top", -25 + "px");
    }
    else if(logoDimensions < 50) {
      logo.css("top", (logoDimensions - 25) + "px");
    }
    else {
      logo.css("top", "");
    }

    if(logoDimensions < 0) {
      $("header").css("position", "fixed");
      $("header").css("top", "50px");
      $(".landing").css("margin-bottom", "50px");
    }
    else {
      $("header").css("position", "");
      $("header").css("top", "");
      $(".landing").css("margin-bottom", "");
    }

    if(logoDimensions < 150) {
      logoDimensions = 150;
    }

    if(logoDimensions > 350)
    {
      logoDimensions = 350;
    }

    logo.width(logoDimensions + "px");
    logo.height(logoDimensions + "px");
    logo.css("margin-left", (-logoDimensions / 2) + "px");
  }

})();