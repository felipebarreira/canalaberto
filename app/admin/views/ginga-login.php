<!DOCTYPE html>
<html lang="pt-br">

<head>
    <title><?php echo NAMEPROJECT; ?></title>

    <!-- Meta -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="language" content="pt-br">
    <link rel="icon" href="<?php echo HTTP_DOMAIN; ?>admin/img/favicon.ico">

    <!-- CSS e Javascripts-->
    <link rel="stylesheet" href="<?php echo HTTP_DOMAIN; ?>admin/css/vendor.css?v=23102019" type="text/css">
    <link rel="stylesheet" href="<?php echo HTTP_DOMAIN; ?>admin/css/colors.css?v=23102019" type="text/css">
    <link rel="stylesheet" href="<?php echo HTTP_DOMAIN; ?>admin/css/core.css?v=23102019" type="text/css">
    <link rel="stylesheet" href="<?php echo HTTP_DOMAIN; ?>admin/css/style.css?v=23102019" type="text/css">
    <link rel="stylesheet" href="<?php echo HTTP_DOMAIN; ?>admin/fonts/fa/css/all.min.css?v=23102019" type="text/css">

    <script src="<?php echo HTTP_DOMAIN; ?>admin/js/vendor.js?v=23102019"></script>
    <script src="<?php echo HTTP_DOMAIN; ?>admin/js/modules/login.js?v=23102019"></script>

    <script>
        var IGNITE = IGNITE || {};
        IGNITE.globals = {};
        IGNITE.globals.domain = "<?php echo HTTP_DOMAIN; ?>";
        IGNITE.globals.urlAdmin = "<?php echo HTTP_DOMAIN; ?>admin/";
        IGNITE.globals.sessaoTimer = 75;
    </script>


    <!-- Headers adicionais do projeto -->
    <?php setlocale(LC_ALL, "ptb"); ?>
</head>

<body id="login-body">

    <div id="login-container">

        <div id="login" class="login">
            <div class="login__dados">
                <div class="login__dadoswrap">
                    <form method="post" action="<?php echo HTTP_DOMAIN; ?>admin/?login=ginga" class="ark-form" id="form-login">

                        <p class="login__logo">
                            <img src="<?php echo HTTP_DOMAIN; ?>admin/img/logo.png" alt="">
                        </p>


                        <div class="row">

                            <?php if (!empty($mensagem)) { ?>
                                <div class="col-md-12" class="erro" data-ark-autohide="5000">
                                    <div class="mini-msg --error">
                                        <p>
                                            <strong>Não foi possível logar</strong><br>
                                            <?php echo $mensagem; ?>
                                        </p>
                                    </div>
                                </div>
                            <?php } ?>

                            <div class="col-md-12">
                                <label>
                                    <b>Usuário</b>
                                    <input type="text" name="ginga-login" class="campo-login" id="login-usuario" required>
                                </label>
                            </div>
                            <div class="col-md-12">
                                <label>
                                    <b>Senha</b>
                                    <input type="password" name="ginga-password" class="campo-login" id="login-senha" required>
                                </label>
                            </div>
                            <div class="col-md-6">
                                <label class="">
                                    <input type="checkbox" name="remember" value="1" id="login-lembrar">
                                    Lembrar-me neste dispositivo
                                </label>
                            </div>
                            <div class="col-md-6">
                                <input type="hidden" name="send" value="on">

                                <p class="login__bts">
                                    <button type="submit" class="btn --one --lg --block"><i class="far fa-fw fa-sign-in" aria-hidden="true"></i> Logar</button>
                                    <!--<a href="?rt=index/recovery">Esqueci minha senha</a>-->
                                </p>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="login__outdoor">
                <p class="login__bemvindo">
                    Bem-vindo ao admin <br>
                    <strong><?php echo NAMEPROJECT; ?></strong>
                </p>


            </div>
        </div>

    </div>



</body>

</html>