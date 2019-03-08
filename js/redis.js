function loadconfig() {
    $.ajax({
        type: "GET",
        url: "ajaxredis?action=getconfig",
        dataType: "json",
        success: function(data) {
                $('#server').val(data.bind);
                $('#port').val(data.port);
        }
    });
}

$("#save_redis").click(function() {
   mode = "yes";
   if ($('#server').val() != "127.0.0.1") mode = "no";
    $.ajax({
        type: "POST",
        url: "ajaxredis",
        dataType: "json",
	data: { action: "saveconfig" , server: $('#server').val() , port: $('#port').val(), mode: mode },
        success: function(data) {
        }
    });

});

loadconfig();
