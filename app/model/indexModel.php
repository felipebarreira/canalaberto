<?php
class indexModel extends baseModel
{


	public function getPost()
	{
		$objPost = new Variavel;
		$objPost->setTipo('post');
		$objPost->setCampos(
			array(
				'send' => 'text',
				'response' => 'text',
				'name' => 'text',
				'email' => 'email',
				'content' => 'null',
				'writing' => 'null'
			)
		);

		return $objPost;
	}

	#
	private function formValidation()
	{

		$objPost = $this->getPost();
		$post 	 = $objPost->getValores();
		$messages = array();

		if ($post['content'] == '') array_push($messages, 'Campo: Mensagem não preenchido');

		if ($post['email'] != "") {
			if (!preg_match('/^[a-zA-Z0-9_\.\-\+]+([.][a-zA-Z0-9_]+)*[@][a-zA-Z0-9_\.\-]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,120}$/', $post['email']))
				array_push($messages, 'Campo: E-mail inválido');
		}

		return $this->returnMessages($messages);
	}

	private function returnMessages(array $messages, $status = 0)
	{

		$msg = array();

		if (count($messages)) {
			foreach ($messages as $message) {
				@$msg['message'] .= $message . "<br />";
			}

			$msg['status'] = $status;
		}

		return $msg;
	}

	public function send_contact()
	{

		# vars
		$objPost = $this->getPost();
		$post 	 = $objPost->getValores();

		$msg	 = array("status" => 0, "message" => "");

		$registry = new \Complaint\Registry();
		$this->load->registry = $registry;

		if ($post['send'] == "on") {

			$msg = $this->formValidation();
			if (count($msg) > 0)
				return $msg;

			#
			$registry->setKey(\Complaint\Registry::generateKey());
			$registry->setName($post['name']);
			$registry->setEmail($post['email']);
			$registry->setMessage(nl2br($post['content']));
			$registry->setStatus(0);
			$registry->setResponse("");
			$registry->setBucket("system");
			$registry->setData("");
			$registry->setIp($_SERVER['REMOTE_ADDR']);
			$registry->setUseragent($_SERVER['HTTP_USER_AGENT']);
			$registry->setUpdated(date('Y-m-d H:i:s'));
			$registry->setCreated(date('Y-m-d H:i:s'));

			$add = $registry->add();

			if (!$add)
				return array("status" => 0, "message" => "Ocorreu um erro ao registrar a denúncia");

			$msg = array("status" => 1, "message" => "Cadastro realizado");
		}

		return $msg;
	}
}
