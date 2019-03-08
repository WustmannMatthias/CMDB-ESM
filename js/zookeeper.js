var numberserver;

function delserver (position) {
   $('#form_'+position).remove(); 
   numberserver = numberserver - 1;
}

function addserver() {
    $('#zookeeper-servers-config').append('<div class="form-group" id="form_'+numberserver+'"><div class="col-sm-4"><input type="text" class="form-control" id="addserver_label'+numberserver+'" value="server" disabled /></div><div class="col-sm-4"><input type="text" class="form-control" id="addserver_value'+numberserver+'" value=""></input></div><div class="col-sm-4"><button class="btn btn-danger" onclick="delserver('+numberserver+');"><span class="glyphicon glyphicon-minus"></span></button></div><br><br></div>');
    numberserver = numberserver + 1;
}

function saveID() {
    txt = "";
    $('#zookeeperstatus-text').html(txt);
    $.ajax({
        type: "GET",
        url: "/ajaxzookeeper?action=setid&id="+$('#zoo_id').val(),
        dataType: "json",
        success: function(data) {
          getZooID(); 
        }
    });
}

function saveServers () {
    var config={};
    for (var i=0; i <= numberserver; i++) {
        key = i;
        config[key] = $('#addserver_value'+i).val();
    }
    $.ajax({
        type: "POST",
        url: "/ajaxzookeeper?action=setnodes",
        data: config,
        success: function(data) {
            getZooServers();
        }
    });
}

function zoo_action(action) {
    $('#zookeeperaction').attr("disabled", "disabled");
    txt = "";
    $('#zookeeperstatus-text').html(txt);
    $.ajax({
        type: "GET",
        url: "/ajaxzookeeper?action=service&type="+action,
        dataType: "json",
        success: function(data) {
         $('#zookeeperaction').attr("disabled", "enabled");
          getStatus(); 
        }
    });
}

function getZooStatus() {
    txt = "";
    $('#zookeeperstatus-text').html(txt);
    $.ajax({
        type: "GET",
        url: "/ajaxzookeeper?action=service&type=status",
        dataType: "json",
        success: function(data) {
          txt = '<p>'+data.output+'</p>'
          if (data.result == 1) {
            txt += '<div align="right"><button class="btn btn-success" id="zookeeperaction" onclick="zoo_action(\'restart\');" >Start</button></div>';
          } else {
            txt += '<div align="right"><button class="btn btn-danger" id="zookeeperaction" onclick="zoo_action(\'stop\');">Stop</button></div>';
          }
          $('#zookeeperstatus-text').html(txt);
        }
    });
}

function getZooServers() {
    $('#zookeeper-servers-config').html("");
    $.ajax({
        type: "GET",
        url: "/ajaxzookeeper?action=getnodes",
        dataType: "json",
        success: function(servers) {
            numberserver = 0;
            max = servers.cpt;
            for (i = 1; i <= max; i++) {
                server="server."+i
                $('#zookeeper-servers-config').append('<div class="form-group" id="form_'+numberserver+'"><div class="col-sm-4"><input type="text" class="form-control" id="addserver_label'+numberserver+'" value="server" disabled/></div><div class="col-sm-4"><input type="text" class="form-control" id="addserver_value'+numberserver+'" value="'+servers[server]+'"></input></div><div class="col-sm-4"><button class="btn btn-danger" onclick="delserver('+numberserver+');"><span class="glyphicon glyphicon-minus"></span></button></div><br><br></div>');
                numberserver = numberserver + 1;
            }
        }
    });
}

function getZooID() {
    id = "";
    $('#zookeeper-id-config').html(id);
    $.ajax({
        type: "GET",
        url: "/ajaxzookeeper?action=getid",
        dataType: "json",
        success: function(id) {
          $('#zookeeper-id-config').html('<div class="form-inline" align="center">ZooKeeper Server ID : <input class="form-control" id="zoo_id" value='+id.output+'></input></div>');
        }
    });
}

function getStatus() {
    getZooStatus();
    getZooID();
    getZooServers();
}

getStatus();
