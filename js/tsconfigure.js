var project;
var numberphing;
var configfile;

function escapechar(string) {
	var htmlEscapes = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;' };
	var htmlEscaper = /[&<>"'\/]/g;
	return ('' + string).replace(htmlEscaper, function(match) { return htmlEscapes[match]; });
}

function clearsecretswitch(position) {
   if ($('#addphing_value'+position).attr("type") == "text") $('#addphing_value'+position).attr("type", "password"); 
   else $('#addphing_value'+position).attr("type", "text");
}

function delphing (position) {
   $('#form_'+position).remove(); 
    numberphing = numberphing - 1;
}

function addphing() {
    $('#editconfigmodaltext').append('<div class="col-sm-12"><div class="form-group" id="form_'+numberphing+'"><div class="col-sm-4"><input type="text" class="form-control" id="addphing_label'+numberphing+'" /></div><div class="col-sm-2"><select class="form-control" onchange="clearsecretswitch('+numberphing+');" id="phing_value_type'+numberphing+'"><option value="clear">clear</option><option value="secret">secret</option></select></div><div class="col-sm-4"><input type="text" class="form-control" id="addphing_value'+numberphing+'" value=""></input></div><div class="col-sm-2"><button class="btn btn-danger" onclick="delphing('+numberphing+');"><span class="glyphicon glyphicon-minus"></span></button></div><br><br></div>');
    numberphing = numberphing + 1;
}

function viewlistfiles(service) {
    $('#listconfigmodaltext').text('');
    $('#ViewConfigFolderModal').modal('show');
    $.ajax({
        type: "GET",
        url: "/ajaxtsconfigure?action=listconfiguration&project="+service,
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

function applyConfiguration(service) {
    $('#ApplyConfigModal').modal('show');
    $.ajax({
        type: "GET",
        url: "/ajaxtsconfigure?action=applyconfiguration&project="+service,
        success: function(data) {
            $('#applyconfigmodaltext').html(data);
        }
    });
}

function editConfiguration (service) {
    project = service;
    $('#editconfigmodaltext').text('');
    $('#EditConfigModal').modal('show');
    $.ajax({
        type: "GET",
        url: "/ajaxtsconfigure?action=editconfiguration&project="+service,
        dataType: "json",
        success: function(data) {
            numberphing = 0;
            for (var line in data) {
                if (typeof data[line] === 'string') dataprint = data[line]; else dataprint = JSON.stringify(data[line]);
                $('#editconfigmodaltext').append('<div class="col-sm-12"><div class="form-group" id="form_'+numberphing+'"><div class="col-sm-4"><input type="text" class="form-control" id="addphing_label'+numberphing+'" value="'+line+'" /></div><div class="col-sm-2"><select class="form-control" onchange="clearsecretswitch('+numberphing+');" id="phing_value_type'+numberphing+'"><option value="clear">clear</option><option value="secret">secret</option></select></div><div class="col-sm-4"><input type="text" class="form-control" id="addphing_value'+numberphing+'" value="'+escapechar(dataprint)+'"></input></div><div class="col-sm-2"><button class="btn btn-danger" onclick="delphing('+numberphing+');"><span class="glyphicon glyphicon-minus"></span></button></div><br><br></div>');
                if (data[line] == "*****") {
                   $('#phing_value_type'+numberphing).val('secret');
                   $('#addphing_value'+numberphing).attr("type", "password");
                }
                numberphing = numberphing + 1;
            }
        }
    });
}

function showuploadconfig (service) {
   project = service;
   $('#UploadConfigModal').modal('show');
}

function saveConfigIni () {
   json = $('#config_ini').val().replace(/\n/g,"&")
    $.ajax({
        type: "POST",
        url: "/ajaxtsconfigure?action=saveconfiguration&project="+project,
        data: json,
        success: function(data) {
            $('#UploadConfigModal').modal('hide');
        }
    });
}

function saveConfiguration () {
    var config={};
    console.log(numberphing);
    for (var i=0; i < numberphing; i++) {
        key = $('#addphing_label'+i).val();
        if ($('#addphing_value'+i).attr("type") == "password")
            config[key] = $('#addphing_value'+i).val()+' # secret';
       else config[key] = $('#addphing_value'+i).val();
    }
    $.ajax({
        type: "POST",
        url: "/ajaxtsconfigure?action=saveconfiguration&project="+project,
        data: config,
        success: function(data) {
            $('#EditConfigModal').modal('hide');
        }
    });
}

function getServices() {
    $.ajax({
        type: "GET",
        url: "/ajaxtsconfigure?action=getservices",
        dataType: "json",
        success: function(data) {
            $('#table-ts-configure-list').text('');
            for (var service in data) {
                row='<tr><td>'+service+' <a href="#" id="phing_info" onclick="viewlistfiles(\''+service+'\');"><span class="glyphicon glyphicon-info-sign"></span></a></td><td><button class="btn btn-primary" id="'+service+'_btn" onclick="editConfiguration(\''+service+'\');">Edit</button></td>]';
                row+='<td><div class="dropdown dropdown-btn"><button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Download <span class="caret"></span></button>';
                row+='<ul class="dropdown-menu"><li><a href="/ajaxtsconfigure?action=editconfiguration&project='+service+'&type=json" target="_blank" download>JSON</a></li><li><a href="/ajaxtsconfigure?action=editconfiguration&project='+service+'&type=ini" target="_blank" download>INI</a></li>';
                row+='</ul></div></td>';
                row+='<td><button class="btn btn-primary" onclick="showuploadconfig(\''+service+'\');">Upload</a></button>';
                row+='</td>';
                row+='<td><button class="btn btn-danger" id="'+service+'_btn" onclick="applyConfiguration(\''+service+'\');"';
                if (data[service] == 0) row+=' disabled';
                row+='>Apply</button></td></tr>';
                $('#table-ts-configure-list').append(row);
            }
        }
    });
}

getServices();
