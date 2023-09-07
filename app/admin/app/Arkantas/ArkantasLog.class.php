<?php
/*
	Classe: ArkantasLog (Extende Conexao)
	
	Desenvolvido por: Felipe Gallo
	www.arkantas.com
		
	CREATE TABLE tb_log(
	  log_id              int auto_increment,
	  log_entidade        varchar(100) not null,
	  log_key 			  varchar(255) null,
	  log_operacao        varchar(255), 
	  log_entidadeLogin   varchar(100) default null,
	  log_entidadeId      int null,
	  log_ip              varchar(22) not null,
	  log_data            timestamp not null,
	  primary key(log_id)
	);

	ALTER TABLE `tb_log` ADD `log_key` VARCHAR(255) NULL DEFAULT NULL AFTER `log_entidade`;
*/
Class ArkantasLog{
	
	private $id;
	private $entidade;
	private $key;
	private $operacao;
	private $entidadeLogin;
	private $entidadeId;
	private $ip;
	private $data;
	private $entidades;
	private $classLogin;
	private $fieldClass; //array campos
	private static $instancia;
	private static $dao;

	public function __construct(){
		self::$dao = new GenericDAO;
		self::$dao->setEntity("log");
		$this->entidades = new ArrayList;
	}
	
	final public static function singleton(){
		if(empty(self::$instancia)):
			self::$instancia = new self();
		endif;
		return self::$instancia;
	}
	
	
	public function getId(){
		return $this->id;
	}

	public function getEntidade(){
		return $this->entidade;
	}

	public function getKey(){
		return $this->key;
	}

	public function getOperacao(){
		return $this->operacao;
	}

	public function getEntidadeLogin(){
		return $this->entidadeLogin;
	}

	public function getEntidadeId(){
		return $this->entidadeId;
	}

	public function getIp(){
		return $this->ip;
	}

	public function getData(){
		return $this->data;
	}
	
	public function getFieldClass(){
		return $this->fieldClass;
	}
	
	public function getClassLogin(){
		return $this->classLogin;
	}


	public function setId($id){
		$this->id = $id;
	}

	public function setKey($key){
		$this->key = $key;
	}

	public function setEntidade($entidade){
		$this->entidade = $entidade;
	}

	public function setOperacao($operacao){
		$this->operacao = $operacao;
	}

	public function setEntidadeLogin($entidadeLogin){
		$this->entidadeLogin = $entidadeLogin;
	}

	public function setEntidadeId($entidadeId){
		$this->entidadeId = $entidadeId;
	}

	public function setIp($ip){
		$this->ip = $ip;
	}

	public function setData($data){
		$this->data = $data;
	}
	
	public function setClassLogin($classLogin){
		$this->classLogin = $classLogin;
	}
	
	public function setFieldClass($fieldClass){
		$this->fieldClass = $fieldClass;
	}
	
	public function addEntidade($entidade, $logado = false){
		$arr = array();
		$arr["entidade"] = $entidade;
		$arr["logado"]   = $logado;
		
		$this->entidades->add($arr);
		
	}
	
	public function add(){
	
		$list = $this->entidades;
		
		$this->setIp(@$_SERVER['REMOTE_ADDR']);
		$this->setData(date('Y-m-d H:i:s'));
		self::$dao->setLog(false);
		
		if($list->size() > 0){
			$log    = false;
			$logado = false;
			
			for($i = 0 ; $i < $list->size() ; $i++){
				$entidade = $list->get($i);
				if($entidade["entidade"] == $this->getEntidade()){
					$log = true;
					if($entidade["logado"] == true){
						$logado = true;
					}
					break;
				}
			}
			if($log == true){
				if($logado == true){
				
					$classname = $this->getClassLogin();
					$class = new $classname;
					$class->setFields($this->getFieldClass());
					//$this->setEntidadeLogin(Administrador::getEntity());
					$this->setEntidadeId($class->decodeId());
			
					//log aqui
					self::$dao->add("log_entidade||log_key||log_operacao||log_entidadeLogin||log_entidadeId||log_ip||log_data", "'".$this->getEntidade()."'||'".$this->getKey()."'||'".$this->getOperacao()."'||'".$this->getEntidadeLogin()."'||".$this->getEntidadeId()."||'".$this->getIp()."'||'".$this->getData()."'");
					
				}else{
					self::$dao->add("log_entidade||log_key||log_operacao||log_ip||log_data", "'".$this->getEntidade()."'||'".$this->getKey()."'||'".$this->getOperacao()."'||'".$this->getIp()."'||'".$this->getData()."'");
				}
			}
			return true;
		}
		
		//log aqui
		self::$dao->add("log_entidade||log_key||log_operacao||log_ip||log_data", "'".$this->getEntidade()."'||'".$this->getKey()."'||'".$this->getOperacao()."'||'".$this->getIp()."'||'".$this->getData()."'");

		return true;
	}
	
	public function addLog(){
		
        try{
			self::$dao->setLog(false);
			
			$this->setIp($_SERVER['REMOTE_ADDR']);
			$this->setData(date('Y-m-d H:i:s'));
			
            $boolean = self::$dao->add("log_entidade||log_key||log_operacao||log_entidadeLogin||log_entidadeId||log_ip||log_data", "'".$this->getEntidade()."'||'".$this->getKey()."'||'".$this->getOperacao()."'||'".$this->getEntidadeLogin()."'||".$this->getEntidadeId()."||'".$this->getIp()."'||'".$this->getData()."'");
            if($boolean == false){
                throw new Exception("throw exception");
            }
            return true;
        }catch(Exception $e){
            return false;
        }
		
	}

}
?>