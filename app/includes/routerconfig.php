<?php
$rc = new RouterController;
$rc->setPath(PATH_PROJECT);
$rc->setError404(true);

$rc->addDefault(
	'index',
	array(
		array(
			0 => array()
		),
		array(
			0 => array("name" => "get", "type" => "array")
		),
		array(
			0 => array("name" => "page", "type" => "int")
		),
		array(
			0 => array("name" => "page", "type" => "int"),
			1 => array("name" => "get", "type" => "array")
		)
	)
);

$rc->add(array(
	"controller" => "index/confirmation",
	"url" => "confirmacao",
	"get" => array(
		array(
			0 => array("name" => "rt", "type" => "text")
		),
		array(
			0 => array("name" => "rt", "type" => "text"),
			1 => array("name" => "get", "type" => "array")
		)
	)
));

$rc->add(array(
	"controller" => "index/response_confirmation",
	"url" => "resposta-confirmacao",
	"get" => array(
		array(
			0 => array("name" => "rt", "type" => "text")
		),
		array(
			0 => array("name" => "rt", "type" => "text"),
			1 => array("name" => "get", "type" => "array")
		)
	)
));



$rc->load();
$objRegistro->rc = $rc;
