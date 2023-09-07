<?php
class indexModel extends baseModel{

	public function authenticate(){
		$objPost = new Variavel;
		$objPost->setTipo('post');
		$objPost->setCampos(
			array(
				'send'  => 'text',
				'remember' => 'text'
			)
		);
		$post = $objPost->getValores();
		
		if($post['send'] == "on"){

			$rememberme = ($post['remember'] == '1') ? 1 : 0 ;
			$this->load->administrador->setRememberMe($rememberme);

			$auth = $this->load->administrador->authenticateAccess();

			if($auth === 1)
				header("Location: " . $this->load->administrador->getPathUriValidation());
				
			return $auth;
			
		}

		return false;
	}

}
?>