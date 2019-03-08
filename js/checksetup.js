$("#start_check-btn").click(function(){
  $('#CheckSetupModal').modal('show');
  $('#result_well').html('');
  $('#cmd_well').html('');
  $('#session_well').html('');
  $('#dpkg_well').html('');
  $.ajax({
    type: "GET",
    url: "/ajaxchecksetup?check=id",
    dataType: "json",
    success: function(data) {
     if (data.id != 0) {
        $('#result_well').append('<div class="alert alert-success alert-dismissable fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><b>Success!</b> your are running as '+data.name+'</div>');
        if (data.sudo == 0) {
          $('#result_well').append('<div class="alert alert-success alert-dismissable fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><b>Success!</b> you have sudo</div>');
        } else {
          $('#result_well').append('<div class="alert alert-danger alert-dismissable fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><b>Failure!</b> you do not have sudo</div>');
          return;
        }
      } else {
        $('#result_well').append('<div class="alert alert-warning alert-dismissable fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><b>Failure!</b> your are running as <b>root</b></div>');
      }
    }
  });

  $.ajax({
    type: "GET",
    url: "/ajaxchecksetup?check=session",
    dataType: "json",
    success: function(session) {
      if ((session.start == 1) && (session.checksetup == 1) && (session.get == 1)) {
        $('#session_well').append('<div class="alert alert-success alert-dismissable fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><b>Success!</b> Your sessions are working</div>');
      } else {
        $('#session_well').append('<div class="alert alert-danger alert-dismissable fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><b>Failure!</b> There is an issue with the sessions.</b></div>');
      }
    }
  });

  $.ajax({
    type: "GET",
    url: "/ajaxchecksetup?check=debpkg",
    dataType: "json",
    success: function(dpkg) {
      for (var key in dpkg) {
        if (dpkg[key] == 0) {
          $('#dpkg_well').append('<div class="alert alert-success alert-dismissable fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><b>'+key+'</b> is installed</div>');
        } else {
          $('#dpkg_well').append('<div class="alert alert-warning alert-dismissable fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><b>'+key+'</b> is not installed</div>');
        }
      }
    }
  });

  $.ajax({
    type: "GET",
    url: "/ajaxchecksetup?check=mysql",
    dataType: "json",
    success: function(mysql) {
      if (mysql.mysql_ok == 0) {
        $('#result_well').append('<div class="alert alert-success alert-dismissable fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><b>Success!</b> Mysql is accessible</div>');
      } else {
        $('#result_well').append('<div class="alert alert-danger alert-dismissable fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><b>Failure!</b> Mysql is not accessible</div>');
      }
    }
  });

  $.ajax({
    type: "GET",
    url: "/ajaxchecksetup?check=cmd",
    dataType: "json",
    success: function(cmd) {
      for (var key in cmd) {
        if (cmd[key] == 0) {
        console.log(cmd);
          $('#cmd_well').append('<div class="alert alert-success alert-dismissable fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><b>'+key+'</b> is installed</div>');
        } else {
          $('#cmd_well').append('<div class="alert alert-warning alert-dismissable fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><b>'+key+'</b> is not installed</div>');
        }
      }
    }
  });


});

