	<div class="tituloFaixa">
		<h2><img src="img/preferencias_32.png" alt=""  />Preferências</h2>
		<!--<p class="bread">teste</p>-->
	</div>
	<div class="sublinksFaixa">
		<ul>
			<li><a href="?rt=logs" class="selec">preferências</a></li>
		</ul>
	</div>
	<?php if(!empty($msg['tipo-acao']) && !empty($msg['msg-acao'])){?>
		<div id="msg" class="<?php echo $msg['tipo-acao'];?>">
			<span id="msg-ico"></span>
			<p>
				<strong><?php echo $msg['msg-acao'];?></strong><br/>
				<?php echo $msg['det-acao'];?>	
			</p>
		</div>
	<?php }?>
    <br />
	
    <div id="encapForm">
		<div id="encapTabs">
			<ul>
				<li rel="prefs" class="selec">geral</li>
				<li rel="cms">cms</li>
				<li rel="auts">autorizações</li>
			</ul>
		</div>
		<form action="?rt=preferences" method="post">
			<div class="encapArea" rel="prefs">

				 <fieldset class="form" style="display: none;">
					<legend>Ligue-me</legend>

					<label>Modo automático:</label> 
					<select name="callme_status">
						<option value="1" <?php echo ($callme->status == 1) ? 'selected="selected"' : '' ;?>>Ligado</option>
						<option value="0" <?php echo ($callme->status != 1) ? 'selected="selected"' : '' ;?>>Desligado</option>
					</select>
					<br />

					<label>Retorno (manual):</label> <input type="text" name="callme_manual" class="" value="<?php echo $callme->when_manual;?>" />

				 </fieldset>
				 
				 <fieldset class="form">
					<legend>Ajustes</legend>
					<!--
					<label>Paginação em AJAX (beta):</label> 
					<input type="radio" name="ajax_pag" value="sim"/> <p class="eti">Sim</p>
					<input type="radio" name="ajax_pag" value="nao" id="radio2"/> <p class="eti">Não</p>
					-->
									
					<label>Tempo de login:</label> <input type="text" name="gi-timesession" class="horario" value="<?php echo $administrador->getTimeSession();?>" />
					<br/>
					
					<label>JSON:</label> 
					<textarea name="gi-preferencias" id="" cols="30" rows="10"><?php echo $administrador->getPreferencias();?></textarea>
					<br />

				 </fieldset>

			</div>
			 <div class="encapButtons">
				<input type="hidden" name="send" value="on" />
				<input type="submit" value="Salvar" />
				<input type="reset" value="Resetar preferências" class="botao claro" />
			 </div>
		</form>
	</div>