<?php
# GinGa :: Project settings
if (function_exists('ignite_loadtime'))
	define("LOADTIME", ignite_loadtime());

$modules = array();

Administrador::setPathPaste(PATH . "uploads/user/");
Administrador::setDomainPaste(HTTP_DOMAIN . "uploads/user/");

# MODULE:COMPLAINT
$modules['complaint'] = array(
	'namespace' => 'Complaint',
	'controllers' => array('cRegistry'),
	'path_controller' => 'complaint',
	'path_view' => 'complaint'
);
\Complaint\Registry::setPathPaste(PATH . "uploads/canalaberto/");
\Complaint\Registry::setDomainPaste(HTTP_DOMAIN . "uploads/canalaberto/");

@$objRegistro->ignite_modules = $modules;
