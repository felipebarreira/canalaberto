<!DOCTYPE html>
<html lang="pt-br">

<head>
	<title><?php echo NAMEPROJECT; ?> <?php echo (@$title != "") ? ":: " . @$title : ""; ?></title>

	<!-- Meta -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="language" content="pt-br">
	<link rel="icon" href="<?php echo HTTP_DOMAIN; ?>admin/img/favicon.ico?v=05112019">

	<!-- CSS e Javascripts-->
	<link rel="stylesheet" href="<?php echo HTTP_DOMAIN; ?>admin/css/vendor.css?v=05112019" type="text/css">
	<link rel="stylesheet" href="<?php echo HTTP_DOMAIN; ?>admin/css/colors.css?v=05112019" type="text/css">
	<link rel="stylesheet" href="<?php echo HTTP_DOMAIN; ?>admin/css/core.css?v=05112019" type="text/css">
	<link rel="stylesheet" href="<?php echo HTTP_DOMAIN; ?>admin/css/style.css?v=05112019" type="text/css">
	<link rel="stylesheet" href="<?php echo HTTP_DOMAIN; ?>admin/fonts/fa/css/all.min.css?v=05112019" type="text/css">

	<script src="<?php echo HTTP_DOMAIN; ?>admin/js/vendor.js?v=05112019"></script>

	<script src="<?php echo HTTP_DOMAIN; ?>admin/js/ckeditor/ckeditor.js"></script>
	<script src="<?php echo HTTP_DOMAIN; ?>admin/js/ckeditor/adapters/jquery.js"></script>

	<script src="<?php echo HTTP_DOMAIN; ?>admin/js/core.js?v=05112019"></script>

	<script>
		var IGNITE = IGNITE || {};
		IGNITE.globals = {};
		IGNITE.globals.domain = "<?php echo HTTP_DOMAIN; ?>";
		IGNITE.globals.urlAdmin = "<?php echo HTTP_DOMAIN; ?>admin/";
		IGNITE.globals.sessaoTimer = 750;
	</script>

	<!-- Headers adicionais do projeto -->
	<?php setlocale(LC_ALL, "ptb"); ?>
</head>

<body class=" loading <?php
						echo (!empty($gets['addClass'])) ? $gets['addClass'] . ' ' : '';
						?>">

	<div id="container">
		<header>
			<div id="header-logo">
				<a href="<?php echo HTTP_DOMAIN; ?>"><img src="<?php echo HTTP_DOMAIN; ?>admin/img/logo.png" alt="<?php echo NAMEPROJECT; ?>" title="<?php echo NAMEPROJECT; ?>"></a>
			</div>

			<div id="header-tools" class="header-tools">
				<div class="header-tools__collap-side">
					<a href="#"><span></span><span></span><span></span></a>
				</div>
			</div>

			<div id="header-search"></div>

			<div id="header-notif" class="header-notif">
				<div class="header-notif__icons">
					<div id="header-notif__avatar" class="header-notif__avatar">
						<p>
							<img src="<?php echo $administrador->getImagePath(); ?>" class="">
							<?php echo $administrador->getNome(); ?>
							<i class="far fa-fw fa-angle-down"></i>
						</p>
						<div id="header-menu" class="header-menu">
							<ul>
								<li class="logout">
									<a href="?rt=logout" title="Sair"><span><i class="far fa-power-off"></span></i></a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</header>

		<div class="menu-responsive" id="bt-menu-responsive">
			<a href="#"><span></span><span></span><span></span></a>
		</div>

		<main class="clearfix">
			<aside>
				<?php $template->show('menu'); ?>
			</aside>

			<div id="mobile-curtain"></div>

			<section id="content">