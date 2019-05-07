const PROJECT_ROW = "#project_select_row";
const ENVIRONMENT_ROW = "#environment_select_row";
const APPLICATION_ROW = "#application_select_row";
const INSTANCE_ROW = "#instance_select_row";

const MANAGE_PANEL = "#manage_panel";
const RESPONSE_PANEL = "#response_panel";
const HAPROXY_PANEL = "#haproxy_panel";

const SAVE_BUTTON = "#save_button";
const AUTOGENERATE_BUTTON = "#autogenerate_button";
const DELETE_BUTTON = "#delete_button";

const DOWNLOAD_PANEL = "#download_panel";
const SITE_ROW = "#site_select_row";
const DOWNLOAD_AVAILABLE_BUTTON = "#dl_available_button";
const DOWNLOAD_ENABLED_BUTTON = "#dl_enabled_button";
const DOWNLOAD_ENABLED_LIST_BUTTON = "#dl_enabled_list_button";



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
 * Prepare a list of item/checkbox
 */
function prepareCheckboxList(available, enabled, section) {
    available = available.sort();

    tbody_left 	= "";
	tbody_right = "";

    for (let i = 0; i < available.length; i++) {
        item = available[i];
        tbody =	"<tr><td class='col-sm-10'>" + item + "</td>";
        tbody += "<td class='col-sm-2'>";
		if (enabled.includes(item)) {
			tbody += "<input type='checkbox' checked='checked' value='" + item + "' class='form-control custom_checkbox pull-left' />"
		}
		else {
            tbody += "<input type='checkbox' value='" + item + "' class='form-control custom_checkbox pull-left' />"
		}
		tbody += "</td></tr>";
		if (i % 2 == 0) tbody_left += tbody;
		else tbody_right += tbody;
	}

	return {'left': tbody_left, 'right': tbody_right};
}



/**
 * Display response message in RESPONSE_PANEL
 */
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
	html = "<center class='" + centerClass + "'>" + msg + "</center>"
	$(RESPONSE_PANEL + ' .panel-body').html(html);
	$(RESPONSE_PANEL).show();
}



/**
 * Prepare HAproxy panel with the configuration
 */
function loadHaproxyPanel(project, environment, application, instance) {
	services = {};
	usedServices = new Array();
	$.ajax({
		method: 'GET',
		url: 'http://10.8.1.72:5000/api/v1.0/model/middleware/project/' + project + '/environment/' + environment + '/loadbalancer/services',
		dataType: 'json',
		crossdomain: true,
		async: false
	}).done(function(data) {
		services = data;
	}).fail(function() {
		alert('Couldn\'t load services from Model');
	});

	$.ajax({
		method: 'GET',
		url: 'http://10.8.1.72:5000/api/v1.0/push/middleware/project/' + project + '/environment/' + environment + '/application/' + application + '/instance/' + instance + '/loadbalancer/services',
		dataType: 'json',
		crossdomain: true,
		async: false
	}).done(function(data) {
        usedServices = data;
	}).fail(function() {
		alert('Couldn\'t load services from Push');
	});

	services_row = prepareCheckboxList(services, usedServices, 'app');
	$(HAPROXY_PANEL + ' table.table_left tbody').html(services_row.left);
	$(HAPROXY_PANEL + ' table.table_right tbody').html(services_row.right);
}


/**
 * Prepare Download panel with the sites select
 */
function loadDownloadPanel(project, environment, application, instance) {
	$.ajax({
		method: 'GET',
		url: 'http://10.8.1.72:5000/api/v1.0/model/middleware/project/' + project + '/environment/' + environment + '/loadbalancer/sites',
		dataType: 'json',
		crossdomain: true,
		async: false
	}).done(function(data) {
		html = "";
		for (let id in data) {
			site = data[id];
			if (data.hasOwnProperty(id)) {
				html += "<option value='" + id + "'>" + site + "</option>"
			}
		}
		$(SITE_ROW + ' select').html("<option value=''></option>");
		$(SITE_ROW + ' select').append(html);
		$(SITE_ROW).show();
	}).fail(function() {
		alert('Couldn\'t load sites from Model');
	});

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

	});



	/**
	 *	When choosing a project
	 */
	$(PROJECT_ROW + " select").on('change', function() {
		$(ENVIRONMENT_ROW).hide();
		$(APPLICATION_ROW).hide();
		$(INSTANCE_ROW).hide();
        $(HAPROXY_PANEL).hide();
		$(MANAGE_PANEL).hide();
		$(DOWNLOAD_PANEL).hide();
		$(RESPONSE_PANEL).hide();

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
        $(HAPROXY_PANEL).hide();
		$(MANAGE_PANEL).hide();
		$(DOWNLOAD_PANEL).hide();
		$(RESPONSE_PANEL).hide();

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
			$(APPLICATION_ROW + ' select').append(jsonToOptions(data));
			$(APPLICATION_ROW).show();
		});
	});


	/**
	 *	When choosing application name
	 */
	$(APPLICATION_ROW + ' select').on('change', function() {
		$(INSTANCE_ROW).hide();
        $(HAPROXY_PANEL).hide();
		$(MANAGE_PANEL).hide();
		$(DOWNLOAD_PANEL).hide();
		$(RESPONSE_PANEL).hide();

		application = $(this).val();
		if (!application) {
			return;
		}

		project	 	= $(PROJECT_ROW + " select").val();
		environment	= $(ENVIRONMENT_ROW + " select").val();
		$.ajax({
			method: 'GET',
			url: 'http://10.8.1.72:5000/api/v1.0/push/project/' + project + '/environment/' + environment + '/application/' + application + '/instances',
			dataType: 'json',
			crossdomain: true,
			async: false
		}).done(function(data) {
			$(INSTANCE_ROW + ' select').html("<option value=''></option>");
			$(INSTANCE_ROW + ' select').append(jsonToOptions(data));
			$(INSTANCE_ROW).show();
		});
	});



    /**
	 * When choosing an instance
	 */
	$(INSTANCE_ROW + ' select').on('change', function() {
        $(HAPROXY_PANEL).hide();
		$(MANAGE_PANEL).hide();
		$(DOWNLOAD_PANEL).hide();
		$(RESPONSE_PANEL).hide();


		instance = $(this).val();
		if (!instance) {
			return;
		}

		project	 	= $(PROJECT_ROW + " select").val();
		environment	= $(ENVIRONMENT_ROW + " select").val();
		application = $(APPLICATION_ROW + " select").val();

        loadHaproxyPanel(project, environment, application, instance);
		loadDownloadPanel(project, environment, application, instance);
        $(HAPROXY_PANEL).show();
        $(MANAGE_PANEL).show();
		$(DOWNLOAD_PANEL).show();
    });



    /**
	 *	When saving
	 */
	$(SAVE_BUTTON).on("click", function() {
		project = $(PROJECT_ROW + " select").val();
		environment = $(ENVIRONMENT_ROW + " select").val();
		application = $(APPLICATION_ROW + " select").val();
		instance = $(INSTANCE_ROW + " select").val();


		usedServices = [];
		$.each($(HAPROXY_PANEL + ' input[type=checkbox]:checked'), function() {
			usedServices.push($(this).val());
		});

		$.ajax({
			method: 'DELETE',
			url: 'http://10.8.1.72:5000/api/v1.0/push/middleware/project/' + project + '/environment/' + environment + '/application/' + application + '/instance/' + instance + '/loadbalancer',
			contentType: 'application/json; charset=utf-8',
			crossdomain: true,
			async: false
		}).done(function(response) {
			console.log(response);
		});

		data = JSON.stringify({
            services: usedServices
        });
		console.log(data);

		$.ajax({
			method: 'POST',
			url: 'http://10.8.1.72:5000/api/v1.0/push/middleware/project/' + project + '/environment/' + environment + '/application/' + application + '/instance/' + instance + '/loadbalancer',
			data: data,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			crossdomain: true,
			async: false
		}).done(display_response);
	});



    /**
	 *	Delete conf
	 */
	$(DELETE_BUTTON).on("click", function() {
		project = $(PROJECT_ROW + " select").val();
		environment = $(ENVIRONMENT_ROW + " select").val();
		application = $(APPLICATION_ROW + " select").val();
		instance = $(INSTANCE_ROW + " select").val();
        $.ajax({
			method: 'DELETE',
			url: 'http://10.8.1.72:5000/api/v1.0/push/middleware/project/' + project + '/environment/' + environment + '/application/' + application + '/instance/' + instance + '/loadbalancer',
			contentType: 'application/json; charset=utf-8',
			crossdomain: true,
			async: false
		}).done(display_response);
    });


    /**
	 *	Autogeneration
	 */
	$(AUTOGENERATE_BUTTON).on("click", function() {
		project = $(PROJECT_ROW + " select").val();
		environment = $(ENVIRONMENT_ROW + " select").val();
		application = $(APPLICATION_ROW + " select").val();
		instance = $(INSTANCE_ROW + " select").val();
        $.ajax({
			method: 'GET',
			url: 'http://10.8.1.72:5000/api/v1.0/push/middleware/project/' + project + '/environment/' + environment + '/application/' + application + '/instance/' + instance + '/loadbalancer/autobuild',
			contentType: 'application/json; charset=utf-8',
			crossdomain: true,
			async: false
		}).done(display_response);
    });

	/**
	 *	conf-available download
	 */
	$(DOWNLOAD_AVAILABLE_BUTTON).on("click", function() {
		project = $(PROJECT_ROW + " select").val();
		environment = $(ENVIRONMENT_ROW + " select").val();
		window.open('http://10.8.1.72:5000/api/v1.0/model/middleware/project/' + project + '/environment/' + environment + '/loadbalancer/haproxy/conf-available', '_blank');
    });


	/**
	 *	conf-enabled filelist download
	 */
	$(DOWNLOAD_ENABLED_LIST_BUTTON).on("click", function() {
		project = $(PROJECT_ROW + " select").val();
		environment = $(ENVIRONMENT_ROW + " select").val();
		application = $(APPLICATION_ROW + " select").val();
		instance = $(INSTANCE_ROW + " select").val();

		site = $(SITE_ROW + " select").val()
		if (site) {
			window.open('http://10.8.1.72:5000/api/v1.0/push/middleware/project/' + project + '/environment/' + environment + '/application/' + application + '/instance/' + instance + '/loadbalancer/haproxy/site/' + site + '/conf-enabled/filelist/format/text', '_blank');
		}
		else {
			$(RESPONSE_PANEL + ' .panel-body').html("<center class='text-danger'>Please select a site first</center>");
			$(RESPONSE_PANEL).show();
		}
    });


	/**
	 *	conf-enabled download
	 */
	$(DOWNLOAD_ENABLED_BUTTON).on("click", function() {
		project = $(PROJECT_ROW + " select").val();
		environment = $(ENVIRONMENT_ROW + " select").val();
		application = $(APPLICATION_ROW + " select").val();
		instance = $(INSTANCE_ROW + " select").val();

		site = $(SITE_ROW + " select").val()
		if (site) {
			window.open('http://10.8.1.72:5000/api/v1.0/push/middleware/project/' + project + '/environment/' + environment + '/application/' + application + '/instance/' + instance + '/loadbalancer/haproxy/site/' + site + '/conf-enabled', '_blank');
		}
		else {
			$(RESPONSE_PANEL + ' .panel-body').html("<center class='text-danger'>Please select a site first</center>");
			$(RESPONSE_PANEL).show();
		}
    });

});
