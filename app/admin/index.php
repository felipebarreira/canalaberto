<?php
ini_set('display_errors', '1');
error_reporting(1);

try {

	if (!is_readable('includes/init.php'))
		throw new Exception("Arquivo de inicialização não foi encontrado.");

	require('includes/init.php');

	/*** Carregar o router ***/
	$objRegistro->router = new Router($objRegistro);
	$objRegistro->router->setCaminho(ARKANTAS_MVC_SYSTEM);
	$objRegistro->router->setModules($objRegistro->ignite_modules);

	/*** Carregar o model ***/
	$objRegistro->model = $objRegistro->router->model();

	/*** carregar o template(view) ***/
	$objRegistro->template = new Template($objRegistro);

	/*** carrega o controller ***/
	$objRegistro->router->loader();

	/*** carrega métodos da aplicação ***/
	$objRegistro->conexao->close();
} catch (Exception $e) {
	print $e->getMessage();
}

ob_end_flush();
