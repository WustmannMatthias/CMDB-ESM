var numberserver;

function viewlistfiles(service) {
    $('#ViewConfigHAPModal').modal('show');
    $.ajax({
        type: "GET",
        url: "/ajaxhaproxy?action=getfile&name="+service,
        dataType: "json",
        success: function(data) {
            $('#listconfigmodaltext').html(data.output);
        }
    });
}

function delserver(position) {
    $('#form_'+position).remove(); 
    numberserver = numberserver - 1;
}

function addserver() {
    $('#haproxy-server-add').append('<div class="form-group row" id="form_'+numberserver+'"><div class="col-md-2"><label>server:</label></div><div class="col-md-2"><input class="form-control" id="server'+numberserver+'" placeholder="server'+numberserver+'"></div><div class="col-md-2"><label>port:</label></div><div class="col-md-2"><input class="form-control" id="server'+numberserver+'_port" placeholder="port"></div><div class="col-md-2"><div class="checkbox"><input type="checkbox" id="server'+numberserver+'_bkp" placeholder="server">backup</div></div><div class="col-md-2"><button class="btn btn-danger" id="server'+numberserver+'_del" onclick="delserver('+numberserver+');" placeholder="port"><span class="glyphicon glyphicon-minus"></span></button></div></div>');
    numberserver = numberserver + 1;
}

$("#mode").change(function() {
    if ($("#mode").val() == "tcp") {
        $("#group-option1").hide(); 
        $("#group-option2").hide(); 
        $("#group-reqadd").hide(); 
        $("#option1").val('');
        $("#option2").val('');
        $("#reqadd").val('');
    } else {
        $("#group-option1").show(); 
        $("#group-option2").show(); 
        $("#group-reqadd").show(); 
        $("#option1").val('httpclose');
        $("#option2").val('forwardfor');
        $("#reqadd").val('');
    }
});

$("#create_haproxy_config").click(function() {
    numberserver = 1;
    $("#filename").val(Math.floor(Date.now() / 1000)+'.cfg');
    $("#listen").val(Math.floor(Date.now() / 1000));
    $("#ip").val('127.0.0.1');
    $("#port").val('80');
    $("#balance").val('roundrobin');
    $("#option1").val('httpclose');
    $("#option2").val('forwardfor');
    $("#reqadd").val('');
    $('#haproxy-server-add').html('');
});

$("#export_haproxy_config").click(function() {
    window.open("/ajaxhaproxy?action=export", "_blank");
});

function importConfig() {
    json = $('#config_file').val().replace(/\n/g,"&")
    $.ajax({
        type: "POST",
        url: "/ajaxhaproxy?action=import",
        data: { haproxy: json } ,
        success: function(data) {
		getStatus();
        }
    });

}

$("#haproxy-create-config-btn").click(function() {
    if ($("#filename").val() && $("#listen").val()  && $("#ip").val() && $('#port').val() && $('#mode').val() && $('#balance').val()) {
        if ($("#filename").val().startsWith("00")) return;
        data_server = '{';
        for (var i=1;i<numberserver;i++) {
            console.log($('#server'+i).val());
            if (!$('#server'+i).val()) return;
            if (!$('#server'+i+'_port').val()) return;
            if ($('#server'+i+'_bkp').is(":checked")) s_bkp = 'backup';
            else s_bkp = 'active';
            if (i > 1) data_server += ',';
            data_server += '"server'+i+'": { "server_ip": "' + $('#server'+i).val() + '", "server_port": "' + $('#server'+i+'_port').val() + '", "server_bkp": "' + s_bkp + '"}';
        }
        data_server += '}';
        $.ajax({
            type: "POST",
            url: "/ajaxhaproxy?action=create",
            data: { filename: $("#filename").val(), listen: $("#listen").val(), ip: $("#ip").val(), port: $('#port').val(), mode: $('#mode').val(), option1: $('#option1').val(), option2: $('#option2').val(), balance: $('#balance').val(), reqadd: $('#reqadd').val(), servers: data_server },
            success: function(data) {
                $("#HaproxyNewModal").modal('hide');
                getStatus();
            }
        });
    } else {
        console.log('value missing');
        return;
    }
});

function editconfig(object) {
    $.ajax({
        type: "GET",
        url: "/ajaxhaproxy?action=getconfig&name="+object.id,
        dataType: "json",
        success: function(data) {
            $('#haproxy-server-add').html('');
            numberserver=1
            for (key in data) {
                if (data[key].split("=")[1] == "") continue;
                if (data[key].split("=")[0] == "filename") {
                    $("#filename").val(data[key].split("=")[1]);
                }
                if (data[key].split("=")[0] == "balance") {
                    $("#balance").val(data[key].split("=")[1]);
                }
                if (data[key].split("=")[0] == "listen") {
                    $("#listen").val(data[key].split("=")[1]);
                }
                if (data[key].split("=")[0] == "bind") {
                    $("#ip").val(data[key].split("=")[1].split(':')[0]);
                    $("#port").val(data[key].split("=")[1].split(':')[1]);
                }
                if (data[key].split("=")[0] == "option") {
                    if ($("#option1").val() == "") $("#option1").val(data[key].split("=")[1]);
                    else $("#option2").val(data[key].split("=")[1]);
                }
                if (data[key].split("=")[0] == "mode") {
                    $("#mode").val(data[key].split("=")[1]);
                    if ($("#mode").val() == 'tcp') {
                        $("#group-option1").hide();
                        $("#group-option2").hide();
			$("#reqadd").hide();
                        $("#option1").val('');
                        $("#option2").val('');
			$("#reqadd").val('');
                    } else {
                        $("#group-option1").show();
                        $("#group-option2").show();
                    }
                }
                if (data[key].split("=")[0] == "reqadd") {
                    $("#reqadd").val(data[key].split("=")[1].split(" ")[1]);
                }
                if (data[key].split("=")[0] == "server") {
                    console.log(data[key]);
                    $('#haproxy-server-add').append('<div class="form-group row" id="form_'+numberserver+'"><div class="col-md-2"><label>server:</label></div><div class="col-md-2"><input class="form-control" id="server'+numberserver+'" placeholder="server'+numberserver+'"></div><div class="col-md-2"><label>port:</label></div><div class="col-md-2"><input class="form-control" id="server'+numberserver+'_port" placeholder="port"></div><div class="col-md-2"><div class="checkbox"><input type="checkbox" id="server'+numberserver+'_bkp" placeholder="server">backup</div></div><div class="col-md-2"><button class="btn btn-danger" id="server'+numberserver+'_del" onclick="delserver('+numberserver+');" placeholder="port"><span class="glyphicon glyphicon-minus"></span></button></div></div>');
                    if (data[key].split("=")[1].includes("backup")) {
                        $('#server'+numberserver+'_bkp').attr('checked', true);
                    }
                    $("#server"+numberserver).val(data[key].split("=")[1].split(" ")[1].split(':')[0]);
                    $("#server"+numberserver+"_port").val(data[key].split("=")[1].split(" ")[1].split(':')[1]);
                    numberserver = numberserver + 1;
                }
            }
        }
    });
    $("#haproxy-create-config-btn").text('Save');
    $("#HaproxyNewModal").modal('show');
}

function haproxy_action(name,action) {
    $.ajax({
        type: "GET",
        url: "/ajaxhaproxy?action="+action+"&name="+name,
        success: function(data) {
            getStatus();
        }
    });
}

function getStatus() {
    $.ajax({
        type: "GET",
        url: "/ajaxhaproxy?action=list",
        dataType: "json",
        success: function(data) {
            if (data == null) return;
            output = '<table id="haproxyTable" class="table table-responsive table-hover">';
            output += '<tr class="clickable-row"><th>name</th><th colspan="3"><div align="center">action</div></th><th>status</th></tr>';
            for (var i = 0; i < data.length; i++) {
                array = data[i];
                output += '<tr id="haproxy_' + array.name + '">';
                output += '<td>'+array.name+' <a href="#" id="phing_info" onclick="viewlistfiles(\''+ array.name +'\');"><span class="glyphicon glyphicon-info-sign"></span></a></td><td><button class="btn btn-danger" onclick="haproxy_action(\''+array.name+'\',\'delete\');">Delete</button></td><td><button class="btn btn-primary" id="'+array.name+'" onclick="editconfig(this);">Edit</button>';
                if (array.status == true) output += '<td><button class="btn btn-warning" onclick="haproxy_action(\''+array.name+'\',\'disable\');">Disable</button></td>';
                if (array.status == false) output += '<td><button class="btn btn-success" onclick="haproxy_action(\''+array.name+'\',\'enable\');">Enable</button></td>';
                if (array.status == true) output += '<td><span class="label label-success">online</span></td>';
                if (array.status == false) output += '<td><span class="label label-danger">offline</span></td>';
                output += '</tr>';
            }
            output += '</table>';
            $("#haproxy-status-txt").html(output);
        }
    });
};

getStatus();
