function go (mon_type) {
  switch(mon_type) {
        case 'cpu'   : $('#panel-title-id').html("CPU Usage");break;
        case 'mem'   : $('#panel-title-id').html("Memory Usage");break;
        case 'net'   : $('#panel-title-id').html("Network Usage");break;
        case 'apache': $('#panel-title-id').html("Apache Req Per Sec");break;
        case 'haproxy': $('#panel-title-id').html("Haproxy Cur Con");break;
        case 'mysql' : $('#panel-title-id').html("Mysql Rez Per Sec");break;
  }
  $.ajax({
    type: "GET",
    url: "/ajaxmonitor?type=clean",
    success : function(){
      chart.updateData("/ajaxmonitor?type="+mon_type);
    }
  });
}

function change_refreshtime () {
  chart.setOptions({refresh: $('#refresh-select').val()});
  chart.stopRefresh();
  chart.startRefresh();
}

var chart = new Chartkick.LineChart("monitoring-chart", "", {refresh: $('#refresh-select').val()});
