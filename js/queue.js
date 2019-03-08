function check_queue_server () {
	console.log("todo");
}

function save_bs_config() {
	$.ajax({
                type: "POST",
                url: "/ajaxbeanstalksetup",
                dataType: "json",
		data: { "BEANSTALKD_EXTRA": $("#bsconfig").val() },
                success: function(data) {
			console.log("done");
                }
        });
}

function Job(id, data) {
	this.id = id;
	this.data = data;
}
function clearTubeList() {
	$('#template-tube-model').hide();
	$(".tube-list").empty();
}

function getBeanstalkConfig () {
	$.ajax({
                type: "GET",
                url: "/ajaxbeanstalksetup",
		dataType: "json",
                success: function(data) {
			$("#bsconfig").val(data.BEANSTALKD_EXTRA);
                }
        });
}

function addTube(name, jobReady, jobBuried) {
	var tube = $(".tube-model").clone().removeClass("tube-model").addClass("tube");
	tube.find(".tube-name").text(name);
	if (jobReady !== null) {
		tube.find(".job-ready .job-id").text(jobReady.id);
		tube.find(".job-ready .job-data").text(JSON.stringify(jobReady.data));
		tube.find(".job-ready-none").hide();
		tube.find(".job-ready .btn-warning").data("job-id", jobReady.id);
		tube.find(".job-ready .btn-warning").data("tube", name);
		tube.find(".job-ready .btn-danger").data("job-id", jobReady.id);
		tube.find(".job-ready .btn-danger").data("tube", name);
		tube.find(".job-ready").show();
		tube.find(".job-ready .btn").removeAttr('disabled');
	}
	if (jobBuried !== null) {
		tube.find(".job-buried .job-id").text(jobBuried.id);
		tube.find(".job-buried .job-data").text(JSON.stringify(jobBuried.data));
		tube.find(".job-buried-none").hide();
		tube.find(".job-buried .kick-jobs").data("tube", name);
		tube.find(".job-buried").show();
		tube.find(".job-buried .btn").removeAttr('disabled');
	}
	$(".tube-list").append(tube);
	tube.show();
}
function refreshList() {
	$("#errorMessage").fadeOut();
	var server = $("#server").val();
	var port = $("#port").val();
	$.ajax({
		type: "POST",
		url: "/ajaxqueue?action=list_all",
		dataType: "json",
		data: { server: server, port: port },
		success: function(data) {
			clearTubeList();
			for (var tube in data){
				var jobs = data[tube];
				var jobReady = null;
				var jobBuried = null;
				for (var i = 0; i < jobs.length; i++) {
					var job = new Job(jobs[i]["id"], jobs[i]["data"]);
					switch(jobs[i]["status"]) {
						case "ready":
							jobReady = job;
							break;
						case "buried":
							jobBuried = job;
							break;
					}
				}
				addTube(tube, jobReady, jobBuried);
			}
		},
		error: function(xhr) {
			$("#jobList tbody").empty();
			$("#errorMessage .content").text(jQuery.parseJSON(xhr.responseText));
			$("#errorMessage .content").text(xhr.responseText);
			$("#errorMessage").fadeIn();
		}
	});
}
function deleteJob(button) {
	var server = $("#server").val();
	var port = $("#port").val();
	var jobId = $(button).data("job-id");
	var tube = $(button).data("tube");
	$.ajax({
		type: "POST",
		url: "/ajaxqueue?action=deletejob",
		data: { server: server, port: port, tube: tube, id: jobId },
		success: function(data) {
			getBeanstalk();
			refreshList();
		}
	});
}
function buryJob(button) {
	var server = $("#server").val();
	var port = $("#port").val();
	var jobId = $(button).data("job-id");
	var tube = $(button).data("tube");
	$.ajax({
		type: "POST",
		url: "/ajaxqueue?action=bury",
		dataType: "json",
		data: { server: server, port: port, tube: tube, id: jobId },
		success: function(data) {
			getBeanstalk();
			refreshList();
		},
		error: function(xhr) {
			messageBox(jQuery.parseJSON(xhr.responseText));
		}
	});
}
function kickJobs(button) {
	var server = $("#parameters #server").val();
	var tube = $(button).data("tube");
	$.ajax({
		type: "POST",
		url: "/ajaxqueue?action=kick",
		dataType: "json",
		data: { server: server, tube: tube },
		success: function(data) {
			getBeanstalk();
			refreshList();
		},
		error: function(xhr) {
			messageBox(jQuery.parseJSON(xhr.responseText));
		}
	});
}
$(function() {
	refreshList();
	var intervalId;
	$("#refresh-select").change(function(e) {
		e.preventDefault();
		refreshList();
		clearInterval(intervalId);
		if ($('#refresh-select').val() == 0) return;
		intervalId = setInterval(refreshList, $('#refresh-select').val() * 1000);
	});
	$("#addJobSubmit").click(function(e) {
		e.preventDefault();
		var server = $("#server").val();
		var port = $("#port").val();
		var data = $("#addJobData").val();
		var tube = $("#addJobTube").val();
		$.ajax({
			type: "POST",
			url: "/ajaxqueue?action=addjob",
			data: { server: server, port: port, data: data, tube: tube },
			success: function(data) {
				$("#addJobData").val("test");
				getBeanstalk();
				refreshList();
			}
		});
	});
});

function getBeanstalk(server) {
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
		}
	}, 'json');
}

getBeanstalkConfig();
getBeanstalk();
