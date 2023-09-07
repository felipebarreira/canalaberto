<script>
	$(document).ready(function(){

		/*
		$.confirm({
		    title: "Olá amigos",
		    type: 'blue'
		});
		*/

		$("section").on("click",".acao-editar",function(ev){
			ev.preventDefault();

			var $el = $(this);
			var url = $el.attr("href");

			$.magnificPopup.open({
				items: {
					src:  url+"&addClass=compact",
					type: 'iframe'
				},
				preloader: true,
				removalDelay: 50,
				mainClass: 'mfp-fade mfp-no-margins',
				callbacks : {
					close : function(){
						
					}
				}
			});

		});

	});
</script>

<div id="content-header">
	<h1 class="content-header__title"> <span class="ico"><i class="far fa-fw fa-cog"></i></span> Configurações <span class="content-header__subtitle">/ administradores</span> </h1>
</div>

<?php if(!empty($gets['tipo-acao']) && !empty($gets['msg-acao'])){?>
	<div class="mini-msg --sucess" data-ark-autohide="5000">
		<p>
			<i class="far fa-check"></i> <strong><?php echo $gets['msg-acao'];?></strong> <br>	
			<?php echo $gets['det-acao'];?>	
		</p>
	</div>
<?php }?>


<div class="row">

	<div class="col-md-3 order-md-12">
		<div class="list-aux">
			
			<form action="#" method="get" class="ark-form">
				<input type="hidden" name="rt" value="listAccess" />

				<fieldset>
					<legend class="dark">BUSCAR</legend>

					<div class="row">
						<div class="col-md-12">
							<label class="">
								<b class="">Palavra-chave</b>
								<input type="text" name="busca" placeholder="" value="<?php echo $valueBusca;?>" required >
							</label>	
						</div>
					<div class="col-md-12 list-wrap">
						<div class="list-wrap">	

							<?php for($i = 0, $itens = $itensBusca->toArray() ; $i < $itensBusca->size() ; $i++){?>
							<label>
								<input type="radio" name="opcao" value="<?php echo $itens[$i]['name']?>" <?php if($checked == $itens[$i]['name']){ echo 'checked="checked"'; }?> /> <?php echo $itens[$i]['nome']?>
							</label>
							<?php }?>
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
				<a href="?rt=addAccess" class="btn --one">Adicionar administrador</a>
			</div>
			<div class="main-bar__opts pull-right clearfix">
				<p class="main-bar__results">Exibindo <span><?php echo $first?>-<?php echo $numExibicao?></span> de <span><?php echo $total?></span></p>
				
				<div class="paginacao paginacao--main-bar">
					<?php echo $pagination;?>
				</div>
				<!--<a href="#" class="btn --white --border">...</a>-->
			</div>
		</div>

		<ul class="main-list">


			<?php for($i = 0 ; $i < $ladministrador->size() ; $i++){?>
			<!-- inicio :: card listagem -->
			<li class="main-list__card row no-gutter clearfix">
				<div class="main-list__header clearfix col-md-12">
					<p class="tit pull-left">

						<span class="round-avatar" style="background-color:silver">
							<?php if($ladministrador->get($i)->adm_image != '' && file_exists(Administrador::getPathPaste() .$ladministrador->get($i)->adm_image)){?>
							<img src="<?php echo Administrador::getDomainPaste() . $ladministrador->get($i)->adm_image;?>" alt="" />
							<?php }else{?>
							<img src="img/avatar_default.png" alt="" />
							<?php }?>
						</span>

						<?php echo $ladministrador->get($i)->adm_nome;?>
					</p>
					<div 
						class="main-list__bts pull-right" 
						data-ignite-confirm-label="Você deseja excluir o administrador %key% ?"
						data-ignite-confirm-config='{ "desc" : "Isso excluirá permanentemente o acesso desse usuário ao sistema." , "actionLabel" :  "Sim, desejo excluir esse administrador" }'
					>
						<a href="?rt=updateAccess&amp;id-administrador=<?php echo $ladministrador->get($i)->adm_id?>" class="btn --small --blue --border acao-editar"> <i class="far fa-edit"></i> Editar </a>
						<a href="?rt=removeAccess&amp;id-administrador=<?php echo $ladministrador->get($i)->adm_id?>" class="btn --small --red --border" data-ignite-confirm-key="<?php echo $ladministrador->get($i)->adm_nome;?>"> <i class="far fa-trash"></i> Excluir </a>
					</div>
				</div>
				<p class="col-md-5"><strong>E-mail:</strong><br> <?php echo $ladministrador->get($i)->adm_email;?><br> </p>
				<p class="col-md-4"><strong>Nível:</strong><br> <?php echo exibeNivel($ladministrador->get($i)->adm_nivel);?></p>
			</li>
			<!-- fim :: card listagem -->
			<?php } ?>

		</ul>

		<div class="paginacao paginacao--inferior">
				<?php echo $pagination;?>
		</div>

	</div>

</div>