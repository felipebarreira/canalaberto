<?php
	# APP :: version status
	define("IGNITE_VERSION", "1.0");

	# APP :: session
	$params = session_get_cookie_params();
	
	session_set_cookie_params(
		$params["lifetime"],
		$params["path"],
		((DOMAIN === 'localhost') ? '' : DOMAIN),
		$params["secure"],
		$params["httponly"]
	);
	$nameproject =  str_replace(" ", "-", str_replace("&", "e", strtolower(NAMEPROJECT)));
	session_name($nameproject);
