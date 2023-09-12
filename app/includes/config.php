<?php
date_default_timezone_set("America/Sao_Paulo");

setlocale(LC_ALL, NULL);
setlocale(LC_ALL, 'pt_BR.UTF8');

# Session
define('PATH_PROJECT', '');
define('PATH_ADMIN', 'admin');
define('PATH', $_SERVER['DOCUMENT_ROOT'] . '/' . PATH_PROJECT);

define('DOMAIN', 'localhost');
define('HTTP_DOMAIN', 'http://' . DOMAIN . '/' . PATH_PROJECT);

define('NAMEPROJECT', 'Canal Aberto');
define('PROJECTKEY', '8e99b4dab131fe464a021e129d5263dc9e461a12');

# database settings
define('DB_NAME', 'db_canalaberto');
define('DB_USER', 'root');
define('DB_PASSWORD', 'root');
define('DB_HOST', 'mysql');

# Arkantas settings
define("ARKANTAS_VERSION", 2);
define('ARKANTAS_MVC_SYSTEM', realpath(dirname("../")));
define('ARKANTAS_DEBUG', true);
define('ARKANTAS_DB_DEBUG', false);
