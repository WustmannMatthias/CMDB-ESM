const APPLICATION_NAME_ROW = "#application_name_input_row";
const PROJECT_ROW = "#project_select_row";
const ENVIRONMENT_ROW = "#environment_select_row";
const SERVICES_PANEL = "#services_panel";
const SECTION_PANEL = ".section_panel";
const CACHING_SERVICE_PANEL = "#caching_service_panel";
const DATABASE_PANEL = "#database_panel";
const APP_VARIABLES_PANEL = "#app_variables_panel";
const OTHER_VARIABLES_PANEL = "#other_variables_panel";



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
 * Prepare the array of the service panel
 */
function prepareServicesList(services) {
	tbody_left 	= "";
	tbody_right = "";
	for (let i = 0; i < services.length; i++) {
		service = services[i];
		$.ajax({
			method: 'GET',
			url: 'http://localhost:5000/api/v1.0/model/app/project/' + project + '/environment/' + environment + '/section/client/service/' + service + '/tags',
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

			if (i < services.length / 2) 	tbody_left 	+= tbody;
			else tbody_right += tbody;
		});
	}
	return {'left': tbody_left, 'right': tbody_right};
}

/**
 * Prepare a list of variables/checkbox
 */
function prepareVariableList(variables) {
	keysNb = Object.keys(variables).length;
	counter = 0

	tbody_left 	= "";
	tbody_right = "";
	for (var variable in variables) {
		counter += 1
		tbody =	"<tr><td>" + variable + "</td>";
		tbody += "<td><input type='checkbox' class='form-control variable_input' name='" + variable + "' /></td>";
		tbody += "</tr>";
		if (counter <= keysNb / 2) tbody_left += tbody;
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
		project = $(PROJECT_ROW + " select").val();
		environment = $(this).val();

		$.ajax({
			method: 'GET',
			url: 'http://localhost:5000/api/v1.0/model/app/project/' + project + '/environment/' + environment + '/section/client/services',
			dataType: 'json',
			crossdomain: true,
			async: false
		}).done(function(data) {
			services_rows = prepareServicesList(data);
			console.log(services_rows);
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


});