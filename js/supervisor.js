function loadModalUpload() {
	$('#UploadConfigModal').modal('show');
	$('#config_file_name').val("");
	$('#config_file').val("");
}

function deleteConfig(config) {
	$.ajax({
        type: "GET",
        url: "/ajaxsupervisor?action=deleteconfig&file="+config,
        success: function(data) {
		getConfigList();
	}
	});
}

function getConfigList () {
$('#supervisor-config-list-txt').html('');
$.ajax({
        type: "GET",
        url: "/ajaxsupervisor?action=configlist",
        dataType: "json",
        success: function(data) {
		if (data && data.output) {
		config_file=data.output.split(' ');

		output = '<table id="supervisorTable" class="table table-responsive table-hover">';
            	output += '<tr class="clickable-row"><td align="center"><b>name</b></td><td align="center"><b>action</b></td></tr>';

		for (file in config_file) {
			if (config_file[file] != "") {
				output += '<tr align="center"><td>'+config_file[file].split('.')[0]+'  <a href="#" onclick="viewfile(\''+config_file[file].split(".")[0]+'\');"><span class="glyphicon glyphicon-info-sign"></span></a></td><td align="center"><button class="btn btn-danger" onclick="deleteConfig(\''+config_file[file].split('.')[0]+'\');"><span class="glyphicon glyphicon-remove-sign"></span></button></td></tr>';	
			}
		}
		output += '</table>';
                $('#supervisor-config-list-txt').html(output);
			$('#supervisor-config-list-btn').html('<div align="right"><button class="btn btn-danger" onclick="loadModalUpload();"><span class="glyphicon glyphicon-plus"></span></div>');
		}
         }
    });
}

function saveConfig () {
   json = $('#config_file').val().replace(/\n/g,"&")
    $.ajax({
        type: "POST",
        url: "/ajaxsupervisor?action=saveconfiguration&file="+$('#config_file_name').val(),
        data: { supervisor: json } ,
        success: function(data) {
            $('#UploadConfigModal').modal('hide');
		getConfigList();
        }
    });
}

function viewfile(file) {
    $('#listconfigmodaltext').text('');
    $('#ViewConfigFolderModal').modal('show');
    $.ajax({
        type: "GET",
        url: "/ajaxsupervisor?action=listconfiguration&file="+file,
        dataType: "json",
        success: function(data) {
                display = data.output + "<br>";
                for (key in data) {
                        if ((key != "output") && (key != "root")) {
                                display += data[key] + "<br>";
                        }
                }
                $('#listconfigmodaltext').html(display);
        }
    });
}

function supervisor_action(name,pid,action) {
    $("#sup_res_" + pid).prop('disabled', true);
    $("#sup_act_" + pid).prop('disabled', true);
    $.ajax({
        type: "GET",
        url: "/ajaxsupervisor?action="+action+"&name="+name,
        success: function(data) {
            $("#sup_res_" + pid).prop('disabled', false);
            $("#sup_act_" + pid).prop('disabled', false);
            getStatus();
        }
    });
}

function supervisor_restart(name,pid) {
    $("#sup_res_" + pid).prop('disabled', true);
    $("#sup_act_" + pid).prop('disabled', true);
    $.ajax({
        type: "GET",
        url: "/ajaxsupervisor?action=restart&name="+name,
        success: function(data) {
            $("#sup_res_" + pid).prop('disabled', false);
            $("#sup_act_" + pid).prop('disabled', false);
            getStatus();
        }
    });
}

function getStatus() {
    $.ajax({
        type: "GET",
        url: "/ajaxsupervisor?action=list",
        dataType: "json",
        success: function(data) {
            if (data == null) return;
            output = '<table id="supervisorTable" class="table table-responsive table-hover">';
            output += '<tr class="clickable-row"><td align="center"><b>name</b></td><td><b>stdout</b></td><td><b>stderr</b></td><td><b>status</b></td><td><b>pid</b></td><td><b>uptime</b></td><td><b>action</b></td></tr>';
            for (var i = 0; i < data.length; i++) {
                array = data[i];
                output += '<tr id="supervisor_' + array.pid + '">';
                if (array.status == "RUNNING") { 
                    action="stop";
                    textcolor="success";
                } else { 
                    action="start";
                    textcolor="danger";
                }
                output += '<td align="center">' + array.name + '</td><td><a href="/tail?type=supervisor&file='+array.name+'&std=stdout" target="_blank">view stdout</a></td><td><a href="/tail?type=supervisor&file='+array.name+'&std=stderr" target="_blank">view-stderr</a></td><td class="text-'+textcolor+'">' + array.status + '</td><td>' + array.pid + '</td><td class="text-'+textcolor+'">' + array.uptime + '</td>';
                output += '<td>';
                if (action == "stop") output += '<button class="btn btn-primary" id="sup_res_' + array.pid + '" onclick="supervisor_restart(\'' + array.name + '\',\''+array.pid+'\');">restart</button>   ';
                output +='<button class="btn btn-primary" id="sup_act_'+array.pid+'" onclick="supervisor_action(\'' + array.name + '\',\''+array.pid+'\',\''+action+'\')">' + action + '</button>';
                output += '</td>';
                output += '</tr>';
            }
            output += '</table>';
            $("#supervisor-status-txt").html(output);
        }
    });
};

getConfigList();
getStatus();
