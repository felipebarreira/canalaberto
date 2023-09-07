<?php
# Project config
require(realpath(dirname(__FILE__)) . '/' . 'config.php');

# Composer
require(PATH . '/vendor/' . 'autoload.php');

/*
	 * RouterController
	 * _GET router, define o controlador da página através das configurações setadas no arquivo routerconfig.php
	 */
require(PATH . PATH_ADMIN . '/app/Base/' . 'RouterController.class.php');

# MVC Default Files & Loader
require(PATH . PATH_ADMIN . '/app/Base/' . 'ClassLoader.class.php');

require(PATH . PATH_ADMIN . '/app/Base/' . 'baseController.class.php');
require(PATH . PATH_ADMIN . '/app/Base/' . 'baseModel.class.php');
require(PATH . PATH_ADMIN . '/app/Base/' . 'baseModelList.class.php');
require(PATH . PATH_ADMIN . '/app/Base/' . 'registro.class.php');
require(PATH . PATH_ADMIN . '/app/Base/' . 'router.class.php');
require(PATH . PATH_ADMIN . '/app/Base/' . 'template.class.php');
require(PATH . PATH_ADMIN . '/app/Base/' . 'TemplateAdapter.class.php');

$objRegistro = new Registro;

# Library GinGa/Ignite
require(PATH . PATH_ADMIN . '/includes/helpers/' . 'functions-library.php');


/*
 *	Class Iniciation
 *	$objRegistro->language = $language;
 */
$objRegistro->conexao = Conexao::singleton();
$objRegistro->conexao->setDatabase(DB_NAME);
$objRegistro->conexao->setUser(DB_USER);
$objRegistro->conexao->setPassword(DB_PASSWORD);
$objRegistro->conexao->setHost(DB_HOST);
$objRegistro->conexao->setCharset("utf8mb4");
$objRegistro->conexao->init();

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

# context application
$objVariavel = new Variavel;
$objVariavel->setTipo('get');
$objVariavel->setCampos(
	array(
		'rt' => 'text',
		'rt::value' => 'text',
		'message' => 'text',
		'page'  => 'numeric',
		'action' => 'text',
		't' => 'text',
		'code' => 'text',
		'id' => 'text',
		'tipo-acao' => 'text',
		'msg-acao' => 'html',
		'det-acao' => 'html',
		'orderc' => 'null',
		'ordert' => 'null',
		'busca' => 'text',
		'opcao' => 'text',
		'status' => 'text',
		'email' => 'email',
		'name' => 'text',
		'login' => 'text',
		'lat' => 'text',
		'lng' => 'text',
		'distance' => 'text',
		'first' => 'text',
		'num' => 'text',
		'type' => 'text',
		'report' => 'text',
		'token' => 'text',
		'json' => 'text',
		'url' => 'text',
		'send' => 'text'
	)
);
$objRegistro->gets = $objVariavel;

# Settings System Files
require(PATH . '/includes/' . 'routerconfig.php');
