<?php
Class error404Controller Extends baseController{

	public function index(){
	
		$this->load->template->msg_erro = 'Erro 404';
		$this->load->template->show('error404');
		
	}

}
?>
