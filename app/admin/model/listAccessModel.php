<?php
class listAccessModel extends baseModelList{

	public function __construct($objRegistro){
		$this->setRegistro($objRegistro);
		
		$busca = "";
		$gets  = $this->getGets();
		if(!empty($gets['busca']) && !empty($gets['opcao']))
			$busca = "&amp;busca=".urlencode($gets['busca'])."&amp;opcao=".$gets['opcao'];
		
		
		$itensBusca = new ArrayList;
		
			$itensBusca->addToPos(0, array("nome" => "Nome" , "name" => "adm_nome"));
			$itensBusca->addToPos(1, array("nome" => "E-mail" , "name" => "adm_email"));

			
		$itensTabela = new ArrayList;
		
			$itensTabela->addToPos(0, array("tit" => "Nome" , "img" => '', "link" => 'orderc=adm_nome&amp;ordert=asc'.$busca , "name" => "adm_nome"));
			$itensTabela->addToPos(1, array("tit" => "E-mail" , "img" => '', "link" => 'orderc=adm_email&amp;ordert=asc'.$busca , "name" => "adm_email"));
			$itensTabela->addToPos(2, array("tit" => "Nível" , "img" => '', "link" => 'orderc=adm_nivel&amp;ordert=asc'.$busca , "name" => "adm_nivel"));
			$itensTabela->addToPos(3, array("tit" => "Data" , "img" => '', "link" => 'orderc=adm_datacadastro&amp;ordert=asc'.$busca , "name" => "adm_datacadastro"));
		
		$this->setItensBusca($itensBusca);
		$this->setItensTabela($itensTabela);
	}

}
?>