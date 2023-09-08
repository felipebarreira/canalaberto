<script src="<?php echo HTTP_DOMAIN ?>js/modules/rdv.js"></script>
<script>
	$(document).ready(function() {
		Ignite.rdv.addRegistry.init();
	});
</script>

<div id="content-header">
	<h1 class="content-header__title"> <span class="ico"><i class="fas fa-fw fa-filter"></i></span> Registros <span class="content-header__subtitle">/ revisão registro <?php echo $registry->getKey(); ?></span> </h1>
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
		<legend>Geral</legend>

		<div class="row">
			<div class="col-md-12">
				<label class="">
					<b class="">Token</b>
					<input type="text" name="id" value="<?php echo $registry->getKey(); ?>" disabled>
				</label>
			</div>
		</div>

		<div class="row">
			<div class="col-md-6">
				<label class="">
					<b class="">Data cadastro</b>
					<input type="text" name="created" value="<?php echo $registry->getCreatedDateTime()->format('d/m/Y H:i:s'); ?>" disabled>
				</label>
			</div>

			<div class="col-md-6">
				<label>
					<b class="">IP</b>
					<input type="text" name="ip" value="<?php echo $registry->getIp(); ?>" disabled>
				</label>
			</div>
		</div>

		<div class="row">
			<div class="col-md-12">
				<label class="">
					<b class="">Mensagem</b><br><br>
					<?php echo html_entity_decode(stripslashes($registry->getMessage())); ?>
				</label>
			</div>
		</div>


	</fieldset>



</form>