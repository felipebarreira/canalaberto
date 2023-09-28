<div id="content-header">
	<h1 class="content-header__title"> <span class="ico"><i class="far fa-fw fa-cog"></i></span> Configurações <span class="content-header__subtitle">/ logs</span> </h1>
</div>




<div class="row">

	<div class="col-md-3 order-md-12">

		<div class="mini-msg --info">
			<p>
				<i class="far fa-info-circle"></i> <strong>Sobre os LOGs de sistema</strong>
				<br />
				Todas as ações realizadas dentro da painel administrativo são salvas e armazenadas como LOGs de sistema. Os LOGs são utéis para analisar a autoria de eventos dentro do sistema.<br /><br />
				Com os LOGs, também é possível auxiliar no processo de suporte, feito pela equipe de desenvolvimento, quando alguma eventualidade acontecer, pois será possível detectar as alterações feitas na base de dados.
			</p>
		</div>

		<div class="list-aux">

			<form action="#" method="get" class="ark-form">
				<input type="hidden" name="rt" value="logs" />

				<fieldset>
					<legend class="dark">BUSCAR</legend>

					<div class="row">
						<div class="col-md-12">
							<label class="">
								<b class="">Palavra-chave</b>
								<input type="text" name="busca" placeholder="" value="<?php echo $valueBusca; ?>" required>
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

		<?php if (!empty($gets['tipo-acao']) && !empty($gets['msg-acao'])) { ?>
			<div class="mini-msg --sucess" data-ark-autohide="5000">
				<p>
					<i class="far fa-check"></i> <strong><?php echo $gets['msg-acao']; ?></strong> <br>
					<?php echo $gets['det-acao']; ?>
				</p>
			</div>
		<?php } ?>

		<div class="main-bar clearfix">
			<div class="main-bar__bts pull-left clearfix">
				<!--<a href="?rt=addAccess" class="btn --one">adicionar</a>-->
			</div>
			<div class="main-bar__opts pull-right clearfix">
				<p class="main-bar__results">Exibindo <span><?php echo $first ?>-<?php echo $numExibicao ?></span> de <span><?php echo $total ?></span></p>

				<div class="paginacao paginacao--main-bar">
					<?php echo $pagination; ?>
				</div>
				<!--<a href="#" class="btn --white --border">...</a>-->
			</div>
		</div>

		<table id="listagem" class="ark-table --zebra --border --lighthead --hover" width="100%" cellpadding="0">
			<thead>
				<tr>
					<?php for ($i = 0, $itens = $campos->toArray(); $i < $campos->size(); $i++) { ?>
						<th <?php echo ($itens[$i]["name"] == "log_operacao") ? "style='width: 40%;'" : ""; ?>><a href="?rt=logs&amp;<?php echo $itens[$i]['link'] ?>"><?php echo $itens[$i]['tit'] . $itens[$i]['img']; ?></a></th>
					<?php } ?>
				</tr>
			</thead>
			<tbody>
				<?php for ($i = 0; $i < $loglist->size(); $i++) { ?>
					<tr>
						<td style="width: 15%;"><?php echo $loglist->get($i)->log_entidade; ?></td>
						<td style="width: 40%;"><?php echo @htmlentities($loglist->get($i)->log_operacao); ?></td>
						<td style="width: 10%;"><?php echo $loglist->get($i)->log_entidadeLogin; ?></td>
						<td style="width: 10%;"><?php echo $loglist->get($i)->adm_nome; ?></td>
						<td style="width: 10%;"><?php echo $loglist->get($i)->log_ip; ?></td>
						<td style="width: 10%;"><?php echo $loglist->get($i)->log_data; ?></td>
					</tr>
				<? }	?>
			</tbody>
		</table>

		<div class="paginacao paginacao--inferior">
			<?php echo $pagination; ?>
		</div>

	</div>

</div>