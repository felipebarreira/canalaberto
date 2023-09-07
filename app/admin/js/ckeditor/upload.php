<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Example: File Upload</title>
</head>
<body>
<?php

	// Required: anonymous function reference number as explained above.
	$funcNum = $_GET['CKEditorFuncNum'] ;
	// Optional: instance name (might be used to load a specific configuration file or anything else).
	$CKEditor = $_GET['CKEditor'] ;
	// Optional: might be used to provide localized messages.
	$langCode = $_GET['langCode'] ;
	// Optional: compare it with the value of `ckCsrfToken` sent in a cookie to protect your server side uploader against CSRF.
	// Available since CKEditor 4.5.6.
	$token = $_POST['ckCsrfToken'] ;

	setlocale(LC_ALL, NULL);
	setlocale(LC_ALL, 'pt_BR.UTF8');

	#
	# require settings
 	require ('../../../includes/config.php');
	require (PATH . PATH_ADMIN . '/app/Base/' . 'ClassLoader.class.php');
	require (PATH . PATH_ADMIN . '/includes/app-config.php');
	require (PATH . PATH_ADMIN . '/includes/app-version.php');
	session_start();

	# instantiating classes
	$objConexao = Conexao::singleton();
	$objConexao->setDatabase(DB_NAME);
	$objConexao->setUser(DB_USER);
	$objConexao->setPassword(DB_PASSWORD);
	$objConexao->setHost(DB_HOST);
	$objConexao->init();
	//$objConexao->setDebug(true);
	
	$authenticatedFields = array(
		"id" 		=> "adm_id",
		"salt" 		=> "adm_salt",
		"time"		=> "adm_timesession",
		"login" 	=> array(0 => "ginga-login", 1 => "adm_email"),
		"pass" 		=> array(0 => "ginga-password", 1 => "adm_senha")
	);
	$objAdministrador = new Administrador;
	$objAdministrador->setPrefix("ignite");
	$objAdministrador->setRememberMeCookieName('igniterememberme');
	$objAdministrador->setFields($authenticatedFields);
	$objAdministrador->setPathUriValidation(HTTP_DOMAIN . PATH_ADMIN);
	$objAdministrador->getObject(base64_decode(@$_SESSION['iduser']));

	# validate login
	$objAdministrador->isAuthenticated();

	# CK EDITOR upload
	\CKEditor\CKEditorUpload::setPathPaste(PATH . "uploads/eimages/");
	\CKEditor\CKEditorUpload::setDomainPaste(HTTP_DOMAIN . "uploads/eimages/");
	\CKEditor\CKEditorUpload::$persistImage = false;

	$upload = new \CKEditor\CKEditorUpload();
	$message = $upload->uploadImage($_FILES['upload']);
	$message = ($message) ? 'Upload da imagem realizado!' : $message ;

	
	echo "<script type='text/javascript'>window.parent.CKEDITOR.tools.callFunction('".$funcNum."', '".\CKEditor\CKEditorUpload::getDomainPaste() . $upload->getImage()."', '".$message."');</script>";
?>
</body>
</html>