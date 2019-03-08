var esm = {};

function esmAutoUpgradeToggle () {
    $.ajax({
        type: "GET",
        url: "ajaxupgradets?action=toggle",
        dataType: "json",
        success: function() {
		getAutoUpgrade();
        }
    });
}

function getAutoUpgrade () {
    $.ajax({
        type: "GET",
        url: "ajaxupgradets?action=status",
        dataType: "json",
        success: function(dataAutoUpg) {
    	    if (dataAutoUpg) {
		$('#esm_auto_upgrade_btn').text(dataAutoUpg.action + " auto upgrade");
		if (dataAutoUpg.action === 'enable') $('#esm_auto_upgrade_btn').removeClass("btn-danger").addClass("btn-success");
		else $('#esm_auto_upgrade_btn').removeClass("btn-success").addClass("btn-danger");
	    }
        }
    });

}

function viewapacheconfig(service) {
    $('#tsmgmtstatus-text').text('');
    $('#InformModal').modal('show');
    $.ajax({
        type: "GET",
        url: "ajaxts?action=getapacheconfig&project="+service,
        dataType: "json",
        success: function(data) {
		display = data.output + "<br>";
            	$('#tsmgmtstatus-text').html(display);
        }
    });
}

function htaccess_save () {
    $.ajax({
        type: "POST",
        url: "/ajaxts?action=savehtaccess&project="+$('#projectname').val(),
        data: { content: $('#edithtaccessmodaltext').val() },
        dataType: "json",
        success: function(data) {
            $('#EdithtaccessModal').modal('hide');
        }
    });
}

function htaccess_edit (project) {
    $('#edithtaccessmodaltext').text('');
    $('#EdithtaccessModal').modal('show');
    $('#projectname').val(project);
    $.ajax({
        type: "GET",
        url: "/ajaxts?action=edithtaccess&project="+project,
        dataType: "json",
        success: function(data) {
            if (data.content)
                $('#edithtaccessmodaltext').text(data.content);
        }
    });
}

function StartBootProcesses (process,object) {
	$.ajax({
		type: "GET",
		url: "/ajaxbootprocesses",
		data: "action=enable&process=" + process,
		success : function(text){
			esm.getProcesses();
                	console.log("success!");
        },
        error: function(error) {
                console.log("error : " + error);
        }
    });
}
function StopBootProcesses (process,object) {
        $.ajax({
                type: "GET",
                url: "/ajaxbootprocesses",
                data: "action=disable&process=" + process,
                success : function(text){
			esm.getProcesses();
	                console.log("success!");
        },
        error: function(error) {
                console.log("error : " + error);
        }
    });
}

function StartProcesses (process,object) {
	$.ajax({
		type: "GET",
		url: "/ajaxprocesses",
		data: "action=start&process=" + process,
		success : function(text){
			esm.getProcesses();
                	console.log("success!");
        },
        error: function(error) {
                console.log("error : " + error);
        }
    });
}
function StopProcesses (process,object) {
        $.ajax({
                type: "GET",
                url: "/ajaxprocesses",
                data: "action=stop&process=" + process,
                success : function(text){
			esm.getProcesses();
	                console.log("success!");
        },
        error: function(error) {
                console.log("error : " + error);
        }
    });
}
function RestartProcesses (process) {
        $.ajax({
                type: "GET",
                url: "/ajaxprocesses",
                data: "action=restart&process=" + process,
                success : function(text){
			esm.getProcesses();
                	console.log("success!");
        },
        error: function(error) {
                console.log("error : " + error);
        }
    });
}


function tsdisable(projectname) {
	$.ajax({
        type: "GET",
        url: "/ajaxapache",
        data: "action=disable&project=" + projectname,
        success : function(text){
		$('#btn_apache2_'+projectname).attr('disabled','disabled');
		$('#btn_apache2_'+projectname).text('enable');
                console.log("success!");
        },
        error: function(error) {
                console.log("error : " + error);
        }
    });
}

function tsenable(projectname) {
        $.ajax({
        type: "GET",
        url: "/ajaxapache",
        data: "action=enable&project=" + projectname,
        success : function(text){
		$('#btn_apache2_'+projectname).removeAttr('disabled');;
		$('#btn_apache2_'+projectname).text('disable');
                console.log("success!");
        },
        error: function(error) {
                console.log("error : " + error);
        }
    });
}

function installProject (e, projectname) {
    $('.btn-yoctu-update').attr('disabled',true);
    $('#InformModal').modal('show');
    $('#tsmgmtstatus-text').html('<div align="center"><br><div class="loader"></div><br></div>');
    $(e).text('installing');
	$.ajax({
        type: "GET",
	url: "/ajaxts",
        data: "action=installproject&projectname=" + projectname,
        success : function(text){
            $('.btn-yoctu-update').attr('disabled',false);
            $(e).text('update');
            esm.getTechnicalServices();
	    esm.getYoctuServices();
    	    $('#InformModal').modal('hide');
        },
        error: function(error) {
		console.log("error : " + error);
        }
    });
}

function tsremove (projectname) {
    $('#InformModal').modal('show');
    $('#tsmgmtstatus-text').html('<div align="center"><br><div class="loader"></div><br></div>');
        $.ajax({
        type: "GET",
        url: "/ajaxts",
        data: "action=removeproject&projectname=" + projectname,
        success : function(text){
            $('.btn-yoctu-update').attr('disabled',false);
            esm.getTechnicalServices();
            esm.getYoctuServices();
            $('#InformModal').modal('hide');
        },
        error: function(error) {
                    console.log("error : " + error);
        }
    });
}


function updateProject (e, projectname) {
    $('.btn-yoctu-update').attr('disabled',true);
    $('#InformModal').modal('show');
    $('#tsmgmtstatus-text').html('<div align="center"><br><div class="loader"></div><br></div>');
    $(e).text('updating');
	$.ajax({
        type: "GET",
	url: "/ajaxts",
        data: "action=updateproject&projectname=" + projectname,
        success : function(text){
            $('.btn-yoctu-update').attr('disabled',false);
            $(e).text('update');
            esm.getTechnicalServices();
	    esm.getYoctuServices();
    	    $('#InformModal').modal('hide');
        },
        error: function(error) {
		    console.log("error : " + error);
        }
    });
}

function rollbackProject (e, version) {
    $('.btn-yoctu-rollback').attr('disabled',true);
    $('#InformModal').modal('show');
    $('#tsmgmtstatus-text').html('<div align="center"><br><div class="loader"></div><br></div>');
    $(e).text('rollbacking');
        $.ajax({
        type: "GET",
        url: "/ajaxts",
        data: "action=rollbackproject&dpkg=" + version,
        success : function(text){
            $('.btn-yoctu-rollback').attr('disabled',false);
            $(e).text('rollback');
            esm.getTechnicalServices();
            esm.getYoctuServices();
            $('#InformModal').modal('hide');
        },
        error: function(error) {
                    console.log("error : " + error);
        }
    });
}

esm.getSystem = function() {
    var module = 'system';
    esm.reloadBlock_spin(module);
    $.get('ajax'+module, function(data) {
        var $box = $('#esm-'+module+' tbody');
        esm.insertDatas($box, module, data);
        esm.reloadBlock_spin(module);
    }, 'json');
}

esm.getLoad_average = function() {
    var module = 'load_average';
    esm.reloadBlock_spin(module);
    $.get('ajax'+module, function(data) {
        var $box = $('#esm-'+module);
	for (i = 0; i < 3; i++) { 
		var $progress = $('#load-average_'+i);
        	$progress
            		.css('width', data[i]+'%')
            		.html(data[i]+'%')
            		.removeClass('progress-bar-warning progress-bar-danger progress-bar-success');

        	if (data[i] <= 30)
            		$progress.addClass('progress-bar-success');
        	else if (data[i] <= 60)
            		$progress.addClass('progress-bar-warning');
        	else
            		$progress.addClass('progress-bar-danger');
	}
        esm.reloadBlock_spin(module);
    }, 'json');
}

esm.getCpu = function() {
    var module = 'cpu';
    esm.reloadBlock_spin(module);
    $.get('ajax'+module, function(data) {
        var $box = $('#esm-'+module+' tbody');
        esm.insertDatas($box, module, data);
        esm.reloadBlock_spin(module);
    }, 'json');
}

esm.getMemory = function() {
    var module = 'memory';
    esm.reloadBlock_spin(module);
    $.get('ajax'+module, function(data) {
        var $box = $('#esm-'+module+' tbody');
        esm.insertDatas($box, module, data);
        esm.reloadBlock_spin(module);
        // Percent bar
        var $progress = $('.progressbar', $box);
        $progress
                        .css('width', data.percent_used+'%')
                        .html(data.percent_used+'%')
                        .removeClass('progress-bar-warning progress-bar-danger progress-bar-success');
        if (data.percent_used <= 30)
                $progress.addClass('progress-bar-success');
        else if (data.percent_used <= 60)
                $progress.addClass('progress-bar-warning');
        else $progress.addClass('progress-bar-danger');
    }, 'json');
}

esm.getBeanstalk = function() {
    var module = 'beanstalk';
    esm.reloadBlock_spin(module);
	$.get('ajaxbeanstalk', function(data) {
                var $box = $('#esm-beanstalk tbody');
                $box.empty();
                if (data != null) {
                        for (var line in data)
                        {
                                if (data[line] == null) continue;
                                var html = '<tr><td>' + line + '</td>';
                                var info = data[line].split(';')
                                for (var i = 0; i < info.length; i++) {
                                        html += '<td>'+info[i]+'</td>';
                                }
                                html += '</tr>';
                                $box.append(html);
                        }
        	esm.reloadBlock_spin(module);
                }
        }, 'json');
}

esm.getSwap = function() {
    var module = 'swap';
    esm.reloadBlock_spin(module);
    $.get('ajax'+module, function(data) {
        var $box = $('#esm-'+module+' tbody');
        esm.insertDatas($box, module, data);
        var $progress = $('.progressbar', $box);
        $progress
            .css('width', data.percent_used+'%')
            .html(data.percent_used+'%')
            .removeClass('progress-bar-warning progress-bar-danger progress-bar-success');

        if (data.percent_used <= 30)
                $progress.addClass('progress-bar-success');
        else if (data.percent_used <= 60)
                $progress.addClass('progress-bar-warning');
        else $progress.addClass('progress-bar-danger');
        esm.reloadBlock_spin(module);
    }, 'json');
}

esm.getDisk = function() {
    var module = 'disk';
    esm.reloadBlock_spin(module);
    $.get('ajax'+module, function(data) {
        var $box = $('#esm-'+module+' tbody');
        $box.empty();
        for (var line in data)
        {
            var bar_class = '';
            if (data[line].percent_used <= 30)
                 bar_class = 'progress-bar-success';
            else if (data[line].percent_used <= 60)
                 bar_class = 'progress-bar-warning';
            else bar_class = 'progress-bar-danger';
            var html = '';
            html += '<tr>';
            if (typeof data[line].filesystem != 'undefined')
                html += '<td>'+data[line].filesystem+'</td>';
            html += '<td>'+data[line].mount+'</td>';
            html += '<td><div class="progress text-center"><div class="progressbar '+bar_class+'" style="width: '+data[line].percent_used+'%;">'+data[line].percent_used+'%</div></div></td>';
            html += '<td>'+data[line].free+'</td>';
            html += '<td>'+data[line].used+'</td>';
            html += '<td>'+data[line].total+'</td>';
            html += '</tr>';
            $box.append(html);
        }
        esm.reloadBlock_spin(module);
    }, 'json');
}

esm.getLast_login = function() {
    var module = 'last_login';
    esm.reloadBlock_spin(module);
    $.get('ajax'+module, function(data) {
        var $box = $('#esm-'+module+' tbody');
        $box.empty();
        for (var line in data)
        {
            var html = '';
            html += '<tr>';
            html += '<td>'+data[line].user+'</td>';
            html += '<td class="w50p">'+data[line].date+'</td>';
            html += '</tr>';
            $box.append(html);
        }
        esm.reloadBlock_spin(module);
    }, 'json');
}

esm.getNetwork = function() {
    var module = 'network';
    esm.reloadBlock_spin(module);
    $.get('ajax'+module, function(data) {
        var $box = $('#esm-'+module+' tbody');
        $box.empty();
        for (var line in data)
        {
            var html = '';
            html += '<tr>';
            html += '<td>'+data[line].name+'</td>';
            html += '<td>'+data[line].ip+'</td>';
            html += '<td>'+data[line].receive+'</td>';
            html += '<td>'+data[line].transmit+'</td>';
            html += '</tr>';
            $box.append(html);
        }
        esm.reloadBlock_spin(module);
    }, 'json');
}

esm.getPing = function() {
    var module = 'ping';
    esm.reloadBlock_spin(module);
    $.get('ajax'+module, function(data) {
        var $box = $('#esm-'+module+' tbody');
        $box.empty();
        for (var line in data)
        {
            var html = '';
            html += '<tr>';
            html += '<td>'+data[line].host+'</td>';
            html += '<td>'+data[line].ping+' ms</td>';
            html += '</tr>';
            $box.append(html);
        }
        esm.reloadBlock_spin(module);
    }, 'json');
}

esm.getProcesses = function() {
    var module = 'processes';
    esm.reloadBlock_spin(module);
    $.get('ajax'+module, function(data) {
        var $box = $('#esm-'+module+' tbody');
        $box.empty();
        for (var line in data)
        {
            var label_color  = data[line].status == 1 ? 'label-success' : 'label-danger';
            var label_status = data[line].status == 1 ? 'online' : 'offline';
            var html = '';
            html += '<tr>';
            html += '<td>'+data[line].name+'</td>';
            html += '<td><span class="label '+label_color+'">'+label_status+'</span></td>';
            html += '<td>'+data[line].action+'</td>';
            html += '</tr>';
            $box.append(html);
        }
        esm.reloadBlock_spin(module);
    }, 'json');
}

esm.getYoctuServices = function() {
    var module = 'yts';
    var $box = $('#esm-'+module+' tbody');
    $box.html('<tr><td colspan="5" align="center"><div class="loader"></div></td></tr>');
    esm.reloadBlock_spin(module);
    $.get('ajaxts?action=getyoctu', function(data) {
	$box.html('');
        for (var line in data)
        {
            var label_color  = data[line].status == 1 ? 'label-success' : 'label-danger';
            var label_status = data[line].status == 1 ? 'online' : 'offline';
            var html = '';
            html += '<tr>';
            html += '<td><span class="label '+label_color+'">'+label_status+'</span></td>';
            html += '<td><img src="https://logos.yoctu.com/logo-svg-white/'+data[line].name.split("-")[0]+'-white.svg" height="24px;" width="24px;" /> '+data[line].name+'</td>';
            html += '<td>'+data[line].action+'</td>'; 
	    if (data[line].versions) {
		html += '<td><div class="dropdown dropdown-btn"><button id="btn_rollback_"' + data[line].name + ' class="btn btn-danger dropdown-toggle" data-toggle="dropdown">Rollback <span class="caret"></span></button>';	
		output = data[line].versions;
		output = output.replace(/\[/g, '');
		output = output.replace(/\]/g, '');
		output = output.split(',');
		html+='<ul class="dropdown-menu">';
		for (i = 0; i < output.length; ++i) {
			html+='<li onclick="rollbackProject(this, \''+output[i]+'\');"><font color="white">'+output[i]+'</font></li>';
		}
		html += '</ul></div></td>';
	    } else {
		html += '<td></td>';
	    }
            html += '<td>'+data[line].modify+'<td>';
            html += '</tr>';
            $box.append(html);
        }
        esm.reloadBlock_spin(module);
    }, 'json');
}


esm.getTechnicalServices = function() {
    var module = 'ts';
    esm.reloadBlock_spin(module);
    var a2dump;
    var $box = $('#esm-'+module+' tbody');
    $box.html('<tr><td colspan="7" align="center"><div class="loader"></div></td></tr>');
    $.get('ajaxts?action=getlist', function(data) {
        $box.empty();
        for (var line in data)
        {
            var label_color  = data[line].status == 1 ? 'label-success' : 'label-danger';
            var label_status = data[line].status == 1 ? 'online' : 'offline';
            var html = '';
            html += '<tr>';
            html += '<td><span class="label '+label_color+'">'+label_status+'</span></td>';
            html += '<td>'+data[line].name+' <a href="#" onclick="viewapacheconfig(\''+data[line].name+'\');"><span class="glyphicon glyphicon-info-sign"></span></a> </td>';
            html += '<td>'+data[line].port+'</td>';
            html += '<td>'+data[line].access+'</td>';
            html += '<td>'+data[line].error+'</td>';
	    html += '<td>'+data[line].version+'</td>';
	    html += '<td>'+data[line].time+'</td>';
            html += '<td>'+data[line].edit;
            html += ' '+data[line].action+'</td>';
            html += '</tr>';
            $box.append(html);
        }
        esm.reloadBlock_spin(module);
    }, 'json');
}

esm.getServices = function() {
    var module = 'services';
    esm.reloadBlock_spin(module);
    $.get('ajax'+module, function(data) {
        var $box = $('#esm-'+module+' tbody');
        $box.empty();
        for (var line in data)
        {
            var label_color  = data[line].status == 1 ? 'label-success' : 'label-danger';
            var label_status = data[line].status == 1 ? 'online' : 'offline';
            var html = '';
            html += '<tr>';
            html += '<td><span class="label '+label_color+'">'+label_status+'</span></td>';
            html += '<td>'+data[line].name+'</td>';
            html += '<td>'+data[line].port+'</td>';
            html += '</tr>';
            $box.append(html);
        }
        esm.reloadBlock_spin(module);
    }, 'json');
}

esm.getAll = function() {
    esm.getSystem();
    esm.getCpu();
    esm.getLoad_average();
    esm.getMemory();
    esm.getSwap();
    esm.getDisk();
    esm.getLast_login();
    esm.getNetwork();
    esm.getPing();
    esm.getServices();
    esm.getBeanstalk();
}

esm.reloadBlock = function(block) {
    esm.mapping[block]();
}

esm.reloadBlock_spin = function(block) {
    var $module = $('#esm-'+block);
}

esm.insertDatas = function($box, block, datas) {
    for (var item in datas)
    {
        $('#'+block+'-'+item, $box).html(datas[item]);
    }
}

esm.mapping = {
    all: esm.getAll,
    system: esm.getSystem,
    load_average: esm.getLoad_average,
    cpu: esm.getCpu,
    memory: esm.getMemory,
    swap: esm.getSwap,
    disk: esm.getDisk,
    last_login: esm.getLast_login,
    network: esm.getNetwork,
    ping: esm.getPing,
    services: esm.getServices,
    beanstalk: esm.getBeanstalk
};
