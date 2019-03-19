const APPLICATION_NAME_ROW = "#application_name_input_row";
const PROJECT_ROW = "#project_select_row";
const ENVIRONMENT_ROW = "#environment_select_row";
const SERVICES_PANEL = "#services_panel";
const SECTION_PANEL = ".section_panel";
const CACHING_SERVICE_PANEL = "#caching_service_panel";
const DATABASE_PANEL = "#database_panel";
const APP_VARIABLES_PANEL = "#app_variables_panel";
const OTHER_VARIABLES_PANEL = "#other_variables_panel";
const SUBMIT_PANEL = "#submit_panel";
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
 * Just check if project/env/appname already exists in cmdb push branch or not
 */
function authorizeApplication(project, environment, appname) {
	authorized = false;
	$.ajax({
		method: 'GET',
		url: 'http://localhost:5000/api/v1.0/push/exists/project/' + project + '/environment/' + environment + '/app/' + appname,
		dataType: 'json',
		crossdomain: true,
		async: false
	}).done(function(data) {
		authorized = !data.exists;
		if (!authorized) {
			alert("An application called " + appname + " already exists in " + project + "/" + environment + ".");
		}
	}).fail(function() {
		alert("Couldn't reach the server.")
	});

	return authorized;
}


/**
 * Prepare the array of the service panel
 */
function prepareServicesList(services) {
	tbody_left 	= "";
	tbody_right = "";
	for (let i = 0; i < services.length; i++) {
		service = services[i];
		$.ajax({
			method: 'GET',
			url: 'http://localhost:5000/api/v1.0/model/app/project/' + project + '/environment/' + environment + '/section/service/service/' + service + '/tags',
			dataType: 'json',
			crossdomain: true,
			async: false
		}).done(function(data) {
			tbody = "<tr><td>" + service + "</td>";
			tbody += "<td><select class='form-control' name='" + service + "'>";
			tbody += "<option value=''>Not selected</option>";
			tbody += jsonToOptions(data);
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
function prepareVariableList(variables) {
	keys = sortObjectKeys(variables);

	tbody_left 	= "";
	tbody_right = "";

	for (let i = 0; i < keys.length; i++) {
		variable = keys[i];
		tbody =	"<tr><td class='col-sm-10'>" + variable + "</td>";
		tbody += "<td class='col-sm-2'><input type='checkbox' value='" + variable + "' class='form-control variable_input custom_checkbox pull-left' /></td>";
		tbody += "</tr>";
		if (i % 2 == 0) tbody_left += tbody;
		else tbody_right += tbody;
	}
	return {'left': tbody_left, 'right': tbody_right};
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
		});

	})


	/**
	 *	When filling application name
	 */
	$(APPLICATION_NAME_ROW + ' input').keypress(function(e) {
		if (e.which == 13) {
			if ($(this).val().length < 3) {
				alert('Application name must have at least 3 characters. ');
			}
			else {
				$(PROJECT_ROW).show();
			}
		}
	});


	/**
	 *	When choosing a project
	 */
	$(PROJECT_ROW + " select").on('change', function() {
		$(SECTION_PANEL).hide();
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
		appname = $(APPLICATION_NAME_ROW + ' input').val();
		project = $(PROJECT_ROW + " select").val();
		environment = $(this).val();
		authorized = authorizeApplication(project, environment, appname);

		if (authorized) {
			$.ajax({
				method: 'GET',
				url: 'http://localhost:5000/api/v1.0/model/app/project/' + project + '/environment/' + environment + '/section/service/services',
				dataType: 'json',
				crossdomain: true,
				async: false
			}).done(function(data) {
				services_rows = prepareServicesList(data);
				$(SERVICES_PANEL + ' table.table_left tbody').html(services_rows.left);
				$(SERVICES_PANEL + ' table.table_right tbody').html(services_rows.right);
			});

			$.ajax({
				method: 'GET',
				url: 'http://localhost:5000/api/v1.0/model/app/project/' + project + '/environment/' + environment + '/section/app',
				dataType: 'json',
				crossdomain: true,
				async: false
			}).done(function(data) {
				app_rows = prepareVariableList(data.app);
				$(APP_VARIABLES_PANEL + ' table.table_left tbody').html(app_rows.left);
				$(APP_VARIABLES_PANEL + ' table.table_right tbody').html(app_rows.right);
			});

			$.ajax({
				method: 'GET',
				url: 'http://localhost:5000/api/v1.0/model/app/project/' + project + '/environment/' + environment + '/section/other',
				dataType: 'json',
				crossdomain: true,
				async: false
			}).done(function(data) {
				app_rows = prepareVariableList(data.other);
				$(OTHER_VARIABLES_PANEL + ' table.table_left tbody').html(app_rows.left);
				$(OTHER_VARIABLES_PANEL + ' table.table_right tbody').html(app_rows.right);
			});


			$(SECTION_PANEL).show();
		}
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
	 *	When submitting
	 */
	$(SUBMIT_PANEL + ' button').on("click", function() {
		appname = $(APPLICATION_NAME_ROW + ' input').val();
		project = $(PROJECT_ROW + " select").val();
		environment = $(ENVIRONMENT_ROW + " select").val();

		authorized = authorizeApplication(project, environment, appname);
		if (authorized) {

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
			})

			cachingServices = []
			$.each($('.caching_service_input'), function() {
				csName = $(this).val();
				if (csName) cachingServices.push(csName);
			})

			data = JSON.stringify({
				name: appname,
				project: project,
				environment: environment,
				services: services,
				databases: databases,
				cachingServices: cachingServices,
				applicationVariables: applicationVariables,
				otherVariables: otherVariables
			});

			console.log(data);

			$.ajax({
				method: 'POST',
				url: 'http://localhost:5000/api/v1.0/push/create',
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
