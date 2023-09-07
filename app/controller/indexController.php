<?php
class indexController extends baseController
{

	public function init()
	{

		# gets
		$this->load->gets  = $this->load->gets->getValores();
		$this->load->template->gets = $this->load->gets;
	}

	public function index()
	{

		# load vars
		$this->init();
		$gets = $this->load->gets;

		# model
		$msg = ""; //$this->load->model->send_contact();

		$this->load->template->title 	   = "Canal Aberto" . " – " . NAMEPROJECT;
		$this->load->template->description = "";
		$this->load->template->keywords	   = "";
		$this->load->template->metatags	   = "";
		$this->load->template->pageClass   = "";

		$this->load->template->msg = $msg;



		# template
		$this->load->template->show('index');
	}

	public function confirmation()
	{

		# load vars
		$this->init();
		$gets = $this->load->gets;

		# model
		$msg = $this->load->model->send_contact();

		header('Location:' . HTTP_DOMAIN . 'resposta-confirmacao/?status=' . $msg['status'] . '&message=' . urlencode($msg['message']) . '&token=' . $this->load->registry->getKey());
	}

	public function response_confirmation()
	{

		# load vars
		$this->init();
		$gets = $this->load->gets;

		# model
		$this->load->registry = new \Complaint\Registry($gets['token']);

		# load template variables
		$this->load->template->title 	   = "Registro enviado! Canal Aberto" . " – " . NAMEPROJECT;
		$this->load->template->description = "";
		$this->load->template->keywords	   = "";
		$this->load->template->metatags	   = "";
		$this->load->template->pageClass   = "";

		$this->load->template->msg = array('status' => $gets['status'], 'message' => urldecode($gets['message']));
		$this->load->template->registry = $this->load->registry;

		# template
		if ($gets['status']) {
			$this->load->template->show('registro-confirmacao');
		} else {
			$this->load->template->show('erro-confirmacao');
		}
	}
}
