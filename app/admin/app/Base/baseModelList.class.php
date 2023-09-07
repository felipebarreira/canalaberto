<?php
class baseModelList extends baseModel
{

	protected $entity;
	protected $table;
	protected $order;
	protected $itensTabela;
	protected $itensBusca;
	protected $query;
	protected $filters;
	public $inner;


	/*
	* Methods default for listing
	*/

	public function getGets()
	{
		$objGet = $this->load->gets;
		return $objGet->getValores();
	}


	public function lista($condicao = "")
	{

		$gets = $this->getGets();

		$dao = new GenericDAO;
		$dao->setEntity($this->getEntity());
		$dao->setTable($this->getTable());

		$busca = "";
		$query = "";
		$limit = ($this->load->num != 0) ? ' LIMIT ' . $this->load->first . ', ' . $this->load->num : '';

		if (!empty($condicao) || (!empty($gets['busca']) && !empty($gets['opcao']))) {

			if (!empty($gets['busca']) && !empty($gets['opcao']) && $this->getQuery() == "") {
				if ($condicao == "") {
					$busca = " " . $gets['opcao::escape'] . " LIKE '%" . $gets['busca::escape'] . "%' ";
				} else {
					$busca = " and " . $gets['opcao::escape'] . " LIKE '%" . $gets['busca::escape'] . "%' ";
				}
			}

			if ($this->getInner() != "") {
				$query = $dao->getListInner("*", $this->getInner(), $condicao . $busca . " ORDER BY " . $this->getOrderBy($gets, $this->getOrder()) . $limit, "S");
			} elseif ($this->getQuery() != "") {
				$query = $dao->getQueryList($this->getQuery() . " ORDER BY " . $this->getOrderBy($gets, $this->getOrder()) . $limit);
			} else {
				$query = $dao->getList($condicao . $busca . " ORDER BY " . $this->getOrderBy($gets, $this->getOrder()) . $limit);
			}
		}

		if (!$query) {
			if ($this->getInner() != "") {
				$query = $dao->getListInner("*", $this->getInner(), " ORDER BY " . $this->getOrderBy($gets, $this->getOrder()) . $limit, "S");
			} elseif ($this->getQuery() != "") {
				$query = $dao->getQueryList($this->getQuery() . " ORDER BY " . $this->getOrderBy($gets, $this->getOrder()) . $limit);
			} else {

				if ($this->load->num != 0) {
					$query = $dao->getAll($this->load->first, $this->load->num, $this->getOrderBy($gets, $this->getOrder()));
				} else {
					$query = $dao->getAll("", "", $this->getOrderBy($gets, $this->getOrder()));
				}
			}
		}

		return $query;
	}


	public function total($condicao = "")
	{
		$gets = $this->getGets();

		$dao = new GenericDAO;
		$dao->setEntity($this->getEntity());
		$dao->setTable($this->getTable());

		$busca = "";
		$query = "";

		if (!empty($condicao) || (!empty($gets['busca']) && !empty($gets['opcao']))) {

			if (!empty($gets['busca']) && !empty($gets['opcao']) && $this->getQuery() == "") {
				if ($condicao == "") {
					$busca = " " . $gets['opcao::escape'] . " LIKE '%" . $gets['busca::escape'] . "%' ";
				} else {
					$busca = " and " . $gets['opcao::escape'] . " LIKE '%" . $gets['busca::escape'] . "%' ";
				}
			}

			if ($this->getInner() != "") {
				return $dao->getListInner("count(*) as contador", $this->getInner(), $condicao . $busca)->contador;
			} elseif ($this->getQuery() != "") {
				return $dao->getQueryList($this->getQuery())->size();
			} else {
				$count = $dao->getObject("count(*) as contador", $condicao . $busca);
				return (!is_object($count)) ? 0 : $count->contador;
			}
		}

		if (!$query) {
			if ($this->getInner() != "") {
				return $dao->getListInner("count(*) as contador", $this->getInner(), "", "S")->size();
			} elseif ($this->getQuery() != "") {
				return $dao->getQueryList($this->getQuery())->size();
			} else {
				return $dao->count();
			}
		}

		return $query;
	}


	public function valorBusca()
	{

		$gets  = $this->getGets();
		$itens = $this->getItensBusca();
		$value = "";

		if ($gets['opcao'] == "") {
			$arr = @$itens->get(0);
			$value = ($arr != "") ? $arr : "";
		} else {
			$value = ($gets['opcao'] != "") ? $gets['opcao'] : "";
		}
		return $value;
	}


	public function listaCamposOrdenacao()
	{

		$gets 		 = $this->getGets();
		$itensTabela = $this->getItensTabela();
		$busca 		 = $this->filters;

		if (!empty($gets['busca']) && !empty($gets['opcao']))
			$busca .= "&amp;busca=" . urlencode($gets['busca']) . "&amp;opcao=" . $gets['opcao'];

		if (is_numeric($gets['status']))
			$busca .= "&amp;status=" . $gets['status::escape'];

		if ($gets['orderc'] != "") {

			$gets['ordert'] = (empty($gets['ordert'])) ? "asc" : $gets['ordert'];

			for ($i = 0, $itens = $itensTabela->toArray(); $i < $itensTabela->size(); $i++) {
				if ($itens[$i]['name'] == $gets['orderc']) {
					$itens[$i]['img'] = ($gets['ordert'] == "desc") ? '<i class="fa fa-sort-amount-up" aria-hidden="true"></i>' : '<i class="fa fa-sort-amount-down" aria-hidden="true"></i>';
					$itens[$i]['link'] = ($gets['ordert'] == "desc") ? "orderc=" . $itens[$i]['name'] . "&amp;ordert=asc" . $busca : "orderc=" . $itens[$i]['name'] . "&amp;ordert=desc" . $busca;

					$itensTabela->addToPos($i, $itens[$i]);
				}
			}
		}
		return $itensTabela;
	}


	private function condicaoPaginacao($condicao = "")
	{
		$gets  = $this->getGets();
		$order = "";
		$busca = "";
		$gets['ordert'] = (empty($gets['ordert'])) ? "asc" : $gets['ordert'];

		if (!empty($gets['orderc'])) {
			$order = " ORDER BY " . $gets['orderc'] . " " . $gets['ordert'];
		}

		if (!empty($gets['busca']) && !empty($gets['opcao'])) {
			if ($condicao == "") {
				$busca = "where " . $condicao . $gets['opcao::escape'] . " LIKE '%" . $gets['busca::escape'] . "%' ";
			} else {
				$busca = " and " . $gets['opcao::escape'] . " LIKE '%" . $gets['busca::escape'] . "%' ";
			}
		}
		return $this->getTable() . " " . $condicao . $busca . $order;
	}


	private function linkPaginacao($rt)
	{
		$gets   = $this->getGets();
		$busca  = ($gets['busca'] != "") ? "busca=" . urlencode($gets['busca']) . "&amp;" : "";
		$opcao  = ($gets['opcao'] != "") ? "opcao=" . $gets['opcao'] . "&amp;" : "";
		$orderc = ($gets['orderc'] != "") ? "orderc=" . $gets['orderc'] . "&amp;" : "";
		$ordert = ($gets['ordert'] != "") ? "ordert=" . $gets['ordert'] . "&amp;" : "";

		return $rt . "&amp;" . $busca . $opcao . $orderc . $ordert . "page";
	}

	private function linkFriendlyPagination($rt)
	{
		$gets   = $this->getGets();
		$busca  = ($gets['busca'] != "") ? "" . urlencode($gets['busca']) . "/" : "";
		$opcao  = ($gets['opcao'] != "") ? "" . $gets['opcao'] . "/" : "";
		$orderc = ($gets['orderc'] != "") ? "" . $gets['orderc'] . "/" : "";
		$ordert = ($gets['ordert'] != "") ? "" . $gets['ordert'] . "/" : "";

		return $rt . "/" . $busca . $opcao . $orderc . $ordert;
	}

	public function pagination_feed($link, $condition = "", $friendly = 0, $numpag = 10)
	{

		$objConexao = Conexao::singleton();
		$dao = new GenericDAO;
		$dao->setEntity($this->getEntity());
		$dao->setTable($this->getTable());

		$condition = $this->condicaoPaginacao($condition);
		$link 	   = ($friendly) ? $this->linkFriendlyPagination($link) : $this->linkPaginacao($link);

		$num 	   = $this->load->num;
		$pagina    = $this->load->page;

		if ($this->getQuery() != "") {
			$total_usuarios = $dao->getQueryList($this->getQuery())->size();
		} else {
			list($total_usuarios) = $objConexao->fetchQueryCount($objConexao->select("COUNT(*)", $condition));
		}

		$total_paginas = $total_usuarios / $num;
		$prev  		   = $pagina - 1;
		$next   	   = $pagina + 1;
		$medianumpag   = $numpag / 2;

		$primeiro = $pagina - $medianumpag <= 0 ? 1 : $pagina - $medianumpag;
		$ultimo   = $pagina + $medianumpag > $total_paginas ? $total_paginas : $pagina + $medianumpag;

		$total_paginas = ceil($total_paginas);
		$ultimo		   = ceil($ultimo);
		$primeiro 	   = ceil($primeiro);
		$painel 	   = "";
		$space = ($friendly) ? '' : '=';

		if ($pagina > 1) {
			$prev_link = "<a href=\"" . $link . $space . $prev . "\" class=\"btn --white pagseta prev\"><i class=\"fas fa-angle-left\"></i></a><span class=\"paginacao__capsula\">";
		} else {
			$prev_link = "<a href=\"#\" class=\"btn --white --off pagseta none\"><i class=\"fas fa-angle-left\"></i></a><span class=\"paginacao__capsula\">";
		}
		if ($total_paginas > $pagina) {
			$next_link = "</span><a href=\"" . $link . $space . $next . "\" class=\"btn --white pagseta next\"><i class=\"fas fa-angle-right\"></i></a>";
		} else {
			$next_link = "</span><a href=\"#\" class=\"btn --white --off pagseta none\"> <i class=\"fas fa-angle-right\"></i> </a>";
		}

		if (((int)$ultimo - (int)$primeiro) != $numpag) {
			if ($total_paginas >= ($numpag + 1)) {
				if (((int)$ultimo - (int)$primeiro) < $numpag && $ultimo <= $numpag) {
					$ultimo = ($numpag + 1);
				} elseif (((int)$ultimo - (int)$primeiro) < $numpag && $ultimo > $numpag) {
					$primeiro = $ultimo - $numpag;
				}
			} else { //new since 02-07-2012
				$ultimo = $total_paginas;
				$primeiro = 1;
			}
		}

		for ($x = $primeiro; $x <= $ultimo; $x++) {
			if ($x == $pagina) {
				$painel .= "<a href=\"" . $link . $space . $x . "\" class=\"btn --one  selec\">$x</a>";
			} else {
				$painel .= "<a href=\"" . $link . $space . $x . "\" class=\"btn --one --border\">$x</a>";
			}
		}

		if (!empty($painel)) {
			return "$prev_link $painel $next_link";
		}
	}

	public function pagination($link, $condition = "", $friendly = 0, $numpag = 10)
	{

		$objConexao = Conexao::singleton();
		$dao = new GenericDAO;
		$dao->setEntity($this->getEntity());
		$dao->setTable($this->getTable());

		$condition = $this->condicaoPaginacao($condition);
		$link 	   = ($friendly) ? $this->linkFriendlyPagination($link) : $this->linkPaginacao($link);

		$num 	   = $this->load->num;
		$pagina    = $this->load->page;

		if ($this->getQuery() != "") {
			$total_usuarios = $dao->getQueryList($this->getQuery())->size();
		} else {
			list($total_usuarios) = $objConexao->fetchQueryCount($objConexao->select("COUNT(*)", $condition));
		}

		$total_paginas = $total_usuarios / $num;
		$prev  		   = $pagina - 1;
		$next   	   = $pagina + 1;
		$medianumpag   = $numpag / 2;

		$primeiro = $pagina - $medianumpag <= 0 ? 1 : $pagina - $medianumpag;
		$ultimo   = $pagina + $medianumpag > $total_paginas ? $total_paginas : $pagina + $medianumpag;

		$total_paginas = ceil($total_paginas);
		$ultimo		   = ceil($ultimo);
		$primeiro 	   = ceil($primeiro);
		$painel 	   = "";
		$space = ($friendly) ? '' : '=';

		if ($pagina > 1) {
			$prev_link = "<a href=\"" . $link . $space . $prev . "\" class=\"btn --white pagseta\"><i class=\"fa fa-angle-left\"></i></a><span class=\"paginacao__capsula\">";
		} else {
			$prev_link = "<a href=\"#\" class=\"btn --white --off pagseta none\"><i class=\"fa fa-angle-left\"></i></a><span class=\"paginacao__capsula\">";
		}
		if ($total_paginas > $pagina) {
			$next_link = "</span><a href=\"" . $link . $space . $next . "\" class=\"btn --white pagseta\"><i class=\"fa fa-angle-right\"></i></a>";
		} else {
			$next_link = "</span><a href=\"#\" class=\"btn --white --off pagseta none\"> <i class=\"fa fa-angle-right\"></i> </a>";
		}

		if (((int)$ultimo - (int)$primeiro) != $numpag) {
			if ($total_paginas >= ($numpag + 1)) {
				if (((int)$ultimo - (int)$primeiro) < $numpag && $ultimo <= $numpag) {
					$ultimo = ($numpag + 1);
				} elseif (((int)$ultimo - (int)$primeiro) < $numpag && $ultimo > $numpag) {
					$primeiro = $ultimo - $numpag;
				}
			} else { //new since 02-07-2012
				$ultimo = $total_paginas;
				$primeiro = 1;
			}
		}

		for ($x = $primeiro; $x <= $ultimo; $x++) {
			if ($x == $pagina) {
				$painel .= "<a href=\"" . $link . $space . $x . "\" class=\"btn --one selec\">$x</a>";
			} else {
				$painel .= "<a href=\"" . $link . $space . $x . "\" class=\"btn --one --border\">$x</a>";
			}
		}

		if (!empty($painel)) {
			return "$prev_link $painel $next_link";
		}
	}

	private function getOrderBy($gets, $default = "")
	{

		if (!empty($gets['orderc']) && !empty($gets['ordert'])) {
			return $gets['orderc'] . ' ' . $gets['ordert'];
		}
		return $default;
	}

	/*
	* Getters & Setters default for List classes
	*/

	public function getEntity()
	{
		return $this->entity;
	}

	public function getTable()
	{
		return $this->table;
	}

	public function getOrder()
	{
		return $this->order;
	}

	public function getInner()
	{
		return $this->inner;
	}

	public function getQuery()
	{
		return $this->query;
	}

	public function getItensTabela()
	{
		return $this->itensTabela;
	}

	public function getItensBusca()
	{
		return $this->itensBusca;
	}


	public function setEntity($entity)
	{
		$this->entity = $entity;
	}

	public function setTable($table)
	{
		$this->table = $table;
	}

	public function setOrder($order)
	{
		$this->order = $order;
	}

	public function setInner($inner)
	{
		$this->inner = $inner;
	}

	public function setQuery($query)
	{
		$this->query = $query;
	}

	public function setItensTabela($itensTabela)
	{
		$this->itensTabela = $itensTabela;
	}

	public function setItensBusca($itensBusca)
	{
		$this->itensBusca = $itensBusca;
	}
}
