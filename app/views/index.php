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
	<meta property="og:image" content="<?php echo HTTP_DOMAIN . 'img/ogimage.png'; ?>">


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
	<script src="<?php echo HTTP_DOMAIN; ?>js/plugins/detached/jquery.formoso-counter.js?v=<?php echo get_cache(); ?>"></script>
	<script src="<?php echo HTTP_DOMAIN; ?>js/formoso.js?v=<?php echo get_cache(); ?>"></script>

	<!-- JS internos -->
	<script type="text/javascript">
		var PROJECT = PROJECT || {};
		PROJECT.globals = {};
		PROJECT.globals.domain = "<?php echo HTTP_DOMAIN; ?>";
		PROJECT.globals.sessaoTimer = 1500;
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
							<h1>Canal Aberto</h1>
							<h2>Bem vindo</h2>
							<p>
								Este canal foi criado para incentivar a governança nas relações entre os clientes e empresas.
								<br><br>
								Portanto é sua responsabilidade as informações aqui relatadas, portanto, é importante verificar se a situação se refere a um tema diretamente relacionadas ao contexto; caso positivo, nos seja informado o maior número de detalhes, para que as ações necessárias possam ser devidamente transmitidas.

							</p>


							<div class="row" style="padding: 4rem 0 0 0;">
								<div class="col-md-12">
									<button class="btn --one --block --giant --round btn-abrir-denuncia"> <i class="fal fa-bullhorn"></i> Faça seu relato</button>
								</div>
							</div>
						</div>
					</div>
				</div><!-- /.formoso-welcome -->

			</div>

			<div class="formoso-main --antique form-denuncie wrap" style="padding-top: 2rem;display:none;">

				<div class="formoso-welcome">
					<div class="row justify-content-center">
						<div class="col-md-10">
							<h1>Canal Aberto</h1>
							<h2>Envie seu relato</h2>
						</div>
					</div>
				</div><!-- /.formoso-welcome -->

				<div class="formoso-items" style="">

					<?php if (!empty($msg['tipo-acao']) && !empty($msg['msg-acao'])) { ?>
						<div class="mini-msg --<?php echo $msg['tipo-acao']; ?>" data-ark-autohide="5000">
							<p>
								<i class="far fa-check"></i> <strong><?php echo $msg['msg-acao']; ?></strong> <br>
								<?php echo $msg['det-acao']; ?>
							</p>
						</div>
					<?php } ?>

					<form action="<?php echo HTTP_DOMAIN . 'confirmacao'; ?>" method="post" id="form-contato" class="ark-form" enctype="multipart/form-data" data-ark-form data-ark-validate>


						<div class="formoso-item">
							<div class="row">
								<div class="col-md-12">
									<div class="mini-msg --warn --alt --small">
										<p><strong><i class="far fa-user-secret"></i> Você não precisa se identificar</strong><br>Você pode informar seu nome e e-mail para acompanhar seu relato, porém, você também pode fazer seu relato de forma anônima e receber um protocolo de acompanhamento.</p>
									</div>
								</div>
							</div>
							<div class="row justify-content-between">
								<div class="col-md-6">
									<label><b>Nome</b> <br>
										<input type="text" name="name" placeholder="opcional" value="">
									</label>
								</div>
								<div class="col-md-6">
									<label><b>E-mail</b> <br>
										<input type="text" name="email" placeholder="opcional" value="">
									</label>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12">
									<label>
										<b>Faça seu relato</b>
										<textarea name="content" id="" cols="30" rows="10" placeholder="Descreva seu relato em detalhes." required></textarea>
									</label>
								</div>
							</div>
						</div>


						<div class="formoso-end" style="padding-top: 0;">
							<div class="row justify-content-center">
								<div class="col-md-12">
									<input type="hidden" name="send" value="on">
									<!--<h3>Pronto para enviar?</h3>-->
									<button class="btn --one --giant --block g-recaptcha">Enviar mensagem <i class="far fa-long-arrow-right"></i></button>
								</div>
							</div>
						</div><!-- /.formoso-end -->


					</form>
				</div><!-- /.formoso-items -->
			</div><!-- /.formoso-container -->



		</main>



	</div><!-- /.all -->

</body>

</html>