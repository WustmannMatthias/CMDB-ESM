function solr_action(action) {
    $('#solraction').attr("disabled", "disabled");
    txt = "";
   $('#solrstatus-text').html('<div align="center"><br><div class="loader"></div><br></div>');
    $.ajax({
        type: "GET",
        url: "/ajaxsolr?action=service&type="+action,
        success: function(data) {
         $('#solraction').attr("disabled", "enabled");
	  getSolrStatus();
        }
    });
}

function solrConnectorDeploy() {
	$('#solrconnector_btn').prop("disabled", true);
	$('#solr-connector-result').html('<div align="center"><br><div class="loader"></div><br></div>');
	$.ajax({
        type: "GET",
        url: "/ajaxsolr?action=connectordeploy&url="+$('#solr-connector-input').val(),
        dataType: "json",
        success: function(data) {
          if (data.result == "ok")  $('#solr-connector-result').html('<div align="center" class="text-success">Success</div>');
          else $('#solr-connector-result').html('<div align="center" class="text-danger">Failed</div>');
          $('#solrconnector_btn').prop("disabled", false);
          getSolrList();
        }
    });
}

function solrManualDeploy(project) {
    $('#solrmanualdeploy_btn').prop("disabled", true);
    $('#solr-manual-deploy-result').html('<div align="center"><br><div class="loader"></div><br></div>');
    $.ajax({
        type: "GET",
        url: "/ajaxsolr?action=manualdeploy&url="+$('#solr-manual-deploy-input').val()+'&name='+$('#solr-manual-deploy-name').val(),
        dataType: "json",
        success: function(data) {
	  if (data.result == "ok")  $('#solr-manual-deploy-result').html('<div align="center" class="text-success">Success</div>');
	  else $('#solr-manual-deploy-result').html('<div align="center" class="text-danger">Failed</div>');
	  $('#solrmanualdeploy_btn').prop("disabled", false);
          getSolrList(); 
        }
    });
}

function solrDeploy(project) {
    $('#solrdeploy_btn').prop("disabled", true);
    $('#solr-deploy-text').html('<div align="center"><br><div class="loader"></div><br></div>');
    $.ajax({
        type: "GET",
        url: "/ajaxsolr?action=deploy&project="+project,
        dataType: "json",
        success: function(data) {
          $('#solrdeploy_btn').val("Remove");
          $('#solrdeploy_btn').removeClass();
          $("#solrdeploy_btn").addClass('btn btn-danger');
          $('#solrdeploy_btn').attr("disabled", true);
          getSolrList(); 
        }
    });
}

function solrUndeploy(project) {
    $('#solrdeploy_btn').prop("disabled", true);
    $.ajax({
        type: "GET",
        url: "/ajaxsolr?action=undeploy&project="+project,
        dataType: "json",
        success: function(data) {
          $('#solrdeploy_btn').val("Remove");
          $('#solrdeploy_btn').removeClass();
          $("#solrdeploy_btn").addClass('btn btn-success');
          $('#solrdeploy_btn').prop("disabled", true);
          getSolrList(); 
        }
    });
}

function getSolrList() {
   txt = "";
   $('#solr-deploy-text').html(txt);
   $.ajax({
      type: "GET",
      url: "/ajaxsolr?action=listdeployable",
      dataType: "json",
      success: function(data) {
         txt = '<table class="table responsive">';
         for (key in data) {
            if (data[key]) {
                if (data[key] == 1)
                    txt += '<tr><td><div align="center">'+key+'</div></td><td><div align="center"><button id="solrdeploy_btn" class="btn btn-success" onclick="solrDeploy(\''+key+'\');">Deploy</button></div></td></tr>';
                else
                    txt += '<tr><td><div align="center">'+key+'</div></td><td><div align="center"><button id="solrdeploy_btn" class="btn btn-danger" onclick="solrUndeploy(\''+key+'\');">Remove</button></div></td></tr>';
            }
         }
         txt += '</table>';
         $('#solr-deploy-text').html(txt);
      }
   });
}

function getSolrStatus() {
   txt = "";
   $('#solrstatus-text').html('<div align="center"><br><div class="loader"></div><br></div>');
   $.ajax({
      type: "GET",
      url: "/ajaxsolr?action=status",
      dataType: "json",
      success: function(data) {
          txt = data.output;
          if (data.result == 1) {
            txt += '<div align="right"><button class="btn btn-danger" id="solraction" onclick="solr_action(\'stop\');">Stop</button></div>';
          } else {
            txt += '<div align="right"><button class="btn btn-success" id="solraction" onclick="solr_action(\'start\');" >Start</button></div>';
          }
         $('#solrstatus-text').html(txt);
      }
   });
}

function getSolrConfig() {
   txt='';
   $('#solrconfig-text').html(txt);
   $.ajax({
      type: "GET",
      url: "/ajaxsolr?action=config",
      dataType: "json",
      success: function(data) {
         txt = '<table class="table responsive">';
         for (key in data) {
            if ( (key == 'status') || (key == 'result') || (key == 'action')) continue;
            txt += '<tr><td>'+key+'</td><td>'+data[key]+'</td></tr>';
         }
         txt += '</table>';
         $('#solrconfig-text').html(txt);
      }
   });
}

function getStatus() {
   //getSolrStatus();
   getSolrConfig();
   getSolrList();
}

getStatus();
