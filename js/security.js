$('#securityTable tr').hover(function() {
      $(this).addClass('active').siblings().removeClass('active');
});

function SecurityTableSelection(object) {
    console.log(object)
    $("#list_rule_"+object).addClass('danger').siblings().removeClass('danger');
    $("#security-del-rule-value").val(object);
};


$("#security-del-rule-btn").click(function(){
    if ($("#security-del-rule-value").val() == 0) return;
    $.post("/ajaxfw", { action: "delete", rule_id: $("#security-del-rule-value").val() })
        .done(function (data) {
            $("#security-del-rule-value option[value='"+$("#security-del-rule-value").val()+"']").remove();
            getStatus();
        });
});

$("#security-add-rule-btn").click(function(){
    $.post("/ajaxfw", { action: "add", add_from: $("#add_from").val(), add_port: $('#add_port').val() })
        .done(function (data) {
            $("#AddRulesModal").modal('hide');
            getStatus();
        });
});

function modifyStatus(modify) {
    $.ajax({
        type: "GET",
        url: "/ajaxsecurity?action="+modify,
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
        url: "/ajaxsecurity",
        dataType: "json",
        success: function(data) {
            $("#security-status-btn").removeClass();
            $("#security-status-btn").unbind('click');
            if (data[0].securitystatus == "active") {
                $('#security-del-rule-value').empty();
                $("#security-status-btn").addClass('btn btn-danger');
                $("#security-status-btn").text('Disable');
                $("#security-status-btn").on('click', function() { modifyStatus('disable'); });
                //console.log(data[1]);
                output = '<table id="securityTable" class="table table-responsive table-hover">';
                output += '<tr class="clickable-row"><td><b>id</b></td><td><b>port</b></td><td><b>type</b></td><td><b>from</b></td></tr>';
                for (var i = 0; i < data[1].rules.length; i++){
                    var array = data[1].rules[i].split(',');
                    output += '<tr id="list_rule_' + array[0] + '" onclick="SecurityTableSelection('+array[0]+');">';
                    for (var j = 0; j < array.length; j++) {
                        output += '<td>' + array[j] + '</td>';
                    }
                    output += '</tr>';
                    $('#security-del-rule-value').append( '<option value="'+array[0]+'">'+array[0]+'</option>' );
                }
                output += '</table>';
                $("#security-status-txt").html(output);
                $("#security-del-rules").show();
                $("#security-add-rules").show();
            } else {
                $("#security-del-rules").hide();
                $("#security-status-btn").addClass('btn btn-success');
                $("#security-status-btn").text('Enable');
                $("#security-status-btn").on('click', function() { modifyStatus('enable'); });
                $("#security-status-txt").html('<div align="center"><br><p><b>Firewall disabled.</b></p><br></div>');
                $("#security-add-rules").hide();
            }
        },
        error: function(data) {
        }
    });
}
getStatus();
