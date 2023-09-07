<?php
class indexController extends baseController
{

	public function index()
	{

		try {

			if ($this->load->status == false) {
				$authenticate = $this->load->model->authenticate();
				throw new Exception($authenticate);
			}

			$this->load->template->administrador = $this->load->administrador;

			header('Location: ?rt=cRegistry');
			exit;
		} catch (Exception $e) {
			$this->load->template->mensagem = (is_string($e->getMessage())) ? $e->getMessage() : "";
			$this->load->template->show('ginga-login');
		}
	}

	public function status()
	{

		$session = $this->load->administrador->getSession();
		$prefix  = $this->load->administrador->getPrefix();

		$status = array();
		$status['efetuarLogout'] = (@$session[$prefix . 'timeleft'] != 0) ? false : true;
		$status['novoTimer'] 	 = @$session[$prefix . 'timeleft'];

		$status = json_encode($status);
		echo $status;
	}
}
