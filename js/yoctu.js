jQuery(function($) {
    var panelList = $('#PanelList');
    panelList.sortable({
        handle: '.panel-heading', 
        update: function() {
            $('.panel', panelList).each(function(index, elem) {
                var $listItem = $(elem),newIndex = $listItem.index();
            });
        }
    });
});

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function setESMHostname () {
    var hostname = getUrlVars()["ESMHOSTNAME"];
    if (hostname) {
        document.cookie = "ESMHOSTNAME="+hostname+";expires=3600000;";
    }
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

$(document).ready(function () {
    
    setESMHostname();
    /**
     * @deprecated use page uniq value instead
     * @desc will set `active` class to menu element matching current url pathname
     **/
    $('.page-header .navbar ul.nav li.dropdown').each(function(index, htmlElement) {
        var item = $(htmlElement);
        var a = item.find('a').attr('class').split(" ");
        for (var i = 0; i < a.length; i++) {
            if(a[i] === window.location.pathname.replace("/","")) {
                item.addClass('active');
                return;
            }
        }
    });

    if (getCookie('VERSION') == null) {
        $.get('/ajaxchecksetup?check=version', function(data) {
            document.cookie = "VERSION="+data.version+";expires=3600000;";
            $("#esm_version").html("<b>Yoctu</b> 2018 | "+data.version+" | " + getCookie('ESMHOSTNAME'));
        },'json');
    } else {
        $("#esm_version").html("<b>Yoctu</b> 2018 | "+getCookie('VERSION') +" | " + getCookie('ESMHOSTNAME'));
    }

    $("#esm_username").html('<span class="glyphicon glyphicon-user"></span> ' + getCookie('USERNAME') + ' <span class="glyphicon glyphicon-option-vertical"></span>');
    if (getCookie('USERNAME') != "") {
        $("#esm_logout").html('<li><a href="/logout" id="esm_logout_a"><i class="glyphicon glyphicon-log-out"></i> Logout</a></li>');
    }
    if (getCookie('UPGRADE') > 1) {
        $("#upgrade_status").html('<a href="/webconfig" style="border-bottom: transparent;"><span class="glyphicon glyphicon-circle-arrow-up" style="color: red;"></span></a>');
    } else {
        $("#upgrade_status").html('<a href="/webconfig" style="border-bottom: transparent;"><span class="glyphicon glyphicon-ok-circle" style="color: green;"></span></a>');
    }

});
