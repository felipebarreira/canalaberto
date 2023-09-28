<?php
# APP :: Init
setlocale(LC_ALL, NULL);
setlocale(LC_ALL, 'pt_BR.UTF8');

# APP :: Project settings
require(realpath(dirname(__FILE__)) . '/' . 'app-config.php');
require(realpath(dirname(__FILE__)) . '/' . 'app-version.php');
session_start();

# Composer
require(PATH . '/vendor/' . 'autoload.php');

# APP :: Fields
$authenticatedFields = array(
	"id" 		=> "adm_id",
	"salt" 		=> "adm_salt",
	"time"		=> "adm_timesession",
	"login" 	=> array(0 => "ginga-login", 1 => "adm_email"),
	"pass" 		=> array(0 => "ginga-password", 1 => "adm_senha")
);

# APP :: Instantiating default classes on Project by Arkantas Framework/Library
$objRegistro->conexao = Conexao::singleton();
$objRegistro->conexao->setDatabase(DB_NAME);
$objRegistro->conexao->setUser(DB_USER);
$objRegistro->conexao->setPassword(DB_PASSWORD);
$objRegistro->conexao->setHost(DB_HOST);
$objRegistro->conexao->init();
//$objRegistro->conexao->setDebug(true);

# Arkantas settings apply
ini_set('display_errors', '0');
error_reporting(0);

if (ARKANTAS_DEBUG) {
	ini_set('display_errors', '1');
	error_reporting(E_ALL);
}

if (ARKANTAS_DB_DEBUG) {
	$objRegistro->conexao->setDebug(true);
}

#
$iduser = (@$_SESSION['igniteiduser'] != "") ? base64_decode($_SESSION['igniteiduser']) : "";
$objRegistro->administrador = new Administrador;
$objRegistro->administrador->setPrefix("ignite");
$objRegistro->administrador->setRememberMeCookieName('igniterememberme');
$objRegistro->administrador->setFields($authenticatedFields);
$objRegistro->administrador->setPathUriValidation(HTTP_DOMAIN . PATH_ADMIN);
$objRegistro->administrador->getObject($iduser);

# @boolean $status authenticated login
if (@$_GET['rt'] != "index/status")
	$objRegistro->status = $objRegistro->administrador->isSessionAuthenticated();

$objRegistro->objLog = ArkantasLog::singleton();
$objRegistro->objLog->setClassLogin("Administrador");
$objRegistro->objLog->setEntidadeLogin("administracao");
$objRegistro->objLog->setFieldClass($authenticatedFields);

$objRegistro->objLog->addEntidade("administracao", true);
$objRegistro->objLog->addEntidade("tb_administracao", true);

# logs modulo :: complaint
$objRegistro->objLog->addEntidade("complaint_registry", true);
$objRegistro->objLog->addEntidade("tb_complaint_registry", true);

# APP :: Instantiating default classes on Project @null
$objVariavel = new Variavel;
$objVariavel->setTipo('get');
$objVariavel->setCampos(array(
	'rt' => 'text',
	'id' => 'text',
	'geo' => 'text',
	'context' => 'int',
	'addClass' => 'null',
	'secao'  => 'text',
	'getidioma' => 'text',
	'orderc' => 'null',
	'ordert' => 'null',
	'tipo-acao' => 'text',
	'msg-acao' => 'html',
	'det-acao' => 'html',
	'exporta-xml' => 'text',
	'busca' => 'text',
	'opcao' => 'text',
	'status' => 'text',
	'download' => 'text',
	'type' => 'text',
	'typepay' => 'text',
	'days' => 'text',
	'recovery' => 'text',
	'message' => 'text',
	'serial' => 'text',
	'search' => 'text',
	'group' => 'text',
	'date' => 'text',
	'page' => 'text',
	't' => 'text',
	'year' => 'text',
	'period' => 'text',
	'account' => 'text',
	'id-administrador' => 'text',
	'id-registry' => 'text',
));
$objRegistro->gets = $objVariavel;
$gets = $objRegistro->gets->getValores();

# Cookies APP
$objRegistro->objCookie = new Cookie("gingaConfig");

# ADM User-type validation

# APP :: UI settings

/* Pagination */
$objRegistro->num    = 10;
$objRegistro->page   = (!allReplace(@$_GET['page'])) ? 1 : allReplace($_GET['page']);
$objRegistro->first  = ($objRegistro->page * $objRegistro->num) - $objRegistro->num;
