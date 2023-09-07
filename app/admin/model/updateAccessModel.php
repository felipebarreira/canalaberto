<?php
class updateAccessModel extends baseModel{

	public function update(){

		# load variaveis
		$objGet = $this->load->gets;
		$gets = $objGet->getValores();
		
		if(!is_numeric($this->load->objAdministrador->getId()))
			header("Location: ?rt=listAccess&tipo-acao=error&msg-acao=".urlencode("Não encontrado")."&det-acao=".urlencode("Usuário não encontrado."));

		$objPost = new Variavel;
		$objPost->setTipo('post');
		$objPost->setCampos(
			array(
				'send'  => 'text',
				'gi-nome'   => 'text',
				'gi-email'  => 'email',
			)
		);
		$post = $objPost->getValores();
		
		$objPostOp = new Variavel;
		$objPostOp->setTipo('post');
		$objPostOp->setCampos(
			array(
				'gi-senha' => 'gi-confirmasenha',
				'gi-confirmasenha' => 'gi-senha',
				'gi-nivel' => 'numeric',
			)
		);
		$postop = $objPostOp->getValores();
		
		if($post['send'] == "on"){
			$msg = array();
			if(!is_array($objPost->valida())){
				
				# validação pré-persistência
				if($post['gi-email'] != $this->load->objAdministrador->getEmail() && Administrador::isFieldExisting("adm_email", $post['gi-email']))
					return array("tipo-acao"=>"error", "msg-acao" => "E-mail em uso.", "det-acao" => "O e-mail cadastrado já está sendo utilizado por outro usuário.");
					
				
				$this->load->objAdministrador->setNome($post['gi-nome']);
				$this->load->objAdministrador->setEmail($post['gi-email']);
				$this->load->objAdministrador->setNivel($postop['gi-nivel']);
				
				if(!empty($postop['gi-senha']) && $postop['gi-senha'] == $postop['gi-confirmasenha']){
					
					if(strlen($postop['gi-senha']) < 6)
						return array("tipo-acao" => "error", "msg-acao" => "Senha fraca", "det-acao" => "A senha deve ter no mínimo 6 caracteres.");
				
					$this->load->objAdministrador->setSenha($postop['gi-senha']);
					$update = $this->load->objAdministrador->updateWithPassword();
					
				}else{
					if(!empty($postop['gi-senha']) && $postop['gi-senha'] != $postop['gi-confirmasenha'])
						return array("tipo-acao" => "error", "msg-acao" => "Senhas incompativeis", "det-acao" => "Senhas não correspondem.");
						
					$update = $this->load->objAdministrador->update();
				}
				
				$upload = $this->load->objAdministrador->uploadImage($_FILES['gifile']);


				# header
				//if($update != false || $upload != false){

					$msg['tipo-acao'] = "sucess";
					$msg['msg-acao']  = "Usuário editado";
					$msg['det-acao']  = "Usuário ".$this->load->objAdministrador->getNome()." foi editado com sucesso.";
					if(is_string($upload)){ $msg['det-acao'] .= "<br/>". $upload; }
				
					//header("Location: ?rt=listAccess&tipo-acao=".$msg['tipo-acao']."&msg-acao=".urlencode($msg['msg-acao'])."&det-acao=".urlencode($msg['det-acao']));
				//}
				
			}else{
				$msg['tipo-acao'] = "error";
				$msg['msg-acao']  = "Aviso - Campos Obrigatórios";
				$msg['det-acao']  = "Todos os campos devem ser preenchidos corretamente.";
			}
			return $msg;
		}
		return null;
	}
}
