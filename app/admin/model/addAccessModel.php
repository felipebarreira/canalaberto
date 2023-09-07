<?php
class addAccessModel extends baseModel{

	public function add(){

		$objPost = new Variavel;
		$objPost->setTipo('post');
		$objPost->setCampos(
			array(
				'send'  => 'text',
				'btEnviar'  => 'null',
				'btSalvar'  => 'null',
				'gi-nome'   => 'text',
				'gi-email'  => 'email',
				'gi-nivel'  => 'null',
				'gi-senha'  => 'gi-confirmasenha',
				'gi-confirmasenha'  => 'gi-senha'
			)
		);
		$post = $objPost->getValores();
		
		if($post['send'] == "on"){
			if(!is_array($objPost->valida())){
					
				$objAdministrador = new Administrador;
				$objAdministrador->setNome($post['gi-nome']);
				$objAdministrador->setEmail($post['gi-email']);
				$objAdministrador->setSenha($post['gi-senha']);
				$objAdministrador->setNivel(0);
				$objAdministrador->setTimeSession('02:30:00');
				$objAdministrador->setData(date("Y-m-d"));
				
				# validação pré-persistência
				if(Administrador::isFieldExisting("adm_email", $objAdministrador->getEmail()))
					return array("tipo-acao"=>"error", "msg-acao" => "E-mail em uso.", "det-acao" => "O e-mail cadastrado já está sendo utilizado por outro usuário.");
				
				$add = $objAdministrador->add();
				if($add)
				{
					$upload = $objAdministrador->uploadImage($_FILES['gifile']);

					$msg['tipo-acao'] = "sucess";
					$msg['msg-acao']  = "Usuário inserido";
					$msg['det-acao']  = "Usuário ".$objAdministrador->getNome()." foi inserido com sucesso.";
					if(is_string($upload)){ $msg['det-acao'] .= "<br/>". $upload; }
					
					if($post['btEnviar'] == ""){
						header("Location: ?rt=listAccess&tipo-acao=".$msg['tipo-acao']."&msg-acao=".urlencode($msg['msg-acao'])."&det-acao=".urlencode($msg['det-acao']));
					}
				}
				
			}else{
				$msg['tipo-acao'] = "error";
				$msg['msg-acao']  = "Aviso - Campos Obrigatórios";
				$msg['det-acao']  = "Todos os campos devem ser preenchidos corretamente.";
			}
			
			return $msg;
		}
	}

}
