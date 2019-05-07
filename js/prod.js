const PROJECT_ROW = "#project_select_row";
const ENVIRONMENT_ROW = "#environment_select_row";
const SERVER_ROW = "#server_select_row";
const SERVICE_ROW = "#service_select_row";

const SERVER_SUBMIT_ROW = "#server_submit_row";
const SERVICE_SUBMIT_ROW = "#service_submit_row";

const QUERY_PANEL = "#query_panel";
const QUERY_ROWS = ".query_row";

const RESPONSE_PANEL = "#response_panel";





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
 * Build a <table> representing the data contained in the given object data
 * @param data is a list of hashmaps, each hashmap representing a record/line of the table
 * Each hashmap is supposed to have the same keys
 * @return is an html table
 */
function build_response_table(data) {
	console.log(data);
	if ('error' in data) {
		return data['error'];
	}
	if (data.length < 1) {
		return "No data. ";
	}

	output = "<table class='table table-striped responsive'>";
	output += "<thead><tr>";
	keys = Object.keys(data[0]); //each record should have the same keys

	for (let i = 0; i < keys.length; i++) {
		output += "<th>" + keys[i] + "</th>";
	}
	output += "</tr></thead>";
	output += "<tbody>";
	for (let i = 0; i < data.length; i++) {
		output += "<tr>";
		for (let j = 0; j < keys.length; j++) {
			if (data[i].hasOwnProperty(keys[j])) {
				output += "<td style='color: #555;'>" + data[i][keys[j]] + "</td>";
			}
		}
		output += "</tr>";
	}
	output += "</tbody>";
	output += "</table>";
	return output
}



/**
 * Script begin
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

        $.ajax({
			method: 'GET',
			url: 'http://10.8.1.72:5000/api/v1.0/prod/services',
			dataType: 'json',
			crossdomain: true,
			async: false
		}).done(function(data) {
			$(SERVICE_ROW + ' select').html("<option value=''></option>");
			$(SERVICE_ROW + ' select').append(jsonToOptions(data));
			$(SERVICE_ROW).show();
		});
    });



    /**
     *	When choosing a project
     */
    $(PROJECT_ROW + " select").on('change', function() {
        $(ENVIRONMENT_ROW).hide();
        $(SERVER_ROW).hide();
        $(QUERY_PANEL).hide();
        $(RESPONSE_PANEL).hide();
		$(SERVER_SUBMIT_ROW).hide();

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
        $(SERVER_ROW).hide();
        $(QUERY_PANEL).hide();
        $(RESPONSE_PANEL).hide();
		$(SERVER_SUBMIT_ROW).hide();

        environment = $(this).val();
        if (!environment) {
            return;
        }
        project	= $(PROJECT_ROW + " select").val();
        $.ajax({
            method: 'GET',
            url: 'http://10.8.1.72:5000/api/v1.0/prod/project/' + project + '/environment/' + environment + '/servers',
            dataType: 'json',
            crossdomain: true,
            async: false
        }).done(function(data) {
            $(SERVER_ROW + ' select').html("<option value=''></option>");
            $(SERVER_ROW + ' select').append(jsonToOptions(data));
            $(SERVER_ROW).show();
        });
    });

	/**
     *	When choosing an server
     */
    $(SERVER_ROW + " select").on('change', function() {
        $(QUERY_PANEL).hide();
        $(RESPONSE_PANEL).hide();
		$(SERVER_SUBMIT_ROW).show();
    });

	/**
     *	When choosing an service
     */
    $(SERVICE_ROW + " select").on('change', function() {
		$(QUERY_PANEL).hide();
        $(RESPONSE_PANEL).hide();
		$(SERVICE_SUBMIT_ROW).show();
    });




	/**
     *	When pressing server OK button
     */
    $(SERVER_SUBMIT_ROW + " button").on('click', function() {
		$(RESPONSE_PANEL).hide();

		$(QUERY_ROWS).hide();
        $('#query5').show();
		$('#query6').show();
		$('#query7').show();
		$('#query8').show();
		$(QUERY_PANEL).show();
    });

	/**
     *	When pressing service OK button
     */
    $(SERVICE_SUBMIT_ROW + " button").on('click', function() {
        $(RESPONSE_PANEL).hide();

		$(QUERY_ROWS).hide();
        $('#query1').show();
		$('#query2').show();
		$('#query2_5').show();
		$('#query2_75').show();
		$('#query3').show();
		$('#query4').show();
		$(QUERY_PANEL).show();
    });



	// 1 : Get linux servers hosting given service
    $('#run_query_1').on('click', function() {
		service = $(SERVICE_ROW + " select").val();
		$.ajax({
            method: 'GET',
			url: 'http://10.8.1.72:5000/api/v1.0/prod/linux_servers_hosting/service/' + service,
            dataType: 'json',
            crossdomain: true,
            async: false
        }).done(function(data) {
			$(RESPONSE_PANEL + ' .panel-body').html(build_response_table(data));
            $(RESPONSE_PANEL).show();
		});
	});

	// 2 : Get linux servers consuming given service
    $('#run_query_2').on('click', function() {
		service = $(SERVICE_ROW + " select").val();
		$.ajax({
            method: 'GET',
			url: 'http://10.8.1.72:5000/api/v1.0/prod/linux_servers_consuming/service/' + service,
            dataType: 'json',
            crossdomain: true,
            async: false
        }).done(function(data) {
			$(RESPONSE_PANEL + ' .panel-body').html(build_response_table(data));
            $(RESPONSE_PANEL).show();
		});
	});

	// 2.5 : Get applications consuming given service
    $('#run_query_2_5').on('click', function() {
		service = $(SERVICE_ROW + " select").val();
		$.ajax({
            method: 'GET',
			url: 'http://10.8.1.72:5000/api/v1.0/prod/applications_consuming/service/' + service,
            dataType: 'json',
            crossdomain: true,
            async: false
        }).done(function(data) {
			$(RESPONSE_PANEL + ' .panel-body').html(build_response_table(data));
            $(RESPONSE_PANEL).show();
		});
	});

	// 2.75 : Get services consumed by a given service/application
    $('#run_query_2_75').on('click', function() {
		service = $(SERVICE_ROW + " select").val();
		$.ajax({
            method: 'GET',
			url: 'http://10.8.1.72:5000/api/v1.0/prod/service/' + service + '/client',
            dataType: 'json',
            crossdomain: true,
            async: false
        }).done(function(data) {
			$(RESPONSE_PANEL + ' .panel-body').html(build_response_table(data));
            $(RESPONSE_PANEL).show();
		});
	});

	// 3 : Get urls of a service
    $('#run_query_3').on('click', function() {
		service = $(SERVICE_ROW + " select").val();
		$.ajax({
            method: 'GET',
			url: 'http://10.8.1.72:5000/api/v1.0/prod/urls/service/' + service,
            dataType: 'json',
            crossdomain: true,
            async: false
        }).done(function(data) {
			$(RESPONSE_PANEL + ' .panel-body').html(build_response_table(data));
            $(RESPONSE_PANEL).show();
		});
	});

	// 4 : See how a service is consumed by linux servers
    $('#run_query_4').on('click', function() {
		service = $(SERVICE_ROW + " select").val();
		$.ajax({
            method: 'GET',
			url: 'http://10.8.1.72:5000/api/v1.0/prod/consumption/service/' + service,
            dataType: 'json',
            crossdomain: true,
            async: false
        }).done(function(data) {
			$(RESPONSE_PANEL + ' .panel-body').html(build_response_table(data));
            $(RESPONSE_PANEL).show();
		});
	});




	// 5 : Get all services hosted by a linux server
	$('#run_query_5').on('click', function() {
		project = $(PROJECT_ROW + " select").val();
		environment = $(ENVIRONMENT_ROW + " select").val();
		server = $(SERVER_ROW + " select").val();
		$.ajax({
			method: 'GET',
			url: 'http://10.8.1.72:5000/api/v1.0/prod/project/' + project + '/environment/' + environment + '/server/' + server + '/services',
			dataType: 'json',
			crossdomain: true,
			async: false
		}).done(function(data) {
			$(RESPONSE_PANEL + ' .panel-body').html(build_response_table(data));
			$(RESPONSE_PANEL).show();
		});
	});

	// 6 : Get all services consumed by a linux server
	$('#run_query_6').on('click', function() {
		project = $(PROJECT_ROW + " select").val();
		environment = $(ENVIRONMENT_ROW + " select").val();
		server = $(SERVER_ROW + " select").val();
		$.ajax({
			method: 'GET',
			url: 'http://10.8.1.72:5000/api/v1.0/prod/project/' + project + '/environment/' + environment + '/server/' + server + '/client',
			dataType: 'json',
			crossdomain: true,
			async: false
		}).done(function(data) {
			$(RESPONSE_PANEL + ' .panel-body').html(build_response_table(data));
			$(RESPONSE_PANEL).show();
		});
	});

	// 7 : Get all opened ports on a linux server
	$('#run_query_7').on('click', function() {
		project = $(PROJECT_ROW + " select").val();
		environment = $(ENVIRONMENT_ROW + " select").val();
		server = $(SERVER_ROW + " select").val();
		$.ajax({
			method: 'GET',
			url: 'http://10.8.1.72:5000/api/v1.0/prod/project/' + project + '/environment/' + environment + '/server/' + server + '/opened_ports',
			dataType: 'json',
			crossdomain: true,
			async: false
		}).done(function(data) {
			$(RESPONSE_PANEL + ' .panel-body').html(build_response_table(data));
			$(RESPONSE_PANEL).show();
		});
	});

	// 8 : Get haproxy configuration of a linux server
	$('#run_query_8').on('click', function() {
		project = $(PROJECT_ROW + " select").val();
		environment = $(ENVIRONMENT_ROW + " select").val();
		server = $(SERVER_ROW + " select").val();
		$.ajax({
			method: 'GET',
			url: 'http://10.8.1.72:5000/api/v1.0/prod/project/' + project + '/environment/' + environment + '/server/' + server + '/haproxy_configuration',
			dataType: 'json',
			crossdomain: true,
			async: false
		}).done(function(data) {
			$(RESPONSE_PANEL + ' .panel-body').html(build_response_table(data));
			$(RESPONSE_PANEL).show();
		});
	});





});
