<?php
header('Access-Control-Allow-Origin: *');

try {

	if (!is_readable('includes/init.php'))
		throw new Exception("Arquivo de inicialização não foi encontrado.");

	require('includes/init.php');

	/*** Carregar o router ***/
	$objRegistro->router = new Router($objRegistro);
	$objRegistro->router->setCaminho(PATH);

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
