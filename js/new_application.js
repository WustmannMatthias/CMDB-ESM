const APPLICATION_NAME_ROW = "application_name_input_row";
const PROJECT_ROW = "project_select_row";
const ENVIRONMENT_ROW = "environment_select_row";
const SERVICES_PANEL = "services_panel";


function json_to_options(json) {
	options = "";
	for (let i = 0; i < json.length; i++) {
		option = json[i];
		options += "<option value='" + option + "'>" + option + "</option>";
	}
	return options;
}

function prepare_service_panel(json) {
	tbody = "";
	for (let i = 0; i < json.length; i++) {
		service = json[i];
		$.ajax({
			method: 'GET',
			url: 'http://localhost:5000/api/v1.0/model/app/project/' + project + '/environment/' + environment + '/section/client/service/' + service + '/tags',
			dataType: 'json',
			crossdomain: true,
			async: false
		}).done(function(data) {
			tbody += "<tr><td>" + service + "</td>";
			tbody += "<td><select class='form-control' name='" + service + "'>";
			tbody += "<option value=''>Not selected</option>";
			tbody += json_to_options(data);
			tbody += "</select>";
			tbody += "</tr>";
		});
	}
	return tbody;
}


$(function() {
	// On page loading : prepare projects list
	$(window).load(function() {
		$.ajax({
			method: 'GET',
			url: 'http://localhost:5000/api/v1.0/model/app/projects',
			dataType: 'json',
			crossdomain: true, 
			async: false
		}).done(function(data) {
			$('#' + PROJECT_ROW + ' select').html(json_to_options(data));
		});
		
	})
	

	/**
	 *	When filling application name
	 */
	$('#' + APPLICATION_NAME_ROW + ' input').keypress(function(e) {
		if (e.which == 13) {
			if ($(this).val().length < 3) {
				alert('Application name must have at least 3 characters. ');
			}
			else {
				$('#' + PROJECT_ROW).show();
			}
		}
	});


	/**
	 *	When choosing a project
	 */
	$('#' + PROJECT_ROW + " select").on('change blur', function() {
		val = $(this).val();
		$.ajax({
			method: 'GET',
			url: 'http://localhost:5000/api/v1.0/model/app/project/' + val + '/environments',
			dataType: 'json',
			crossdomain: true, 
			async: false
		}).done(function(data) {
			$('.section_panel').hide();
			$('#' + ENVIRONMENT_ROW + ' select').html(json_to_options(data));
			$('#' + ENVIRONMENT_ROW).show();
		});
	});


	/**
	 *	When choosing an environment
	 */
	$('#' + ENVIRONMENT_ROW + " select").on('change blur', function() {
		project = $('#' + PROJECT_ROW + " select").val();
		environment = $(this).val();

		$.ajax({
			method: 'GET',
			url: 'http://localhost:5000/api/v1.0/model/app/project/' + project + '/environment/' + environment + '/section/client/services',
			dataType: 'json',
			crossdomain: true
		}).done(function(data) {
			$('#' + SERVICES_PANEL + ' table tbody').html(prepare_service_panel(data));
			$('#' + SERVICES_PANEL).show();
		});
	});



});