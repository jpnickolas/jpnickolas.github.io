(function() {
  var $document = $(document);
  var $window = $(window);

  $document.ready(function () {
    obfuscateEmail();
  });

  function obfuscateEmail() {
    $('a.obfuscate').each(function(i, element) {
      elm = $(element);
      var email = elm.prop("href");
      email = email.replace("(at)", "@");
      email = email.replace("(dot)", ".");
      elm.prop("href", email);
      email = elm.text();
      email = email.replace("(at)","@");
      email = email.replace("(dot)",".");
      elm.text(email);
    });
  }

})();
