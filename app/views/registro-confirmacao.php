<!DOCTYPE html>
<html lang="pt-br">

<head>
	<title><?php echo (!empty($title)) ? $title : NAMEPROJECT; ?></title>

	<!-- Meta -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="language" content="pt-br">

	<!-- Open Graph Protocol -->
	<meta property="og:title" content="<?php echo $title; ?>">
	<meta property="og:site_name" content="<?php echo NAMEPROJECT; ?>">
	<meta property="og:url" content="<?php echo HTTP_DOMAIN . substr($_SERVER['REQUEST_URI'], 1); ?>">
	<meta property="og:type" content="site">


	<!-- Fonts -->
	<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Open+Sans:ital,wght@0,300;0,400;0,700;1,400&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="<?php echo HTTP_DOMAIN; ?>fonts/fa/css/all.min.css">

	<!-- Favicon -->
	<link rel="shortcut icon" href="<?php echo HTTP_DOMAIN; ?>img/favicon.ico?v=<?php echo get_cache(); ?>" type="image/x-icon">
	<meta name="theme-color" content="#fff">
	<meta name="msapplication-navbutton-color" content="#fff">
	<meta name="apple-mobile-web-app-status-bar-style" content="#fff">

	<!-- CSS e Javascripts-->
	<link rel="stylesheet" href="<?php echo HTTP_DOMAIN; ?>css/vendor.css?v=<?php echo get_cache(); ?>" type="text/css">
	<link rel="stylesheet" href="<?php echo HTTP_DOMAIN; ?>css/colors.css?v=<?php echo get_cache(); ?>" type="text/css">
	<link rel="stylesheet" href="<?php echo HTTP_DOMAIN; ?>css/formoso.css?v=<?php echo get_cache(); ?>" type="text/css">
	<link rel="stylesheet" href="<?php echo HTTP_DOMAIN; ?>css/style.css?v=<?php echo get_cache(); ?>" type="text/css">

	<script src="<?php echo HTTP_DOMAIN; ?>js/vendor.js?v=<?php echo get_cache(); ?>"></script>
	<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
	<script src="<?php echo HTTP_DOMAIN; ?>js/plugins/detached/jquery.formoso-counter.js?v=<?php echo get_cache(); ?>"></script>
	<script src="<?php echo HTTP_DOMAIN; ?>js/formoso.js?v=<?php echo get_cache(); ?>"></script>

	<!-- JS internos -->
	<script type="text/javascript">
		var PROJECT = PROJECT || {};
		PROJECT.globals = {};
		PROJECT.globals.domain = "<?php echo HTTP_DOMAIN; ?>";
		PROJECT.globals.urlAdmin = "<?php echo HTTP_DOMAIN; ?>admin/";
		PROJECT.globals.sessaoTimer = 750;
	</script>

	<script>
		$(function() {
			$(".btn-abrir-denuncia").on("click", function() {
				$(".form-intro").slideUp();
				$(".form-denuncie").slideDown();
			});

			$(".btn-abrir-acompanhe").on("click", function() {
				$(".form-intro").slideUp();
				$(".form-acompanhe").slideDown();
			});
		});
	</script>

</head>

<body class="formoso --classe-do-form">

	<div class="formoso-all all">

		<header>
			<div class="wrap">
				<a href="<?php echo HTTP_DOMAIN; ?>"><img src="<?php echo HTTP_DOMAIN; ?>img/logo.png" alt="" class="formoso-logo"></a>
			</div>
		</header>

		<main class="clearfix">

			<div class="formoso-main --antique wrap form-intro">

				<div class="formoso-welcome">
					<div class="row justify-content-center">
						<div class="col-md-10">

							<div class="row align-items-center">
								<div class="col-md-4">
									<lottie-player src="https://assets2.lottiefiles.com/packages/lf20_68kgfqsn.json" background="transparent" speed="1" style="width: 100%; height: 260px;" autoplay></lottie-player>
								</div>
								<div class="col-md-6">
									<h1>Canal Aberto</h1>
									<h2>Seu relato foi registrado com sucesso!</h2>

									<h3 class="my-4">Protocolo: <?php echo $registry->getKey(); ?></h3>
									<p style="font-size: 2rem;">
										<strong>STATUS:</strong>
										<?php
										switch ($registry->getStatus()) {
											case 1: ?>
												<span class="pill --green">Concluído</span>
											<?php break;
											case 2: ?>
												<span class="pill --blue">Em análise</span>
											<?php break;
											case 0: ?>
												<span class="pill --orange">Aberto</span>
										<?php break;
										}
										?>

										<br><br>
										Uma notificação para a equipe gestora foi encaminhada, voce será notíficado via e-mail caso algo pertinente deva ser notificado ou acompanhe este chamado caso tenha registrado o relato anonimamente.
									</p>

									<p style="margin-top: 2rem;">
										<a href="<?php echo HTTP_DOMAIN; ?>" class="btn --one --round">Voltar</a>
									</p>
								</div>
							</div>



						</div>
					</div>
				</div><!-- /.formoso-welcome -->

			</div>


		</main>



	</div><!-- /.all -->

</body>

</html>