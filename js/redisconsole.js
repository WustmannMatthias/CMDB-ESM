function check_redis_connection() {
  $('#result').html('');
  $('#list_databases').empty();
  $.ajax({
    type: "POST",
    url: "/ajaxredisconsole?action=check",
    data: {server: $('#server').val(), port: $('#port').val() },
    dataType: "json",
    success: function(data) {
      if (data['redis_connection'] === 'OK') {
        $('#result').html('<div class="text-success">Success !</div>');
      } else {
        $('#result').html('<div class="text-danger">Failure !</div>');
      }
    }
  });
}

function execute_redis_query() {
  $.ajax({
    type: "POST",
    url: "/ajaxredisconsole?action=execute",
    data: {server: $('#server').val(), port: $('#port').val(), query: $('#query').val() },
    dataType: "json",
    success: function(data) {
        $('#ResultModal').modal('show');
        $('#result').html('<div class="text-success">Success !</div>');
        $('#redis_result').html(data.connection);
    }
  });
}


