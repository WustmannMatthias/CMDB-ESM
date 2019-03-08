function check_mysql_connection() {
  $('#result').html('');
  $('#list_databases').empty();
  $.ajax({
    type: "POST",
    url: "/ajaxmysqlconsole?action=check",
    data: {server: $('#server').val(), port: $('#port').val(), user: $('#user').val(), password: $('#password').val()},
    dataType: "json",
    success: function(data) {
      if (data['mysql_connection'] != 0) {
        $('#result').html('<div class="text-danger">Failure !</div>');
      } else {
        $('#result').html('<div class="text-success">Success !</div>');
        dbs=data.mysql_databases.split(",");
        for (var db in dbs) {
          if (dbs[db] == 'Database') continue;
          $('#list_databases').append('<option value="'+dbs[db]+'">'+dbs[db]+'</option>' );
        }
      }
    }
  });
}

function execute_mysql_query() {
  $.ajax({
    type: "POST",
    url: "/ajaxmysqlconsole?action=execute",
    data: {server: $('#server').val(), port: $('#port').val(), user: $('#user').val(), password: $('#password').val(), query: $('#mysql_query').val(), database: $('#list_databases').val() },
    dataType: "json",
    success: function(data) {
      if (data['mysql_connection'] == 1) {
        $('#result').html('<div class="text-danger">Failure !</div>');
      } else {
        $('#ResultModal').modal('show');
        $('#result').html('<div class="text-success">Success !</div>');
        $('#mysql_query_result').html(data['result'].replace('TABLE BORDER=1','TABLE class="table table-responsive table-hover"'));
      }
    }
  });
}


