function viewhastat (stat) {
    $('#HaproxShowStatModal').modal('show');
    $('#haproxy-stat-txt').html('');
    $.ajax({
        type: "GET",
        url: "/ajaxhaproxyconsole?action=stat",
        dataType: "json",
        success: function(data) {
            stattable = '<table class="table table-hover responsive">';
            $('#haproxy-stat-txt').html('');
            for (line in data[stat]) {
                stattable += '<tr><td>' + line + '</td><td>' + data[stat][line] + '</td></tr>';
            }
            stattable += '</table>';
            $('#haproxy-stat-txt').html(stattable);
        }
    });
}

function HaproxyAction (type,backend,server) {
    $.ajax({
        type: "GET",
        url: "/ajaxhaproxyconsole?action=action&type="+type+"&backend="+backend+"&server="+server,
        dataType: "json",
        success: function(data) {
            $('#haproxy-info').html(data.output);
        }
    });
    getHaproxyStat();
}

function getHaproxyInfo () {
    $('#haproxy-info').html("");
    $.ajax({
        type: "GET",
        url: "/ajaxhaproxyconsole?action=info",
        dataType: "json",
        success: function(data) {
            table = '<table class="table table-hover responsive">';
            for (key in data) {
                table += '<tr><td>'+key+'</td><td>'+data[key]+'</td></tr>'
            }
            $('#haproxy-info').html(table);
            table += '</table>';
        }
    });
}

function getHaproxyStat () {
    $.ajax({
        type: "GET",
        url: "/ajaxhaproxyconsole?action=stat",
        dataType: "json",
        success: function(data) {
            $('#haproxy-stat').html('');
            table = '<table class="table table-hover responsive">';
            for (key in data) {
                if ((data[key]['svname'] != "BACKEND") && (data[key]['svname'] != "FRONTEND")) {
                    if (data[key]['status'].startsWith("UP")) { table += '<tr class="success">'; } 
                    if (!data[key]['status'].startsWith("UP")) { table += '<tr class="danger">'; } 
                } else {
                    table += '<tr>';
                }
                table += '<td>' + data[key]['pxname'] + ' <a href="#" onclick="viewhastat(\''+key+'\');"><span class="glyphicon glyphicon-info-sign"></span></a></td><td>' + data[key]['svname'] + '</td><td>'
                    + data[key]['status'] + '</td>';
                if ((data[key]['svname'] != "BACKEND")&&(data[key]['svname'] != "FRONTEND")) {
                    if (data[key]['status'].startsWith("UP")) {
                        table += '<td><button class="btn btn-danger" onclick="HaproxyAction(\'disable\',\''+data[key]['svname']+'\',\''+data[key]['pxname']+'\')">Disable</button></td>';
                    } else {
                        table += '<td><button class="btn btn-success" onclick="HaproxyAction(\'enable\',\''+data[key]['svname']+'\',\''+data[key]['pxname']+'\')">Enable</button></td>';
                    }
                } else { table += '<td></td>'; }
                table += '</tr>';
            }
            table += '</table>';
            $('#haproxy-stat').append(table);
        }
    });
}

getHaproxyInfo();
