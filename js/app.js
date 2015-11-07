(function() {
  var $document = $(document);
  var $window = $(window);

  $document.ready(function () {
    obfuscateEmail();

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
    var $landing = $(".landing");
    var $header = $("header");
    landingHeight = $landing.outerHeight(true);
    headerHeight = $header.outerHeight(true);
    screenHeight = $window.height();
    logoDimensions = landingHeight;
    scroll = $document.scrollTop();

    if(scroll > landingHeight + headerHeight - screenHeight) {
      if(scroll - landingHeight - headerHeight + screenHeight > screenHeight - 100) {
        $header.css("bottom", (screenHeight - 100) + "px");
      }
      else {
        $header.css("bottom", (scroll - landingHeight - headerHeight + screenHeight) + "px");
      }
    }
    else {
      $header.css("bottom", "0px");
    }

    if ($window.width() < logoDimensions) {
      logoDimensions = $window.width();
    }

    logoDimensions -= scroll;

    var logo = $(".logo");

    if(logoDimensions < 100) {
      logo.css("top", -25 + "px");
    }
    else if(logoDimensions < 150) {
      logo.css("top", (logoDimensions - 125) + "px");
    }
    else {
      logo.css("top", "");
    }


    if(logoDimensions < 150) {
      logoDimensions = 150;
    }

    if(logoDimensions > 200)
    {
      logoDimensions = 200;
    }

    logo.width(logoDimensions + "px");
    logo.height(logoDimensions + "px");
    logo.css("margin-left", (-logoDimensions / 2) + "px");
  }

  function obfuscateEmail() {
    $('a.obfuscate').each(function(i, element) {
      elm = $(element);
      var email = elm.prop("href");
      email = email.replace(" (at) ", "@");
      email = email.replace(" (dot) ", ".");
      email = email.replace("%20(at)%20", "@");
      email = email.replace("%20(dot)%20", ".");
      elm.prop("href", email);
      email = elm.text();
      email = email.replace(" (at) ", "@");
      email = email.replace(" (dot) ", ".");
      email = email.replace("%20(at)%20", "@");
      email = email.replace("%20(dot)%20", ".");
      elm.text(email);
    });
  }

})();