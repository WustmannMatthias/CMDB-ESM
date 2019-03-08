function update_api() {
  $.post("/ajaxwebconfig?check=updateconfig&type=apikey", {
    api_key: $("#esm_key").val(),
  })
    .done(function (data) {
      $('#DoneModal').modal('show');
    });
}

function update_beanstalk() {
  $.post("/ajaxwebconfig?check=updateconfig&type=beanstalk", { 
    bs_host: $("#bs_host").val(), 
    bs_port: $('#bs_port').val() 
  })
    .done(function (data) {
      $('#DoneModal').modal('show');
    });
}

function update_auth() {
  $.post("/ajaxwebconfig?check=updateconfig&type=route", { 
    auth_type: $("#auth_type").val(), 
  })
    .done(function (data) {
      $('#DoneModal').modal('show');
    });
}

function update_ldap() {
  $.post("/ajaxwebconfig?check=updateconfig&type=ldap", { 
    ldap_host: $("#ldap_host").val(), 
    ldap_port: $("#ldap_port").val(), 
    ldap_ou: $("#ldap_ou").val(),
    ldap_dc: $("#ldap_dc").val() 
  })
    .done(function (data) {
      $('#DoneModal').modal('show');
    });
}

function update_mysql() {
  $.post("/ajaxwebconfig?check=updateconfig&type=mysql", { 
    mysql_user: $("#mysql_user").val(), 
    mysql_password: $('#mysql_password').val() 
  })
    .done(function (data) {
      $('#DoneModal').modal('show');
    });
}

function currentversion () {
  $.get('/ajaxchecksetup?check=version', function(data) {
    document.cookie = "VERSION="+data.version+";expires=3600000;";
    $("#esm_current_version").html(data.version);
    $("#esm_version").html("<b>Yoctu</b> 2018 | "+ data.version);
  },'json');
}

function currentapiconfig () {
  $.get('/ajaxwebconfig?check=showconfig&type=apikey', function(data) {
    $("#esm_key").val(data.esm_key);
  },'json');
}

function currentbsconfig () {
  $.get('/ajaxwebconfig?check=showconfig&type=beanstalk', function(data) {
    $("#bs_host").val(data.server);
    $("#bs_port").val(data.port);
  },'json');
}

function currentldapconfig () {
  $.get('/ajaxwebconfig?check=showconfig&type=ldap', function(data) {
    $("#ldap_host").val(data.ldap_host);
    $("#ldap_port").val(data.ldap_port);
    $("#ldap_ou").val(data.ldap_ou);
    $("#ldap_dc").val(data.ldap_dc);
  },'json');
}

function currentmysqlconfig () {
  $.get('/ajaxwebconfig?check=showconfig&type=mysql', function(data) {
    $("#mysql_user").val(data.mysql_user);
    $("#mysql_password").val("*****");
  },'json');
}

function currentauthconfig () {
  $.get('/ajaxwebconfig?check=showconfig&type=route', function(data) {
    $("#auth_type").val(data.auth);
  },'json');
}

function newversion () {
  $('#VersionStatusModal').modal('show');
  $("#versionmodaltext").html('<div align="center"><br><div class="loader"></div><br></div>');
  $.get('/ajaxchecksetup?check=newversion', function(data) {
    document.cookie = "UPGRADE="+data.newversion;
    if (getCookie('UPGRADE') > 1) {
      $("#upgrade_status").html('<a href="/webconfig"><span class="glyphicon glyphicon-circle-arrow-up" style="color: red;"></span></a>');
    } else {
      $("#upgrade_status").html('<a href="/webconfig"><span class="glyphicon glyphicon-ok-circle" style="color: green;"></span></a>');
    }
    $("#versionmodaltext").html(data.version);
  },'json');
}

function updateversion () {
  $('#VersionStatusModal-title').text('Updating...');
  $('#VersionStatusModal').modal('show');
  $("#versionmodaltext").html('<div align="center"><br><div class="loader"></div><br></div>');
  $.get('/ajaxchecksetup?check=updateversion', function(data) {
    document.cookie = "UPGRADE=1";
    $("#upgrade_status").html('<a href="/webconfig" style="background-color: transparent;"><span class="glyphicon glyphicon-ok-circle"></span></a>');
    document.cookie = "VERSION="+data.version+";expires=3600000;";
    $("#esm_current_version").html(data.version);
    $("#esm_version").html("<b>Yoctu</b> 2018 | "+ data.version);
    $("#versionmodaltext").html(data.result);
  },'json');
}

currentbsconfig();
currentmysqlconfig();
currentversion();
currentauthconfig();
currentldapconfig();
currentapiconfig();
