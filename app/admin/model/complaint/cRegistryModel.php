<?php
class cRegistryModel extends baseModelList
{

	public $hasFilter = false;

	public function __construct($objRegistro)
	{
		$this->setRegistro($objRegistro);
		$this->filterValidation();
		$this->hasFilter();

		$busca = "";
		$gets  = $this->getGets();
		if (!empty($gets['busca']) && !empty($gets['opcao']))
			$busca = "&amp;busca=" . urlencode($gets['busca']) . "&amp;opcao=" . $gets['opcao'];

		$itensBusca = new ArrayList;

		$itensBusca->addToPos(0, array("nome" => "Token", "name" => "registry_key"));
		$itensBusca->addToPos(1, array("nome" => "Nome", "name" => "registry_name"));
		$itensBusca->addToPos(2, array("nome" => "E-mail", "name" => "registry_email"));


		$this->setItensBusca($itensBusca);
	}

	/*
	 LIST- QUERY, FILTERS AND VALIDATIONS
	 */
	private function hasFilter()
	{
		$gets  = $this->getGets();

		if (
			!empty($gets['busca']) && !empty($gets['opcao'])
		) {
			$this->hasFilter = true;
			return true;
		}

		return false;
	}

	public function getFilter()
	{
		$gets  = $this->getGets();
		return '&addClass=' . $gets['addClass'];
	}

	private function filterQuerySearch()
	{

		$gets   = $this->getGets();
		$search = null;

		# special filters

		# regular filter search
		if (!empty($gets['busca']) && !empty($gets['opcao']))
			$search = " and " . $gets['opcao::escape'] . " LIKE '%" . $gets['busca::escape'] . "%' ";


		return $search;
	}

	private function filterValidation()
	{

		$gets  = $this->getGets();

		return true;
	}

	private function filterByFields()
	{

		$gets  = $this->getGets();
		$where = ' and 1=1';

		return $where;
	}

	private function filterByInners()
	{

		$gets  = $this->getGets();
		$inner = '';

		return $inner;
	}

	public function setQuery($query = '')
	{

		$query = "Select *from tb_complaint_registry
					" . $this->filterByInners() . "
					where registry_status!=3 " . $this->filterByFields() . $this->filterQuerySearch();

		//echo $query; exit;
		$this->query = $query;
	}

	public function getWhereByFilters()
	{
		return "registry_status!=3 " . $this->filterByFields() . $this->filterQuerySearch();
	}

	##
	/*
	 CRUD - ADD/UPDATE/STATUS/DELETE
	 */

	public function getPost()
	{
		$objPost = new Variavel;
		$objPost->setTipo('post');
		$objPost->setCampos(
			array(
				'send'  => 'text',
				'btEnviar'  => 'null',
				'btSalvar'  => 'null',

				'response' => 'text',
				'status' => 'text'
			)
		);
		return $objPost;
	}

	private function formValidation()
	{

		$post 	  = $this->load->post;
		$msg 	  = array();
		$messages = array();


		if (count($messages)) {
			foreach ($messages as $message) {
				@$msg['det-acao'] .= $message . "<br />";
			}

			$msg['tipo-acao'] = "error";
			$msg['msg-acao'] = "Ops! Ocorreu um erro na validação do formulário";
		}

		return $msg;
	}

	public function update()
	{

		#
		$gets = $this->load->gets->getValores();
		$post = $this->load->post;

		$msg  = array();
		$this->load->registry = new \Complaint\Registry($gets['id-registry::escape']);

		if (!is_numeric($this->load->registry->getId()))
			header("Location: ?rt=cRegistry");


		if ($post['send'] != "on")
			return $msg;

		// validation
		$msg = $this->formValidation();
		if (count($msg) > 0)
			return $msg;


		$this->load->registry->setResponse(nl2br($post['response']));
		$this->load->registry->setStatus($post['status']);
		$this->load->registry->setUpdated(date('Y-m-d H:i:s'));

		# update action
		$up = $this->load->registry->update();
		if (!$up)
			return array("tipo-acao" => "erro", "msg-acao" => "Falha ao editar", "det-acao" => "Tente novamente ou contacte os administradores.");


		#
		header("Location: ?rt=cRegistry&tipo-acao=sucess&msg-acao=" . urlencode("Status atualizado com sucesso.") . "&det-acao=" . urlencode('Status do Registro ' . $this->load->registry->getKey() . ' atualizado com sucesso!'));
	}


	public function delete()
	{

		# load vars
		$gets = $this->load->gets->getValores();
		$obj = new \Complaint\Registry($gets['id-registry::escape']);

		try {

			# validation
			if (!is_numeric($obj->getId()))
				throw new exception("Registro não encontrado.");


			if (!$obj->delete())
				throw new exception("Não é possível excluir.");

			# return
			header("Location: ?rt=cRegistry&id-registry=" . $gets['id-registry'] . "&tipo-acao=sucess&msg-acao=" . urlencode("Registro removido") . "&det-acao=" . urlencode("Registro " . $obj->getKey() . " foi removido."));
		} catch (Exception $e) {
			header("Location: ?rt=cRegistry&id-registry=" . $gets['id-registry'] . "&tipo-acao=error&msg-acao=" . urlencode("Ocorreu um erro") . "&det-acao=" . urlencode($e->getMessage()));
		}
	}
}
