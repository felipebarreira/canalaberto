<?php
/*
	Classe: ArrayList
	
	Desenvolvido por: Felipe Gallo
	www.arkantas.com
*/
Class ArrayList{
	public $arrayList = array();
	private $ponteiro = 0;
	
	public function __construct($array = ""){
		if(is_array($array) == true){
			$this->arrayList = $array;
		}
	}
	
	public function add($obj){
		if(is_array($this->arrayList)){
			array_push($this->arrayList, $obj);
		}
	}
	
	public function addToPos($indice, $obj){
		if($this->isInteger($indice)){
			$this->arrayList[$indice] = $obj;
		}else{
			echo "\n<strong>Parâmetro índice deve ser numérico.</strong>\n";
		}
	}
	
	public function addAll(array $array){
		$this->arrayList = array_merge($this->arrayList, $array);
	}
	
	public function contains($obj){
		return (is_array($this->arrayList)) ? in_array($obj, $this->arrayList) : false; 
	}
	
	public function get($indice){
		if($this->isInteger($indice)){
			return (is_array($this->arrayList)) ? $this->arrayList[$indice] : "";
		}else{
			echo "\n<strong>Parâmetro índice deve ser numérico.</strong>\n";
		}
	}
	
	public function remove($indice){
		if($this->isInteger($indice)){
			$novoArray = array();
			for($i = 0 ; $i < $this->size() ; $i++){
				if($indice != $i){
					$novoArray[] = $this->get($i); 
				}
			}
			$this->arrayList = $novoArray;
			
		}else{
			echo "\n<strong>Parâmetro índice deve ser numérico.</strong>\n";
		}
	}
	
	public function removeConjunto($indiceInicio, $indiceFinal){
		if($this->isInteger($indiceInicio) && $this->isInteger($indiceFinal)){
			$novoArray = array();
			for($i = 0 ; $i < $this->size() ; $i++){
				if($i < $indiceInicio || $i > $indiceFinal){
					$novoArray[] = $this->get($i); 
				}
			}
			$this->arrayList = $novoArray;
			
		}else{
			echo "\n<strong>Parâmetro índice deve ser numérico.</strong>\n";
		}
	}
	
	public function indexOf($obj){

		if(!is_array($this->arrayList))
			return false;
			
		foreach($this->arrayList as $key => $value){
			if($this->arrayList[$key] == $obj){
				return $key;
			}
		}
		return false;
	}
	
	private function hasNext(){
		$this->ponteiro++;
		return ($this->ponteiro > $this->size()) ? false : true;    
	} 
	
    public function reset(){
		if(is_array($this->arrayList)){
        reset($this->arrayList);
        $this->ponteiro = 0;
		}
    } 
	
	public function next(){
		if(!is_array($this->arrayList))
			return false;
			
		$cur = current($this->arrayList);
		next($this->arrayList);
		
		return ($this->hasNext() == true) ? $cur : false;
		/* if($this->hasNext() == true){
			return $cur;
		}else{
			return false;
		} */
	}
	
	public function clear(){
		$this->arrayList = array();
	}
	
	public function size(){
		return (is_array($this->arrayList)) ? count($this->arrayList) : 0 ;
	}

	public function shuffle(){
		return (is_array($this->arrayList)) ? shuffle($this->arrayList) : array() ;
	}
	
	public function sort(){
		return (is_array($this->arrayList)) ? sort($this->arrayList) : array() ;
	}
	
	public function getPonteiro(){
		return $this->ponteiro;
	}
	
	public function toArray(){
		return $this->arrayList;
	}
	
	public function isEmpty(){
		return ($this->size() == 0) ? true : false;
	}
	
	public function isInteger($valor){
		return preg_match('/^[0-9]*$/', $valor); 
	}
	
	public function __call($m, $a){
		echo "\n<strong>Método invocado não existe: $m</strong>\n";
	}
}
/*
	$arrayList = new ArrayList;
	$arrayList->add("a5");
	$arrayList->add("a1");
	$arrayList->add("a2");
	$arrayList->add("a3");
	$arrayList->add("a4");
	$arrayList->addAll(array("a6", "a7"));
	/ *
		$arrayList->remove(3);
		$arrayList->removeConjunto(1, 3);
		echo $arrayList->next() . "<br />";
		echo $arrayList->next() . "<br />";
		echo $arrayList->next() . "<br /><br />";
		echo "<strong>" . $arrayList->getPonteiro() . "</strong><br>";
	* /
	for($i = 0, $arr = $arrayList->toArray() ; $i < $arrayList->size() ; $i++){
		echo $arr[$i] . "<br />";
	}
*/
?>