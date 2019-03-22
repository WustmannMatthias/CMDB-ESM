const APPLICATION_NAME_ROW = "#application_name_input_row";
const PROJECT_ROW = "#project_select_row";
const ENVIRONMENT_ROW = "#environment_select_row";
const SUBMIT_ROW = "#submit_name_row"
const INFO_ROW = "#info_row"
const RESPONSE_PANEL = "#response_panel";


/*************************************************************
 ******************* PREPARATION FUNCTIONS *******************
 *************************************************************/

/**
 * Convert a json list into a <option/> tags
 */
function jsonToOptions(json) {
	options = "";
	for (let i = 0; i < json.length; i++) {
		option = json[i];
		options += "<option value='" + option + "'>" + option + "</option>";
	}
	return options;
}


/**
 * Just check if project/env/appname already exists in cmdb push branch or not
 */
function authorizeApplication(project, environment, appname) {
	authorized = false;
	$.ajax({
		method: 'GET',
		url: 'http://localhost:5000/api/v1.0/push/exists/project/' + project + '/environment/' + environment + '/application/' + appname,
		dataType: 'json',
		crossdomain: true,
		async: false
	}).done(function(data) {
		authorized = !data.exists;
	}).fail(function() {
		alert("Couldn't reach the server to check if application already exists or not.")
	});

	return authorized;
}




/**
 * SCRIPT BEGIN
 */
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
			$(PROJECT_ROW + ' select').html(jsonToOptions(data));
			$(PROJECT_ROW).show();
		});

	})


	/**
	 *	When choosing a project
	 */
	$(PROJECT_ROW + " select").on('change', function() {
		val = $(this).val();
		$.ajax({
			method: 'GET',
			url: 'http://localhost:5000/api/v1.0/model/app/project/' + val + '/environments',
			dataType: 'json',
			crossdomain: true,
			async: false
		}).done(function(data) {
			$(ENVIRONMENT_ROW + ' select').html(jsonToOptions(data));
			$(ENVIRONMENT_ROW).show();
		});
	});



	/**
	 *	When choosing an environment
	 */
	$(ENVIRONMENT_ROW + " select").on('change', function() {
		$(APPLICATION_NAME_ROW).show();
		$(SUBMIT_ROW).show();
		$(INFO_ROW).show();

	});


	/**
	 *	When filling application name
	 */
	$(APPLICATION_NAME_ROW + ' input').keypress(function(e) {
		if (e.which == 13) {
			if ($(this).val().length < 3) {
				alert('Application name must have at least 3 characters. ');
			}
			else {
				$(RESPONSE_PANEL).show();
			}
		}
	});


	/**
	 *	When submitting
	 */
	$(SUBMIT_ROW + ' button').on("click", function() {
		application = $(APPLICATION_NAME_ROW + ' input').val();
		project = $(PROJECT_ROW + " select").val();
		environment = $(ENVIRONMENT_ROW + " select").val();

		authorized = authorizeApplication(project, environment, application);

		if (!authorized) {
			alert("An application called " + application + " already exists in " + project + "/" + environment + ".");
		}
		else {

			data = JSON.stringify({
				application: application,
				project: project,
				environment: environment,
			});

			console.log(data);

			$.ajax({
				method: 'POST',
				url: 'http://localhost:5000/api/v1.0/push',
				data: data,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				crossdomain: true,
				async: false
			}).done(function(response) {
				if ('success' in response) {
					msg = response.success;
					centerClass = 'text-success';
				}
				else if ('error' in response) {
					msg = response.error;
					centerClass = 'text-danger';
				}
				else {
					console.log(response);
					msg = "Return status was neither a success or an  error. Object was displayed in js console.";
					centerClass = 'text-warning';
				}
				html = "<center class='" + centerClass + "'>" + msg + "</center>";
				$(RESPONSE_PANEL + ' .panel-body').html(html);
				$(RESPONSE_PANEL).show();
			});
		}
	});
});
