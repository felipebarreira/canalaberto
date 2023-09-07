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
}
