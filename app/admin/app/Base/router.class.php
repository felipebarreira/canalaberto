<?php
/*
	UPDATES:
	 19-04-2011 < autoload Models
	 05-05-2012 < autoload otimized
	 14-10-2013 < update-log
	 15-07-2017 < modules to act like 'prefix' and separate in subfolders on \controller, \model and views (template.class)
*/
class Router{

	private $registro;
	private $caminho;

	private $modules = array();

	public $controller;
	public $varfunction;
	public $partExplode = "/"; //Default

	
	public function __construct($objRegistro = ""){
		$this->setRegistro($objRegistro);
		$this->Controller();
	}


	public function getModules(){
		return $this->modules;
	}

	public function getRegistro(){
		return $this->registro;
	}

	public function getCaminho(){
		return $this->caminho;
	}

	public function getController(){
		return $this->controller;
	}

	public function getFunction(){
		return $this->varfunction;
	}
	
	public function getPartExplode(){
		return $this->partExplode;
	}
	

	public function setModules($modules){
		$this->modules = $modules;
	}

	public function setRegistro($registro){
		$this->registro = $registro;
	}
	
	public function setCaminho($caminho){
		if(is_dir($caminho) == false){
			throw new Exception ('Caminho inválido: `' . $caminho . '`');
		}
		$this->caminho = str_replace('\\', "/", $caminho);
	}
	
	public function setController($controller = "index"){
		$this->controller = $controller;
	}
	
	public function setFunction($function = "index"){
		$this->varfunction = $function;
	}
	
	public function setPartExplode($part = "/"){
		if(strlen($part) == 1){
			$this->partExplode = $part;
		}
	}

	public function getModuleInfo(){

		$modules = $this->getModules();
		$info = array();

		foreach($modules as $key => $value){
			if(in_array($this->getController(), $value['controllers'])){
				$info = $value;
				break;
			}
		}

		return $info;
	}

	public function getModulePath(){

		$modules = $this->getModules();
		$path = '';

		foreach($modules as $key => $value){
			if(in_array($this->getController(), $value['controllers'])){
				$path .= '/'.$value['path_controller'];
				break;
			}
		}

		return $path;
	}

	public function loader(){
		
		$caminho   = $this->getCaminho() . "/controller";
		$classname = $this->getController() . 'Controller';
		
		/*
		*	Caso nenhum controller seja encontrado a aplicaçãoo é
		*	direcionada para o error404Controller.
		*/
		# path by setting
		$caminho .= $this->getModulePath();

		#	
		if(!is_readable($caminho . '/' . $classname . '.php')){
			$this->setController('error404');
			$caminho   = $this->getCaminho() . "/controller";
			$classname = $this->getController() . 'Controller';
			if(!is_readable($caminho . '/' . $classname . '.php'))
				throw new Exception("A classe error404 não está definida.");
		}
		require_once($caminho . '/' . $classname . '.php');
		
		
		# init controller
		$objController = new $classname($this->getRegistro());

		if (!is_callable(array($objController, $this->getFunction()))){
			$function = 'index';
		}else{
			$function = $this->getFunction();
		}
		
		# load
		$objController->$function();
	}


	private function Controller(){

		$route = (empty($_GET['rt'])) ? '' : $_GET['rt'];
		
		$this->setController();
		$this->setFunction();
		
		if(!empty($route)){
			$part = explode($this->getPartExplode(), $route);
			$this->setController($part[0]);
			
			if(isset($part[1])){
				$this->setFunction($part[1]);
			}
		}
		return null;
	}
	
	public function model(){
		
		$caminho   = $this->getCaminho() . "/model";
		$classname = $this->getController() . 'Model';
		
		# path by setting
		$caminho .= $this->getModulePath();

		#
		if(is_readable($caminho . "/". $classname . '.php')){
			require_once($caminho . "/" . $classname . '.php');
			if(class_exists($classname)){
				$objModel = new $classname($this->getRegistro());
				return $objModel;
			}else{
				throw new Exception("A classe <strong>".$classname."</strong> n�o foi definida!");
			}
		}
		return false;
	}
	
}
?>