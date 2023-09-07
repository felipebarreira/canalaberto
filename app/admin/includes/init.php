<?php
	# Project config
	require ('../includes/' . 'config.php');

	/*
	 * RouterController
	 * _GET router, define o controlador da página através das configurações setadas no arquivo routerconfig.php
	 * require (PATH . '/aplicacao/RouterController.class.php');
	 */
	#  MVC Default Files & Loader
	require (PATH . PATH_ADMIN . '/app/Base/' . 'ClassLoader.class.php');
	
	require (PATH . PATH_ADMIN . '/app/Base/' . 'baseController.class.php');
	require (PATH . PATH_ADMIN . '/app/Base/' . 'baseModel.class.php');
	require (PATH . PATH_ADMIN . '/app/Base/' . 'baseModelList.class.php');
	require (PATH . PATH_ADMIN . '/app/Base/' . 'registro.class.php');
	require (PATH . PATH_ADMIN . '/app/Base/' . 'router.class.php');
	require (PATH . PATH_ADMIN . '/app/Base/' . 'template.class.php');
	
	$objRegistro = new Registro;

	# Load other files and settings
	# require (PATH . PATH_ADMIN . '/' . 'routerconfig.php');

	# Require Files (Functions)
	require (PATH . PATH_ADMIN . '/includes/helpers/' . 'functions-library.php');
	
	# Starts base classes & Settings GinGa
	require (PATH . PATH_ADMIN . '/includes/' . 'app-init.php');
