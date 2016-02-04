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

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-49074030-1', 'auto');
ga('send', 'pageview');

