<div id="content-header">
	<h1 class="content-header__title"> <span class="ico"><i class="far fa-fw fa-cog"></i></span> Configurações <span class="content-header__subtitle">/ adicionar administrador</span> </h1>
</div>

<?php if (!empty($msg['tipo-acao']) && !empty($msg['msg-acao'])) { ?>

	<div class="mini-msg --<?php echo $msg['tipo-acao']; ?>" data-ark-autohide="5000">
		<p>
			<i class="far fa-check"></i> <strong><?php echo $msg['msg-acao']; ?></strong> <br>
			<?php echo $msg['det-acao']; ?>
		</p>
	</div>
<?php } ?>

<form action="#" method="post" class="ark-form" enctype="multipart/form-data">

	<fieldset>
		<legend>Informações pessoais</legend>

		<div class="row">
			<div class="col-md-12">
				<label class="">
					<b class="">Nome</b>
					<input type="text" name="gi-nome" value="" placeholder="Nome completo" required>
				</label>
			</div>
			<div class="col-md-6">
				<label class="">
					<b class="">E-mail</b>
					<input type="email" name="gi-email" value="" placeholder="Escreva seu email" required>
				</label>
			</div>
			<div class="col-md-6">
				<label>
					<b class="">Foto de perfil</b>
					<input type="file" name="gifile">
				</label>
			</div>
		</div>
	</fieldset>

	<fieldset>
		<legend>Credenciais de acesso</legend>

		<div class="row">
			<div class="col-md-6">
				<label class="">
					<b class="">Senha</b>
					<input type="password" class="medium" name="gi-senha">
				</label>
			</div>
			<div class="col-md-6">
				<label>
					<b class="">Confirmar senha</b>
					<input type="password" class="medium" name="gi-confirmasenha">
				</label>
			</div>
		</div>
	</fieldset>

	<p class="button-bar">
		<input type="hidden" name="send" value="on" />
		<button class="btn --lg --one">Salvar</button>
	</p>
</form>