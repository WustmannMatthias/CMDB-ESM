var ReplicStatus = "";

function mysqladmin_query (type) {
    $("#MysqlReplicStatusModal").modal('show');
    $('#ReplicStatus').html('Loading...');
    $.ajax({
        type: "GET",
        url: "/ajaxmysql?action=mysqladmin&type="+type,
        success: function(data) {
            $('#ReplicStatus').html(data);
        }
    });
}

$("#test-setup-replic-btn").click(function(){
    $("#setup_master_log_file").val('');
    $("#setup_master_log_pos").val('');
    $.ajax({
        type: "POST",
        url: "/ajaxmysql?action=master_replic_test",
        dataType: "json",
        data: { user: $("#setup_user").val(), host: $("#setup_host").val(), password: $('#setup_password').val() },
        success: function (data) {
            $("#setup_master_log_file").val(data.File.replace(" ",""));
            $("#setup_master_log_pos").val(data.Position);
            if ((data.File) && (data.Position)) $("#test_message").html('<b class="text-success">success</b>');
            else $("#test_message").html('<b class="text-danger">failure</b>');
        }
    });
});

$("#test-setup-replic-btn").click(function(){
    $.post("/ajaxmysql?action=master_replic_test", { 
        user: $("#setup_user").val(), 
        host: $("#setup_host").val(), 
        password: $('#setup_password').val() 
    })
        .done(function (data) {
            $("#setup_master_log_file").val(data.File);
            $("#setup_master_log_pos").val(data.Position);
            if ((data.File) && (data.Position)) $("#test_message").html('<b class="text-success">success</b>');
            else $("#test_message").html('<b class="text-danger">failure</b>');
        });
});

$("#mysql-setup-replic-btn").click(function(){
    $.post("/ajaxmysql?action=master_replic_setup", { 
        user: $("#setup_user").val(), 
        host: $("#setup_host").val(), 
        password: $('#setup_password').val(),
        master_log_file: $("#setup_master_log_file").val(),
        master_log_pos: $("#setup_master_log_pos").val()
    })
        .done(function (data) {
            $("#SetupMysqlReplicModal").modal('hide');
            getSlaveReplicStatus();
        });
});

$("#mysql-add-user-btn").click(function(){
    $.post("/ajaxmysql?action=create_user", { user: $("#replic_user").val(), ip: $("#replic_host").val(), pwd: $('#replic_password').val() })
        .done(function (data) {
            $("#AddMysqlReplicUserModal").modal('hide');
            getUserReplic();
        });
});

function slave_reset() {
    $.get("/ajaxmysql?action=slave_reset")
        .done(function (data) {
            getSlaveReplicStatus();
        });
}

function slave_stop() {
    $.get("/ajaxmysql?action=slave_stop")
        .done(function (data) {
            getSlaveReplicStatus();
        });
}

function slave_start() {
    $.get("/ajaxmysql?action=slave_start")
        .done(function (data) {
            getSlaveReplicStatus();
        });
}

function getSlaveReplicStatus() {
    $.ajax({
        type: "GET",
        url: "/ajaxmysql?action=slave_replic_status",
        dataType: "json",
        success: function(data) {
            if ((data == null) || (data == '')) return;
            if (data.code == 0) {
                $("#mysql-slave-replic").html('<h4 class="text-success"><b>'+data.status+'</b><h4>');
                $("#mysql-slave-replic-setup").html('<button class="btn btn-danger" onclick="slave_stop();">Stop</button><button class="btn btn-danger" onclick="slave_reset();">Delete</button>');
            }
            if (data.code == 1) {
                $("#mysql-slave-replic").html('<h4 class="text-danger"><b>'+data.status+'</b><h4>');
                $("#mysql-slave-replic-setup").html('<a href="#showAddMysqlUserModal" data-toggle="modal" data-target="#SetupMysqlReplicModal"><button class="btn btn-danger">Setup</button></a>');
            }
            if (data.code == 2) {
                $("#mysql-slave-replic").html('<h4 class="text-danger"><b>'+data.status+'</b><h4>');
                $("#mysql-slave-replic-setup").html('<div class="col-sm-6"></div><div class="col-sm-3"><button class="btn btn-warning" onclick="slave_start();">Start</button></div><div class="col-sm-3"><button class="btn btn-danger" onclick="slave_reset();">Delete</button></div>');
            }
            ReplicStatus = data.full;
        }
    });
};

$("#replic_info").click(function() {
    txt = '<table class="table table-responsive">';
    for (x in ReplicStatus) {
        txt += "<tr><td>" + x + "</td><td>" + ReplicStatus[x] + "</td></tr>";
    }
    txt += "</table>"
    $("#ReplicStatus").html(txt);
    $("#MysqlReplicStatusModal").modal('show');
});

function getUserReplic() {
    $.ajax({
        type: "GET",
        url: "/ajaxmysql?action=get_users",
        dataType: "json",
        success: function(data) {
            if ((data == null) || (data == '')) return;
            output = '<table class="table table-responsive table-hover"><tr><th>User</th><th>Host</th><th>Repl_slave_priv</th><th>Repl_client_priv</th><th>Delete</th></tr>';
            output += "<tr><td>"+data.User+"</td><td>"+data.Host+"</td><td>"+data.Repl_slave_priv+"</td><td>"+data.Repl_client_priv+'</td><td><button class="btn btn-danger" onclick="delete_user(\''+data.User+'\',\''+ data.Host + '\')">delete</button></td></tr></table>';
            if (data == 'nouser') $("#mysql-user-replic").html('<table class="table table-responsive table-hover"><tr><th>User</th><th>Host</th><th>Repl_slave_priv</th><th>Repl_client_priv</th><th>Delete</th></tr></table>');
            else $("#mysql-user-replic").html(output);
            $("#mysql-add-user-replic").html('<a href="#showAddMysqlUserModal" data-toggle="modal" data-target="#AddMysqlReplicUserModal"><button class="btn btn-primary">Add</button></a>');
        }
    });
};

function delete_user(user,host) {
    $.ajax({
        type: "POST",
        url: "/ajaxmysql?action=delete_user",
        dataType: "json",
        data: { user: user, ip: host},
        success: function(data) {
            getUserReplic();
        }
    });
};

function getMasterReplicStatus() {
    $.ajax({
        type: "GET",
        url: "/ajaxmysql?action=master_replic_status",
        dataType: "json",
        success: function(data) {
            if ((data == null) || (data == '')) return;
            output = '<table class="table table-responsive table-hover"><tr><th>File</th><th>Pos</th><th>Binlog_Do_DB</th><th>Binlog_Ignore_DB</th><th>Executed_Gtid_Set</th></tr>';
            output += "<tr><td>"+data.File+"</td><td>"+data.Position+"</td><td>"+data.Binlog_Do_DB+"</td><td>"+data.Binlog_Ignore_DB+"</td><td>"+data.Executed_Gtid_Set+"</td></tr></table>";
            $("#mysql-master-replic").html(output);
        }
    });
};

$("#save-mysql-config-btn").click(function(){
   sbind = $("#bind-address").val().replace(/\s/g, '');
   sid =  $("#server-id").val().replace(/\s/g, '');
   saii = $("#auto-increment-increment").val().replace(/\s/g, '');
   saio = $("#auto-increment-offset").val().replace(/\s/g, '');
   $.ajax({
        type: "POST",
        url: "/ajaxmysql?action=set_config",
        dataType: "json",
        data: { bindaddress: sbind, serverid: sid, autoincrementincrement: saii, autoincrementoffset:  saio },
        success: function(data) {
            getConfigStatus();
            $("#MysqlConfigUpdateModal").modal('show');
        }
    });
});

function getDbSize() {
    $.ajax({
        type: "GET",
        url: "/ajaxmysql?action=get_db_size",
        dataType: "json",
        success: function(data) {
            if ((data == null) || (data == '')) return;
            output = '<table id="mysqlTable" class="table table-responsive table-hover">';
            output += '<tr class="clickable-row"><td><b>name</b></td><td><b>size</b></td></tr>';
            for (var i = 0; i < data.length; i++) {
                array = data[i];
                output += '<tr>';
                output += '<td>'+array.name+'</td><td>'+array.size+' MB</td>';
                output += '</tr>';
            }
            output += '</table>';
            $("#mysql-db-size").html(output);
        }
    });
};

function setBackupStatus() {
        $.ajax({
        type: "POST",
        url: "/ajaxmysql?action=set_backup",
        dataType: "json",
	data: { backup: $("#mysql-backup").prop('checked') },
        success: function(data) {
		$('#DoneModal').modal();
        }
    });
}

function getBackupStatus() {
	$.ajax({
        type: "GET",
        url: "/ajaxmysql?action=get_backup",
        dataType: "json",
        success: function(data) {
            if ((data == null) || (data == '')) return;
            if (data.backup == "enabled") $("#mysql-backup").prop('checked', true);
	    else $("#mysql-backup").prop('checked', false);
	    html = '<table class="table responsive">';
	    html += '<thead><th>Size</th><th colspan="3" class="text-center">Date</th><th>Filename</th><th>Action</th></thead>';
	    for (var i = 0; i < data.backups.length; i++){
		for (var key in data.backups[i]){
		    backups = data.backups[i][key].split(" ");
		    console.log(backups);
		    html += '<tr class="clickable-row">';
		    for (var backup = 0; backup < backups.length; backup++) {
			html += "<td>"+ backups[backup]  +"</td>";
		    }
	    	    html += "<td></td>";
		    html += "</tr>";
    		}
	    }
	    html += "</table>";
	    $('#mysql-basckups').html(html);
        }
    });
}

function getConfigStatus() {
    $.ajax({
        type: "GET",
        url: "/ajaxmysql?action=get_config",
        dataType: "json",
        success: function(data) {
            if ((data == null) || (data == '')) return;
            output = '<table id="mysqlTable" class="table table-responsive table-hover">';
            output += '<tr class="clickable-row"><td><b>name</b></td><td><b>value</b></td></tr>';
            for (var i = 1; i < 5; i++) {
                array = data[i].split("=");
                output += '<tr>';
                output += '<td>'+array[0].replace(/\s+/g,'')+'</td><td><input id="'+array[0].replace(/\s+/g, '')+'" class="form-control" value="' + array[1] + '"></input></td>';
                output += '</tr>';
            }
            output += '</table>';
            $("#mysql-config").html(output);
        }
    });
};

getConfigStatus();
getMasterReplicStatus();
getSlaveReplicStatus();
getUserReplic();
getDbSize();
getBackupStatus();
