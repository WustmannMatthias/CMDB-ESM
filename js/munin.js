function modifyStatus() {
    $.ajax({
        type: "GET",
        url: "/ajaxmunin?action=" + $("#munin-status-btn").text().toLowerCase(),
        success: function(data) {
           getStatus(); 
        },
        error: function(data) {
        }
    });

}

function getStatus() {
    $.ajax({
        type: "GET",
        url: "/ajaxmunin?action=status",
        dataType: "json",
        success: function(data) {
            if (data.code == 0) {
                $("#munin-status-btn").removeClass('btn btn-success');
                $("#munin-status-btn").addClass('btn btn-danger');
                $("#munin-status-btn").text('Stop');
                $('#munin-link-txt').html('<a href="' + data.link + '" target="_blank">Go to Munin</a>');
            } else {
		if (data.code == 1) { 
			$('#munin-status-btn').hide();
		}
		if (data.code == 2) {
                	$("#munin-status-btn").removeClass('btn btn-danger');
                	$("#munin-status-btn").addClass('btn btn-success');
                	$("#munin-status-btn").text('Start');
		}
                $('#munin-link-txt').html(data.result);
            }
        },
        error: function(data) {
        }
    });
}
getStatus();
