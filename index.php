<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="" />
        <meta name="author" content="" />
        <title>CMDB</title>
        <link rel="icon" type="image/png" href="img/favicon.png">
        <link rel="stylesheet" type="text/css" href="css/bootstrap/bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="css/yoctu/main.css" />
        <script type="text/javascript" src="js/jquery/jquery-latest.min.js"></script>
        <script type="text/javascript" src="js/jquery/jquery-ui.min.js"></script>
        <script type="text/javascript" src="js/chart/chartkick.min.js"></script>
        <script type="text/javascript" src="js/chart/Chart.bundle.min.js"></script>
        <script type="text/javascript" src="js/bootstrap/bootstrap.min.js"></script>
        <script type="text/javascript" src="js/yoctu.js"></script>
        <script type="text/javascript" src="js/main.js"></script>
    </head>
    <body role="document">
        <div class="wrapper">
            <?php
            	include 'html/header.html';

                if (isset($_GET['new_application'])) {
                    include 'html/new_application.html';
                }
                else if (isset($_GET['change_app_configuration'])) {
                    include 'html/change_app_configuration.html';
                }
                else if (isset($_GET['phing_configuration'])) {
                    include 'html/phing_configuration.html';
                }
                else if (isset($_GET['home']) || !$_SERVER['QUERY_STRING']) {
                    include 'html/home.html';
                }
                else {
                    echo "<h1>404 the requested page wasen't found on this server.</h1>";
                }

                include 'html/footer.html';
            ?>
        </div>
    </body>
</html>
