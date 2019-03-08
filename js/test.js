$("#testLogger-btn").click(function(){
    $("#logger-result-panel").html('<br>');
    $.post("/ajaxtest", { service: "logger", host: $('#LoggerUrl').val() })
        .done(function (data) {
            $("#logger-result-panel").text(data);
        });
});

$("#testAudit-btn").click(function(){
    $("#audit-result-panel").html('<br>');
    $.post("/ajaxtest", { service: "audit", host: $('#AuditUrl').val() })
        .done(function (data) {
            $("#audit-result-panel").text(data);
        });
});

$("#testMailer-btn").click(function(){
    $("#mailer-result-panel").html('<br>');
    $.post("/ajaxtest", { service: "mailer", host: $('#MailerUrl').val() })
        .done(function (data) {
            $("#mailer-result-panel").text(data);
        });
});

$("#testPayment-btn").click(function(){
    $("#payment-result-panel").html('<br>');
    $.post("/ajaxtest", { service: "payment", host: $('#PaymentUrl').val() })
        .done(function (data) {
            $("#payment-result-panel").text(data);
        });
});

$("#testNotification-btn").click(function(){
    $("#notification-result-panel").html('<br>');
    $.post("/ajaxtest", { service: "notification", host: $('#NotificationUrl').val() })
        .done(function (data) {
            $("#notification-result-panel").text(data);
        });
});

$("#testChat-btn").click(function(){
    $("#chat-result-panel").html('<br>');
    $.post("/ajaxtest", { service: "chat", host: $('#ChatUrl').val() })
        .done(function (data) {
            $("#chat-result-panel").text(data);
        });
});


