<?php
/*
	Classe: Data
	Objetivo:
        - Manipulação de Data, operações aritiméticas com datas com facilidade.
	
	Desenvolvido por: Felipe Gallo
	www.arkantas.com
*/

Class Data{
	public $date;
	public $expirou = false;
	
	public function __construct($date = ""){
		if(!empty($date)){
			$this->date = $date;
		}else{
			$this->date = date("Y-m-d"); 
		}
	}
	
	public function getData(){
		return $this->date;
	}
	
	public function setData($data){
		$this->date = $data;
	}
	
	public function soma($dia, $mes = 0, $ano = 0){
		$this->setData($this->operacoes("+", $dia, $mes, $ano));
		return null;
	}
	
	public function subtrai($dia, $mes = 0, $ano = 0){
		$this->setData($this->operacoes("-", $dia, $mes, $ano));
		return null;
	}
	
	public function valida($date = ""){
		if(empty($date)){ $date = $this->getData(); }
		$date = $this->explodir($date);
		$format = strtotime($date[1]."/".$date[2]."/".$date[0]);
		return $format;
	}
	/*
	public function expira($data){
		$date = $this->explodir($data);
	
		$data_unix = $this->valida($data);
		$date_unix = $this->valida($this->date);
		
		if($data_unix > $date_unix){
			$this->expirou = true;
			if($this->expirou == true){
				echo "<br>" . $this->subtrai($date[2]);
			}
		}
		
	}
	*/
	private function operacoes($operacao, $dias = 0, $meses = 0, $anos = 0){
		$date = $this->explodir($this->getData());
		if($operacao == "+"){
			$new = date("Y-m-d", mktime(0, 0, 0, $date[1] + $meses, $date[2] + $dias, $date[0] + $anos) );
		}elseif($operacao == "-"){
			$new = date("Y-m-d", mktime(0, 0, 0, $date[1] - $meses, $date[2] - $dias, $date[0] - $anos) );
		}
		return $new;
	}
	
	private function explodir($string){
		$string = explode("-", $string);
		return $string;
	}
}
?>