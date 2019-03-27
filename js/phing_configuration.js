const PROJECT_ROW = "#project_select_row";
const ENVIRONMENT_ROW = "#environment_select_row";
const APPLICATION_ROW = "#application_select_row";
const INSTANCE_ROW = "#instance_select_row";
const SERVICES_PANEL = "#services_panel";
const SECTION_PANEL = ".section_panel";
const INSTANCE_NAME_PANEL = "#instance_name_panel";
const CACHING_SERVICE_PANEL = "#caching_service_panel";
const DATABASE_PANEL = "#database_panel";
const APP_VARIABLES_PANEL = "#app_variables_panel";
const OTHER_VARIABLES_PANEL = "#other_variables_panel";
const RESPONSE_PANEL = "#response_panel";
const NEW_VARIABLE_BUTTONS = ".new_variable_button";
const NEW_INSTANCE_VALUE = "new_configuration_instance";
const SUBMIT_PANEL = ".submit_panel";
const NEW_INSTANCE_SUBMIT_PANEL = "#new_submit_panel";
const EXISTING_INSTANCE_SUBMIT_PANEL = "#existing_submit_panel";
const SUBMIT_BUTTON = '.submit_button';
const DELETE_BUTTON = "#delete_button";
const DOWNLOAD_BUTTON = "#download_button";
const EDIT_BUTTON = "#edit_button";
const CREATE_BUTTON = "#create_button";



/*************************************************************
 ******************* PREPARATION FUNCTIONS *******************
 *************************************************************/

/**
 * Convert a json list into a <option/> tags
 */
function jsonToOptions(json, selected) {
	options = "";
	for (let i = 0; i < json.length; i++) {
		option = json[i];
		if (selected && option == selected) {
			options += "<option selected='selected' value='" + option + "'>" + option + "</option>";
		}
		else {
			options += "<option value='" + option + "'>" + option + "</option>";
		}
	}
	return options;
}

/**
 * Get sorted keys list of an object
 */
function sortObjectKeys(obj) {
	output = [];
	for (k in obj) {
		if (obj.hasOwnProperty(k)) {
			output.push(k);
		}
	}
	return output.sort();
}

/**
 * Just check if project/env/application already exists in cmdb push branch or not
 */
function authorizeInstance(project, environment, application, instance) {
	authorized = false;
	$.ajax({
		method: 'GET',
		url: 'http://localhost:5000/api/v1.0/push/app/project/' + project + '/environment/' + environment + '/application/' + application + '/instances',
		dataType: 'json',
		crossdomain: true,
		async: false
	}).done(function(data) { // list of instances
		if (!data.includes(instance)) {
			authorized = true;
		};
	}).fail(function() {
		alert("Couldn't reach the server.")
	});

	return authorized;
}


/**
 * Prepare the array of the service panel
 */
function prepareServicesList(services, used_services) {
	tbody_left 	= "";
	tbody_right = "";
	for (let i = 0; i < services.length; i++) {
		selected = undefined;
		service = services[i];
		$.ajax({
			method: 'GET',
			url: 'http://localhost:5000/api/v1.0/model/app/project/' + project + '/environment/' + environment + '/section/client/service/' + service + '/tags',
			dataType: 'json',
			crossdomain: true,
			async: false
		}).done(function(data) {
			if (used_services.hasOwnProperty(service)) {
				selected = used_services[service];
			}
			tbody = "<tr><td>" + service + "</td>";
			tbody += "<td><select class='form-control' name='" + service + "'>";
			tbody += "<option value=''>Not selected</option>";
			tbody += jsonToOptions(data, selected);
			tbody += "</select></td>";
			tbody += "</tr>";

			if (i % 2 == 0) tbody_left += tbody;
			else tbody_right += tbody;
		});

	}
	return {'left': tbody_left, 'right': tbody_right};
}


/**
 * Prepare a list of variables/checkbox
 */
function prepareVariableList(variables, checked, section) {
	console.log(variables);
	console.log(checked);
	keys = sortObjectKeys(variables);

	tbody_left 	= "";
	tbody_right = "";

	for (let i = 0; i < keys.length; i++) {
		variable = keys[i];
		tbody =	"<tr><td class='col-sm-10'>" + variable + "</td>";
		tbody += "<td class='col-sm-2'>";
		if (checked.hasOwnProperty(variable)) {
			tbody += "<input type='checkbox' checked='checked' value='" + variable + "' class='form-control variable_input custom_checkbox pull-left' />"
		}
		else {
			tbody += "<input type='checkbox' value='" + variable + "' class='form-control variable_input custom_checkbox pull-left' />"
		}
		tbody += "</td>";
		tbody += "</tr>";
		if (i % 2 == 0) tbody_left += tbody;
		else tbody_right += tbody;
	}

	sectionModal = "#" + section + "_new_variable_modal";
	buttonHtml = "<tr><td colspan=2 class='col-sm-12'><button data-target='" + sectionModal + "' data-toggle='modal' class='btn btn-info pull-right new_variable_button' data-section='" + section + "'>New variable...</button></td></tr>";
	tbody_right += buttonHtml;

	return {'left': tbody_left, 'right': tbody_right};
}


/**
 * 	Functions to load the SECTION_PANELs
 *	@param mode should be either 'new' or 'edit'.
 *	-> new : prepare the panels to create a new configuration
 * 	-> edit : just edit an existing configuration. The panels have to display that existing configuration
 */
function loadServicesPanel(project, environment, application, instance, mode) {
	service_list = new Array();
	used_services = {};

	$.ajax({
		method: 'GET',
		url: 'http://localhost:5000/api/v1.0/model/app/project/' + project + '/environment/' + environment + '/section/client/services',
		dataType: 'json',
		crossdomain: true,
		async: false
	}).done(function(data) {
		service_list = data;
	}).fail(function() {
		alert('Couldn\'t load services from Model');
		return;
	});

	if (mode == 'edit') {
		$.ajax({
			method: 'GET',
			url: 'http://localhost:5000/api/v1.0/push/app/project/' + project + '/environment/' + environment + '/application/' + application + '/instance/' + instance + '/services',
			dataType: 'json',
			crossdomain: true,
			async: false
		}).done(function(data) {
			used_services = data;
		}).fail(function() {
			alert('Couldn\'t load client configuration from Push');
			return;
		});
	}

	services_rows = prepareServicesList(service_list, used_services);
	$(SERVICES_PANEL + ' table.table_left tbody').html(services_rows.left);
	$(SERVICES_PANEL + ' table.table_right tbody').html(services_rows.right);
}

function loadAppPanel(project, environment, application, instance, mode) {
	variables = {};
	used_variables = new Array();
	$.ajax({
		method: 'GET',
		url: 'http://localhost:5000/api/v1.0/model/app/project/' + project + '/environment/' + environment + '/section/app',
		dataType: 'json',
		crossdomain: true,
		async: false
	}).done(function(data) {
		variables = data;
	}).fail(function() {
		alert('Couldn\'t load app variables from Model');
	});

	if (mode == 'edit') {
		$.ajax({
			method: 'GET',
			url: 'http://localhost:5000/api/v1.0/push/app/project/' + project + '/environment/' + environment + '/application/' + application + '/instance/' + instance + '/section/app',
			dataType: 'json',
			crossdomain: true,
			async: false
		}).done(function(data) {
			used_variables = data.app;
		}).fail(function() {
			alert('Couldn\'t app configuration from Push');
		});
	}
	app_rows = prepareVariableList(variables, used_variables, 'app');
	$(APP_VARIABLES_PANEL + ' table.table_left tbody').html(app_rows.left);
	$(APP_VARIABLES_PANEL + ' table.table_right tbody').html(app_rows.right);
}

function loadOtherPanel(project, environment, application, instance, mode) {
	variables = {};
	used_variables = new Array();
	$.ajax({
		method: 'GET',
		url: 'http://localhost:5000/api/v1.0/model/app/project/' + project + '/environment/' + environment + '/section/other',
		dataType: 'json',
		crossdomain: true,
		async: false
	}).done(function(data) {
		variables = data;
	}).fail(function() {
		alert('Couldn\'t load other variables from Model');
	});

	if (mode == 'edit') {
		$.ajax({
			method: 'GET',
			url: 'http://localhost:5000/api/v1.0/push/app/project/' + project + '/environment/' + environment + '/application/' + application + '/instance/' + instance + '/section/other',
			dataType: 'json',
			crossdomain: true,
			async: false
		}).done(function(data) {
			used_variables = data.other;
		}).fail(function() {
			alert('Couldn\'t other configuration from Push');
		});
	}
	other_rows = prepareVariableList(variables, used_variables, 'other');
	$(OTHER_VARIABLES_PANEL + ' table.table_left tbody').html(other_rows.left);
	$(OTHER_VARIABLES_PANEL + ' table.table_right tbody').html(other_rows.right);
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
		$(INSTANCE_NAME_PANEL).hide();
		$(SECTION_PANEL).hide();
		$(SUBMIT_PANEL).hide();
		$(RESPONSE_PANEL).hide();

		project = $(this).val();
		if (!project) {
			return;
		}
		$.ajax({
			method: 'GET',
			url: 'http://localhost:5000/api/v1.0/model/app/project/' + project + '/environments',
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
		$(INSTANCE_NAME_PANEL).hide();
		$(SECTION_PANEL).hide();
		$(SUBMIT_PANEL).hide();
		$(RESPONSE_PANEL).hide();

		environment = $(this).val();
		if (!environment) {
			return;
		}
		project	= $(PROJECT_ROW + " select").val();
		$.ajax({
			method: 'GET',
			url: 'http://localhost:5000/api/v1.0/push/project/' + project + '/environment/' + environment + '/applications',
			dataType: 'json',
			crossdomain: true,
			async: false
		}).done(function(data) {
			$(APPLICATION_ROW + ' select').html("<option value=''></option>");
			$(APPLICATION_ROW + ' select').append(jsonToOptions(data));
			$(APPLICATION_ROW).show();
		});
	});


	/**
	 *	When choosing application name
	 */
	$(APPLICATION_ROW + ' select').on('change', function() {
		$(INSTANCE_ROW).hide();
		$(INSTANCE_NAME_PANEL).hide();
		$(SECTION_PANEL).hide();
		$(SUBMIT_PANEL).hide();
		$(RESPONSE_PANEL).hide();

		application = $(this).val();
		if (!application) {
			return;
		}

		project	 	= $(PROJECT_ROW + " select").val();
		environment	= $(ENVIRONMENT_ROW + " select").val();
		$.ajax({
			method: 'GET',
			url: 'http://localhost:5000/api/v1.0/push/app/project/' + project + '/environment/' + environment + '/application/' + application + '/instances',
			dataType: 'json',
			crossdomain: true,
			async: false
		}).done(function(data) {
			$(INSTANCE_ROW + ' select').html("<option value=''></option>");
			$(INSTANCE_ROW + ' select').append("<option value='" + NEW_INSTANCE_VALUE + "'>New configuration instance...</option>");
			$(INSTANCE_ROW + ' select').append(jsonToOptions(data));
			$(INSTANCE_ROW).show();
		});
	});


	/**
	 * When choosing an instance
	 */
	$(INSTANCE_ROW + ' select').on('change', function() {
		$(SECTION_PANEL).hide();
		$(SUBMIT_PANEL).hide();
		$(RESPONSE_PANEL).hide();

		instance = $(this).val();
		if (!instance) {
			return;
		}

		project	 	= $(PROJECT_ROW + " select").val();
		environment	= $(ENVIRONMENT_ROW + " select").val();
		application = $(APPLICATION_ROW + " select").val();

		if (instance == NEW_INSTANCE_VALUE) {
			loadServicesPanel(project, environment, application, instance, 'new');
			loadAppPanel(project, environment, application, instance, 'new');
			loadOtherPanel(project, environment, application, instance, 'new');
			$(INSTANCE_NAME_PANEL).show();
			$(SECTION_PANEL).show();
			$(NEW_INSTANCE_SUBMIT_PANEL).show();
		}
		else {
			loadServicesPanel(project, environment, application, instance, 'edit');
			loadAppPanel(project, environment, application, instance, 'edit');
			loadOtherPanel(project, environment, application, instance, 'edit');
			$(INSTANCE_NAME_PANEL).hide();
			$(SECTION_PANEL).show();
			$(EXISTING_INSTANCE_SUBMIT_PANEL).show();
		}
	});


	/**
	 *	When submitting
	 */
	$(SUBMIT_BUTTON).on("click", function() {
		project = $(PROJECT_ROW + " select").val();
		environment = $(ENVIRONMENT_ROW + " select").val();
		application = $(APPLICATION_ROW + " select").val();
		instanceName = "";

		clicked_button = '#' + $(this).attr('id');
		if (clicked_button == CREATE_BUTTON) {
			instanceName = $(INSTANCE_NAME_PANEL + ' input').val();
			authorized = authorizeInstance(project, environment, application, instanceName);
			if (!authorized) {
				alert("Instance " + instanceName + " already exists in database.")
				return;
			}
		}
		else if (clicked_button == EDIT_BUTTON) {
			instanceName = $(INSTANCE_ROW + ' select').val();
		}

		applicationVariables = [];
		$.each($(APP_VARIABLES_PANEL + ' input[type=checkbox]:checked'), function() {
			applicationVariables.push($(this).val());
		});

		otherVariables = [];
		$.each($(OTHER_VARIABLES_PANEL + ' input[type=checkbox]:checked'), function() {
			otherVariables.push($(this).val());
		});

		services = {};
		$.each($(SERVICES_PANEL + ' select'), function() {
			service = $(this).attr('name');
			tag = $(this).val();
			if (tag) services[service] = tag;
		});

		databases = []
		$.each($('.database_input'), function() {
			dbName = $(this).val();
			if (dbName) databases.push(dbName);
		});

		cachingServices = []
		$.each($('.caching_service_input'), function() {
			csName = $(this).val();
			if (csName) cachingServices.push(csName);
		});


		if (clicked_button == EDIT_BUTTON) {
			$.ajax({
				method: 'DELETE',
				url: 'http://localhost:5000/api/v1.0/push/app/project/' + project + '/environment/' + environment + '/application/' + application + '/instance/' + instanceName,
				contentType: 'application/json; charset=utf-8',
				crossdomain: true,
				async: false
			}).done(function(response) {
				console.log(response);
			});
		}

		data = JSON.stringify({
			instance: instanceName,
			client: services,
			database: databases,
			caching_service: cachingServices,
			app: applicationVariables,
			other: otherVariables
		});
		console.log(data);

		$.ajax({
			method: 'POST',
			url: 'http://localhost:5000/api/v1.0/push/app/project/' + project + '/environment/' + environment + '/application/' + application + '/instances',
			data: data,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			crossdomain: true,
			async: false
		}).done(function(response) {
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
		});
	});




	/**
	 *	Delete button press
	 */
	$(DELETE_BUTTON).on("click", function() {
		project = $(PROJECT_ROW + " select").val();
		environment = $(ENVIRONMENT_ROW + " select").val();
		application = $(APPLICATION_ROW + " select").val();
		instanceName = $(INSTANCE_ROW + " select").val();

		$.ajax({
			method: 'DELETE',
			url: 'http://localhost:5000/api/v1.0/push/app/project/' + project + '/environment/' + environment + '/application/' + application + '/instance/' + instanceName,
			contentType: 'application/json; charset=utf-8',
			crossdomain: true,
			async: false
		}).done(function(response) {
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
		});
	});


	$(DOWNLOAD_BUTTON).on("click", function() {
		project = $(PROJECT_ROW + " select").val();
		environment = $(ENVIRONMENT_ROW + " select").val();
		application = $(APPLICATION_ROW + " select").val();
		instanceName = $(INSTANCE_ROW + " select").val();

		window.location = "http://localhost:5000/api/v1.0/push/app/project/" + project + "/environment/" + environment + "/application/" + application + "/instance/" + instanceName + "/format/ini";
	});
















	/**
	 * Propose db names when changing the wished number
	 */
	$(DATABASE_PANEL + ' input[name=databases_nb]').on("change", function() {
		nb = $(this).val();
		tbody = "";
		for (let i = 0; i < nb; i++) {
			tbody += "<tr>";
			tbody += "<td>Database </td>";
			tbody += "<td><input class='form-control database_input' type='text' name='db" + i  +"' /></td>";
			tbody += "</tr>";
		}
		$(DATABASE_PANEL + ' .variable_tbody').html(tbody);
	});

	$(CACHING_SERVICE_PANEL + ' input[name=caching_services_nb]').on("change", function() {
		nb = $(this).val();
		tbody = "";
		for (let i = 0; i < nb; i++) {
			tbody += "<tr>";
			tbody += "<td>Caching service </td>";
			tbody += "<td><input class='form-control caching_service_input' type='text' name='cs" + i  +"' /></td>";
			tbody += "</tr>";
		}
		$(CACHING_SERVICE_PANEL + ' .variable_tbody').html(tbody);
	});




	/**
	 * When submitting modal for new variable registration
	 */
	$(".variable_registration_submit").on('click', function() {
		section = $(this).data('section');

		variableName 	= $(".variable_registration_modal[data-section=" + section + "] .variable_name_input").val();
		variableValue	= $(".variable_registration_modal[data-section=" + section + "] .variable_value_input").val();

		if (!variableName) {
			alert("Variable name is required.");
			return;
		}

		project = $(PROJECT_ROW + " select").val();
		environment = $(ENVIRONMENT_ROW + " select").val();

		data = {};
		data[variableName] = variableValue;
		data = JSON.stringify(data);

		console.log(data);
		$.ajax({
			method: 'POST',
			url: 'http://localhost:5000/api/v1.0/model/app/project/' + project + '/environment/' + environment + '/section/' + section,
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
			$(".variable_registration_modal[data-section=" + section + "] .feedback").html(html);

			if (section == 'app') loadAppPanel(project, environment);
			else if (section == 'other') loadOtherPanel(project, environment);
			else alert(section);
		});
	});



});
