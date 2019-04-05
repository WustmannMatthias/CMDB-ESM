const APPLICATION_NAME_ROW = "#application_input_row";
const PROJECT_ROW = "#project_select_row";
const ENVIRONMENT_ROW = "#environment_select_row";
const APPLICATION_ROW = "#application_select_row";
const INSTANCE_ROW = "#instance_select_row";
const INSTANCE_NAME_ROW = "#instance_input_row";
const SUBMIT_ROW = ".submit_row";
const INFO_ROW = ".info_row";
const NAME_ROW = ".name_row";
const MANAGE_ROW = '.manage_row';
const RESPONSE_PANEL = "#response_panel";
const NEW_APPLICATION_VALUE = 'new_application';
const NEW_INSTANCE_VALUE = 'new_instance';
const APPLICATION_INFO_ROW = '#application_info_row';
const INSTANCE_INFO_ROW = "#instance_info_row";
const APPLICATION_SUBMIT_ROW = "#application_submit_row";
const INSTANCE_SUBMIT_ROW = "#instance_submit_row";
const INSTANCE_MANAGE_ROW = "#instance_manage_row";
const APPLICATION_BUTTON_IDENTIFIER = "application_submit_button";
const INSTANCE_BUTTON_IDENTIFIER = "instance_submit_button";

const INSTANCE_PANEL = "#instance_panel";
const INSTANCE_CHANGE_NAME_ROW = "#instance_name_row";
const DELETE_BUTTON_IDENTIFIER = "delete_button";
const RENAME_BUTTON_IDENTIFIER = "rename_button";
const CLONE_BUTTON_IDENTIFIER = "clone_button";


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



function display_response(response) {
	console.log(response);
	if ('success' in response) {
		msg = response.success;
		centerClass = 'text-success';
	}
	else if ('error' in response) {
		msg = response.error;
		centerClass = 'text-danger';
	}
	else {
		msg = "Return status was neither a success or an  error. Object was displayed in js console.";
		centerClass = 'text-warning';
	}
	html = "<center class='" + centerClass + "'>" + msg + "</center>";
	$(RESPONSE_PANEL + ' .panel-body').html(html);
	$(RESPONSE_PANEL).show();
}




/**
 * SCRIPT BEGIN
 */
$(function() {
	// On page loading : prepare projects list
	$(window).load(function() {
		$.ajax({
			method: 'GET',
			url: 'http://10.8.1.72:5000/api/v1.0/model/projects',
			dataType: 'json',
			crossdomain: true,
			async: false
		}).done(function(data) {
			$(PROJECT_ROW + ' select').html("<option value=''></option>");
			$(PROJECT_ROW + ' select').append(jsonToOptions(data));
			$(PROJECT_ROW).show();
		});

	})


	/**
	 *	When choosing a project
	 */
	 $(PROJECT_ROW + " select").on('change', function() {
 		$(ENVIRONMENT_ROW).hide();
 		$(APPLICATION_ROW).hide();
		$(INSTANCE_ROW).hide();
		$(SUBMIT_ROW).hide();
		$(INFO_ROW).hide();
		$(NAME_ROW).hide();
		$(RESPONSE_PANEL).hide();
		$(INSTANCE_PANEL).hide();
 		project = $(this).val();
 		if (!project) {
 			return;
 		}
 		$.ajax({
 			method: 'GET',
 			url: 'http://10.8.1.72:5000/api/v1.0/model/project/' + project + '/environments',
 			dataType: 'json',
 			crossdomain: true,
 			async: false
 		}).done(function(data) {
 			$(ENVIRONMENT_ROW + ' select').html("<option value=''></option>");
 			$(ENVIRONMENT_ROW + ' select').append(jsonToOptions(data));
 			$(ENVIRONMENT_ROW).show();
 		});
 	});



	/**
	 *	When choosing an environment
	 */
	$(ENVIRONMENT_ROW + " select").on('change', function() {
		$(APPLICATION_ROW).hide();
		$(INSTANCE_ROW).hide();
		$(SUBMIT_ROW).hide();
		$(INFO_ROW).hide();
		$(NAME_ROW).hide();
		$(RESPONSE_PANEL).hide();
		$(INSTANCE_PANEL).hide();

		environment = $(this).val();
		if (!environment) {
			return;
		}

		project	= $(PROJECT_ROW + " select").val();
		$.ajax({
 			method: 'GET',
 			url: 'http://10.8.1.72:5000/api/v1.0/push/project/' + project + '/environment/' + environment + '/applications',
 			dataType: 'json',
 			crossdomain: true,
 			async: false
 		}).done(function(data) {
 			$(APPLICATION_ROW + ' select').html("<option value=''></option>");
			$(APPLICATION_ROW + ' select').append("<option value='" + NEW_APPLICATION_VALUE + "'>New application...</option>");
 			$(APPLICATION_ROW + ' select').append(jsonToOptions(data));
 			$(APPLICATION_ROW).show();
 		});
	});



	/**
	 *	When choosing application
	 */
	$(APPLICATION_ROW + ' select').on('change', function() {
		$(INSTANCE_ROW).hide();
		$(SUBMIT_ROW).hide();
		$(INFO_ROW).hide();
		$(NAME_ROW).hide();
		$(RESPONSE_PANEL).hide();
		$(INSTANCE_PANEL).hide();

		application = $(this).val();
		if (!application) {
			return;
		}

		project	 	= $(PROJECT_ROW + " select").val();
		environment	= $(ENVIRONMENT_ROW + " select").val();

		if (application == NEW_APPLICATION_VALUE) {
			$(APPLICATION_NAME_ROW).show();
			$(APPLICATION_INFO_ROW).show();
			$(APPLICATION_SUBMIT_ROW).show();
		}
		else {
			$.ajax({
				method: 'GET',
				url: 'http://10.8.1.72:5000/api/v1.0/push/project/' + project + '/environment/' + environment + '/application/' + application + '/instances',
				dataType: 'json',
				crossdomain: true,
				async: false
			}).done(function(data) {
				$(INSTANCE_ROW + ' select').html("<option value=''></option>");
				$(INSTANCE_ROW + ' select').append("<option value='" + NEW_INSTANCE_VALUE + "'>New instance...</option>");
				$(INSTANCE_ROW + ' select').append(jsonToOptions(data));
				$(INSTANCE_ROW).show();
			});
		}
	});


	/**
	 *	When choosing application
	 */
	$(INSTANCE_ROW + ' select').on('change', function() {
		$(SUBMIT_ROW).hide();
		$(INFO_ROW).hide();
		$(NAME_ROW).hide();
		$(RESPONSE_PANEL).hide();
		$(INSTANCE_PANEL).hide();

		instance = $(this).val();
		if (!instance) {
			return;
		}

		project	 	= $(PROJECT_ROW + " select").val();
		environment	= $(ENVIRONMENT_ROW + " select").val();
		application	= $(APPLICATION_ROW + " select").val();

		if (instance == NEW_INSTANCE_VALUE) {
			$(INSTANCE_NAME_ROW).show();
			$(INSTANCE_INFO_ROW).show();
			$(INSTANCE_SUBMIT_ROW).show();
		}
		else {
			$(INSTANCE_PANEL + ' ' + INSTANCE_CHANGE_NAME_ROW + ' input').val(instance);
			$(INSTANCE_PANEL).show();
		}
	});




	/**
	 *	When submitting
	 */
	$(SUBMIT_ROW + ' button').on("click", function() {
		project = $(PROJECT_ROW + " select").val();
		environment = $(ENVIRONMENT_ROW + " select").val();
		submit = $(this).data('identifier');

		if (submit == APPLICATION_BUTTON_IDENTIFIER) {
			application = $(APPLICATION_NAME_ROW +' input').val();
			if (application.length < 3) {
				alert('Application name must have at least 3 characters. ');
				return;
			}

			data = JSON.stringify({
				application: application
			});
			console.log(data);
			$.ajax({
				method: 'POST',
				url: 'http://10.8.1.72:5000/api/v1.0/push/project/' + project + '/environment/' + environment + '/applications',
				data: data,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				crossdomain: true,
				async: false
			}).done(display_response);
		}
		else if (submit == INSTANCE_BUTTON_IDENTIFIER) {
			application = $(APPLICATION_ROW + ' select').val();
			instance = $(INSTANCE_NAME_ROW +' input').val();
				data = JSON.stringify({
					instance: instance
				});
			console.log(data);
			$.ajax({
				method: 'POST',
				url: 'http://10.8.1.72:5000/api/v1.0/push/project/' + project + '/environment/' + environment + '/application/' + application + '/instances',
				data: data,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				crossdomain: true,
				async: false
			}).done(display_response);
		}

	});




	/**
	 * When validating something in the instance panel
	 */
	$(INSTANCE_PANEL + ' ' + MANAGE_ROW + ' ' + ' button').on("click", function() {
		project = $(PROJECT_ROW + " select").val();
		environment = $(ENVIRONMENT_ROW + " select").val();
		application = $(APPLICATION_ROW + " select").val();
		instance = $(INSTANCE_ROW + " select").val();

		buttonIdentifier = $(this).data('identifier');

		if (buttonIdentifier == DELETE_BUTTON_IDENTIFIER) {
			$.ajax({
				method: 'DELETE',
				url: 'http://10.8.1.72:5000/api/v1.0/push/project/' + project + '/environment/' + environment + '/application/' + application + '/instance/' + instance,
				contentType: 'application/json; charset=utf-8',
				crossdomain: true,
				async: false
			}).done(display_response);
		}
		else if (buttonIdentifier == RENAME_BUTTON_IDENTIFIER) {
			newInstanceName = $(INSTANCE_CHANGE_NAME_ROW + ' input').val()
			data = JSON.stringify({
				name: newInstanceName
			});
			$.ajax({
				method: 'POST',
				url: 'http://10.8.1.72:5000/api/v1.0/push/project/' + project + '/environment/' + environment + '/application/' + application + '/instance/' + instance,
				data: data,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				crossdomain: true,
				async: false
			}).done(display_response);
		}

	});






});
