var project;

function migrationstatus(service) {
    $('#MigrationStatusModal').modal('show');
    $.ajax({
        type: "GET",
        url: "/ajaxtsmigrate?action=status&project="+service,
        success: function(data) {
            $('#statusmigratemodaltext').html(data);
        }
    });
}

function migrationmigrate(service) {
    $('#MigrationStatusModal').modal('show');
    $.ajax({
        type: "GET",
        url: "/ajaxtsmigrate?action=migrate&project="+service,
        success: function(data) {
            $('#statusmigratemodaltext').html(data);
        }
    });
}

function migrationrollback(service) {
    $('#MigrationStatusModal').modal('show');
    $.ajax({
        type: "GET",
        url: "/ajaxtsmigrate?action=rollback&project="+service,
        success: function(data) {
            $('#statusmigratemodaltext').html(data);
        }
    });
}

function getServices() {
    $.ajax({
        type: "GET",
        url: "/ajaxtsmigrate?action=getservices",
        dataType: "json",
        success: function(data) {
            $('#table-ts-migration-list').text('');
            for (var service in data) {
                row='<tr><td>'+data[service]+'</td><td><button class="btn btn-primary" id="'+data[service]+'_btn" onclick="migrationstatus(\''+data[service]+'\');">Status</button></td>';
                row+='<td><button class="btn btn-warning"  id="'+data[service]+'_btn" onclick="migrationmigrate(\''+data[service]+'\');">Migrate</button></td>';
                row+='<td><button class="btn btn-danger" id="'+data[service]+'_btn" onclick="migrationrollback(\''+data[service]+'\');">Rollback</button></td></tr>';
                $('#table-ts-migration-list').append(row);
            }
        }
    });
}

getServices();
