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
                            <h1>Canal Aberto</h1>
                            <?php if (is_numeric($registry->getId())) { ?><h2>PROTOCOLO: <?php echo $registry->getKey(); ?></h2><?php } ?>

                            <?php if (!is_numeric($registry->getId())) { ?>
                                <p style="margin-top: 20px;"> Protocolo informado não é válido. <br><br><br>
                                    <a href="<?php echo HTTP_DOMAIN; ?>" class="btn --one --lg --round"> <i class="far fa-long-arrow-left"></i> voltar </a>
                                </p>
                            <?php } else { ?>
                                <p>
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
                                    <?php echo $registry->getResponse(); ?>
                                </p>
                            <?php } ?>

                        </div>
                    </div>
                </div><!-- /.formoso-welcome -->

            </div>


        </main>



    </div><!-- /.all -->

</body>

</html>