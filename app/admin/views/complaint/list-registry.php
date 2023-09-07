<script>
	$(document).ready(function() {

		$("section").on("click", ".acao-ver", function(ev) {
			ev.preventDefault();

			var $el = $(this);
			var url = $el.attr("href");

			$.magnificPopup.open({
				items: {
					src: url + "&addClass=compact",
					type: 'iframe'
				},
				preloader: true,
				removalDelay: 50,
				mainClass: 'mfp-fade mfp-no-margins',
				callbacks: {
					close: function() {

					}
				}
			});

		});

	});
</script>
<style>
	.main-list--rdvApproval .insignia-rdv {
		margin: 0;
	}
</style>


<div id="content-header">
	<h1 class="content-header__title"> <span class="ico"><i class="fas fa-fw fa-filter"></i></span> Registros <span class="content-header__subtitle">/ consultar meus registros</span> </h1>
</div>

<?php if (!empty($gets['tipo-acao']) && !empty($gets['msg-acao'])) { ?>
	<div class="mini-msg --<?php echo $gets['tipo-acao']; ?>" data-ark-autohide="5000">
		<p>
			<i class="far fa-check"></i> <strong><?php echo $gets['msg-acao']; ?></strong> <br>
			<?php echo $gets['det-acao']; ?>
		</p>
	</div>
<?php } ?>


<div class="row">

	<div class="col-md-3 order-md-12">
		<div class="list-aux">

			<form action="#" method="get" class="ark-form">
				<input type="hidden" name="rt" value="<?php echo $gets['rt']; ?>" />

				<fieldset>
					<legend class="dark">BUSCAR</legend>

					<div class="row">
						<div class="col-md-12">
							<label class="">
								<b class="">Palavra-chave</b>
								<input type="text" name="busca" placeholder="" value="<?php echo $valueBusca; ?>">
							</label>
						</div>
						<div class="col-md-12 list-wrap">
							<div class="list-wrap">

								<?php for ($i = 0, $itens = $itensBusca->toArray(); $i < $itensBusca->size(); $i++) { ?>
									<label>
										<input type="radio" name="opcao" value="<?php echo $itens[$i]['name'] ?>" <?php if ($checked == $itens[$i]['name']) {
																														echo 'checked="checked"';
																													} ?> /> <?php echo $itens[$i]['nome'] ?>
									</label>
								<?php } ?>
							</div>
						</div>
					</div>

				</fieldset>
				<p>
					<button class="btn --black --border --small">Filtrar</button>
				</p>
			</form>
		</div>
	</div>


	<div class="col-md-9 order-md-1">

		<div class="main-bar clearfix">
			<div class="main-bar__bts pull-left clearfix">

			</div>
			<div class="main-bar__opts pull-right clearfix">
				<p class="main-bar__results">Exibindo <span><?php echo $first ?>-<?php echo $numExibicao ?></span> de <span><?php echo $total ?></span></p>

				<div class="paginacao paginacao--main-bar">
					<?php echo $pagination; ?>
				</div>
				<!--<a href="#" class="btn --white --border">...</a>-->
			</div>
		</div>

		<ul class="main-list">


			<?php for ($i = 0; $i < $list->size(); $i++) {
				$registry = new \Complaint\Registry($list->get($i)->registry_id);
				$template->registry = $registry;
			?>
				<!-- inicio :: card listagem -->
				<li class="main-list__card main-list--rdvApproval no-gutter clearfix">
					<div class="main-list__header clearfix col-md-12">
						<p class="tit pull-left">
							<?php echo $list->get($i)->registry_key; ?>

							<?php

							switch ($list->get($i)->registry_status) {
								case 1: ?>
									<span class="pill --green --small">Concluído</span>
								<?php break;
								case 2: ?>
									<span class="pill --blue --small">Em andamento</span>
								<?php break;
								case 0: ?>
									<span class="pill --orange --small">Aberto</span>
							<?php break;
							}
							?>

						</p>

						<div class="main-list__bts pull-right">

						</div>
					</div>


					<?php if ($registry->getName() != "") { ?><p class="col-md-2"><strong>Nome:</strong><br> <?php echo $registry->getName(); ?><br> </p><?php } ?>
				</li>
				<!-- fim :: card listagem -->
			<?php } ?>

		</ul>

		<div class="paginacao paginacao--inferior">
			<?php echo $pagination; ?>
		</div>

	</div>

</div>