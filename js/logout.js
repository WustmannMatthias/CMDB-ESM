$.ajax({
    type: "GET",
    url: "/ajaxlogout",
    success: function() {
          var ca = document.cookie.split(';');
          console.log(ca);
          for(var i=0;i < ca.length; i++) {
                  var spcook =  ca[i].split("=");
                  console.log(spcook[0]);
                  document.cookie = spcook[0] + "=;expires=0;";
                }
          return null;
        }
});