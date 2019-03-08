var urlParams = new URLSearchParams(window.location.search);

if (urlParams.get('std')) { std = urlParams.get('std'); }
else { std = ""; }

$('#logfilename').text(urlParams.get('type') + ' -  ' + urlParams.get('file') + std);
$('#download_id').attr("href","/ajaxtail?type=download" + urlParams.get('type') + "&file=" + urlParams.get('file')+ "&std=" + std);

$.ajax({
  type: "GET",
  url: "/ajaxtail?project=" + urlParams.get('project') + "&type=" + urlParams.get('type') + "&file="+urlParams.get('file')+ "&std=" + std,
  success: function(data) {
    $('#outputtail').html(data);
  }
});


