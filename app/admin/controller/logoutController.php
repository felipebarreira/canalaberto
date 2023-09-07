<?php
Class logoutController Extends baseController{

	public function index(){
		
		# logout
		$this->load->administrador->destroyAccess(true);
	
	}
	
}
?>