<?php
/*
	Classe: Generic DAO
	Objetivo:
		- Persistencia de objetos em SGBD
	
	Desenvolvido por: Felipe Gallo
	www.arkantas.com
	
	UPDATE 09-04-2012: Line 286 - isArray(); on getParameter();
	UPDATE 01-07-2012
	UPDATE 15-07-2012: Method classProperties();
	UPDATE 17-07-2012: Methods - classProperties(), add(), remove(), update(), setObj - implement debug on class properties
	UPDATE 01-08-2012: Methods - classProperties(), add(), remove(), update()
	UPDATE 11-09-2014: parent::instance (changed name)
	
*/
class GenericDAO extends Conexao
{

	private $conexao;
	private $entity;
	private $obj;
	private $table;
	private $log = true;

	public function __construct()
	{
		$this->conexao = parent::$instance;
	}

	public function getConexao()
	{
		return $this->conexao;
	}

	public function getEntity()
	{
		return $this->entity;
	}

	public function getObj()
	{
		return $this->obj;
	}

	public function getTable()
	{
		return $this->table;
	}

	public function getLog()
	{
		return $this->log;
	}


	public function setConexao($conexao)
	{
		$this->conexao = $conexao;
	}

	public function setEntity($entity)
	{
		if (substr($entity, 0, 5) == "table") {
			$entity = substr($entity, 6);
			$this->setTable($entity);
		} else {
			$this->setTable("tb_" . $entity);
		}
		$this->entity = $entity;
	}

	public function setObj($obj, $function = "addslashes", $debug = 0)
	{
		$this->obj = $obj;
		//$this->classProperties('escapeCharacters');
		$this->classProperties($function, $debug);
	}

	public function setTable($table)
	{
		$this->table = $table;
	}

	public function setLog($log)
	{
		$this->log = $log;
	}


	public function add($fields, $values = null, $debug = 0)
	{
		$this->getConexao()->autocommit(false);
		try {

			$values = (is_array($fields)) ? implode("||", ($fields)) : $values;
			$fields = (is_array($fields)) ? implode("||", array_keys($fields)) : $fields;

			$query = $this->getConexao()->insert($this->getTable(), $fields, $values);
			if ($query == false) {
				throw new Exception("throw exception");
			}

			$this->getConexao()->commit();

			if ($this->getLog() == true) {

				$objLog = ArkantasLog::singleton();
				$objLog->setEntidade($this->getEntity());
				$objLog->setOperacao("INSERT INTO " . $this->getTable() . " (" . str_replace("||", ", ", $fields) . ") VALUES(" . str_replace("||", ", ", addslashes($values)) . ")");
				$objLog->add();
			}

			if ($debug == 1 || $this->getDebug() == true)
				$debug = 1;

			//if(is_object($this->getObj()))
			//	$this->classProperties('stripslashes', $debug);
			if (is_object($this->getObj())) {
				$this->classProperties('stripslashes', $debug);
				$this->classProperties('escapeCharacters', $debug);
			}
		} catch (Exception $e) {

			$this->getConexao()->rollback();
			return false;
		}
		return true;
	}

	public function remove($condicao, $debug = 0)
	{
		$this->getConexao()->autocommit(false);
		try {

			$query = $this->getConexao()->delete($this->getTable(), $condicao);
			if ($query == false) {
				throw new Exception("throw exception");
			}

			$this->getConexao()->commit();

			if ($this->getLog() == true) {

				$objLog = ArkantasLog::singleton();
				$objLog->setEntidade($this->getEntity());
				$objLog->setOperacao("Delete From " . $this->getTable() . " where " . addslashes($condicao));
				$objLog->add();
			}

			if ($debug == 1 || $this->getDebug() == true)
				$debug = 1;

			//if(is_object($this->getObj()))
			//	$this->classProperties('stripslashes', $debug);
			if (is_object($this->getObj())) {
				$this->classProperties('stripslashes', $debug);
				$this->classProperties('escapeCharacters', $debug);
			}
		} catch (Exception $e) {

			$this->getConexao()->rollback();
			return false;
		}
		return true;
	}

	public function update($campos, $condicao, $debug = 0)
	{
		$this->getConexao()->autocommit(false);
		try {

			//$campos = (is_array($campos)) ? implode(",", $campos) : $campos;

			$query = $this->getConexao()->update($this->getTable(), $campos, $condicao);
			if ($query == false) {
				throw new Exception("throw exception");
			}

			$this->getConexao()->commit();

			if ($this->getLog() == true) {

				$objLog = ArkantasLog::singleton();
				$objLog->setEntidade($this->getEntity());
				$objLog->setOperacao("Update " . $this->getTable() . " set " . addslashes($campos) . " where " . addslashes($condicao));
				$objLog->add();
			}

			if ($debug == 1 || $this->getDebug() == true)
				$debug = 1;

			//if(is_object($this->getObj())){
			//$this->classProperties('stripslashes', $debug);
			if (is_object($this->getObj())) {
				$this->classProperties('stripslashes', $debug);
				$this->classProperties('escapeCharacters', $debug);
			}
		} catch (Exception $e) {

			$this->getConexao()->rollback();
			return false;
		}

		return true;
	}

	public function getObject($campos, $condicao)
	{
		$query = $this->getConexao()->select($campos, $this->getTable(), $condicao);
		return $obj = $this->getConexao()->fetchObject($query);
	}

	public function getList($condicao)
	{
		$query = $this->getConexao()->select("*", $this->getTable(), $condicao);
		return $this->getObjList($query);
	}

	public function getListByField(String $campos = "*", $condicao = "")
	{
		$query = $this->getConexao()->select($campos, $this->getTable(), $condicao);
		return $this->getObjList($query);
	}


	public function getListByFieldHaving($campos = "*", $condicao = "", $inner = "")
	{
		$condicao = (empty($condicao)) ? "" : " having " . $condicao;

		if (strtolower(get_parent_class($this->getConexao())) == "mysqli") {
			$query = $this->getConexao()->query("Select " . $campos . " from " . $this->getTable() . " " . $inner . $condicao);
		} else {
			$query = Conexao::$conn->prepare("Select " . $campos . " from " . $this->getTable() . " " . $inner . $condicao);
			$query->execute();
		}

		//echo "Select " . $campos . " from " .$this->getTable() . " " . $inner . $condicao . "<br><br>";
		return $this->getObjList($query);
	}

	public function getListInner($campos = "*", $inner = "", $condicao = "", $arrayList = "")
	{
		$condicao = (empty($condicao)) ? "" : " where " . $condicao;

		if (strtolower(get_parent_class($this->getConexao())) == "mysqli") {
			$query = $this->getConexao()->query("Select " . $campos . " from " . $this->getTable() . " " . $inner . $condicao);
		} else {
			$query = Conexao::$conn->prepare("Select " . $campos . " from " . $this->getTable() . " " . $inner . $condicao);
			$query->execute();
		}

		//echo "Select " . $campos . " from " .$this->getTable() . " " . $inner . $condicao . "<br><br>";
		if ($arrayList == "S") {
			return $this->getObjList($query);
		} else {
			return $obj = $this->getConexao()->fetchObject($query);
		}
	}

	public function getQueryList($query, $arrayList = "S")
	{
		//echo $query . "<br /><br />";
		if (strtolower(get_parent_class($this->getConexao())) == "mysqli") {
			$query = $this->getConexao()->query($query);
		} else {
			$query = Conexao::$conn->prepare($query);
			$query->execute();
		}
		if ($arrayList == "S") {
			return $this->getObjList($query);
		}

		return $obj = $this->getConexao()->fetchObject($query);
	}

	public function getAll($first = "", $num = "", $order = "")
	{
		if (empty($first) && empty($num) && empty($order)) {
			$query = $this->getConexao()->select("*", $this->getTable());
		} elseif (!empty($order)) {
			if (empty($first) && empty($num)) {
				$query = $this->getConexao()->select("*", $this->getTable() . " ORDER BY $order");
			} else {
				$query = $this->getConexao()->select("*", $this->getTable() . " ORDER BY $order LIMIT $first, $num");
			}
		} else {
			$query = $this->getConexao()->select("*", $this->getTable() . " LIMIT $first, $num");
		}

		return $this->getObjList($query);
	}

	public function nextId($id)
	{
		$query = $this->getConexao()->select("max($id) as $id ", $this->getTable());
		$dados = $this->getConexao()->fetchObject($query);
		return $dados->$id;
	}

	public function count($where = "1")
	{
		$query = $this->getConexao()->select("count(*) as contador", $this->getTable(), $where);
		$dados = $this->getConexao()->fetchObject($query);
		return $dados->contador;
	}

	private function getObjList($query)
	{
		$list = new ArrayList;
		while ($obj = $this->getConexao()->fetchObject($query)) {
			$getObj = get_object_vars($obj);
			$campos = array_keys($getObj);
			$newobj = new stdClass;
			for ($i = 0; $i < count($getObj); $i++) {


				$getObj[$campos[$i]] = ($getObj[$campos[$i]] != "") ? stripslashes($getObj[$campos[$i]]) : "";
				$newobj->{$campos[$i]} = $getObj[$campos[$i]];
			}
			$list->add($newobj);
			unset($newobj);
		}
		return $list;
	}

	public function classProperties($func = 'addslashes', $debug = 0)
	{
		if (is_object($this->getObj())) {
			$reflection   = new ReflectionClass($this->getObj());
			$propriedades = $reflection->getProperties();
			$methods      = $reflection->getMethods(ReflectionMethod::IS_PUBLIC);

			$debugPropriedades = array();
			$debugMethods = array();

			foreach ($propriedades as $key => $prop) {
				$propriedade = str_replace("_", "", $prop->getName());

				if ($debug)
					array_push($debugPropriedades, $propriedade);

				foreach ($methods as $k => $method) {
					$method = $method->name;
					if (strtolower($method) == strtolower("get" . $propriedade)) {

						foreach ($methods as $k2 => $v2) {
							$v2 = $v2->name;
							$rMethod  = new ReflectionMethod(get_class($this->getObj()), $v2);
							$params   = $rMethod->getParameters();
							$valueset = strtolower($v2);

							if (!$rMethod->isStatic()) {

								if ($valueset == strtolower("set" . $propriedade) && count($params) == 1) {
									foreach ($params as $param) {
										if (!is_array($param)) {
											if (!is_object($this->getObj()->$method())) {

												$getFunc = "get" . $propriedade;
												$valueParam = $this->getObj()->$getFunc();

												if (!is_array($valueParam)) {
													$valueParam = ($this->getObj()->$method() != "") ? $this->getObj()->$method() : "";
													if (method_exists($this, $func)) {
														$this->getObj()->$v2($this->$func($valueParam));
													} else {
														if (is_callable($func)) {
															$this->getObj()->$v2($func($valueParam));
														}
													}

													if ($debug)
														array_push($debugMethods, $v2 . " / " . $method . " => " . $this->getObj()->$method());
													//echo $this->getObj()->$method() . "<br />";
												}
											}
										}
									}

									break;
								}
							}
						}
					}
				}
			}

			//printa debug

			if ($debug) {

				echo "<strong>Properties:</strong>" . "<br />";
				foreach ($debugPropriedades as $propertie) {
					echo $propertie . "<br />";
				}

				echo "<br /><strong>Methods:</strong>" . "<br />";
				foreach ($debugMethods as $method) {
					echo $method . "<br />";
				}
			}

			return true;
		}
		return false;
	}

	//function complementar ao classPropeties
	private function escapeCharacters($string)
	{
		if ($string !== null) {
			return str_replace('"', '&quot;', $string);
		}

		return "";
	}

	public function __destruct()
	{
		if (is_object($this->getObj())) {
			$this->classProperties('stripslashes');
		}
	}
}
		/*
		gruposcontroller.php
		$objGrupo = new Grupo;
		$objGrupo->setNome("Teste");
		$objGrupo->setData("2011-08-16");
		
		$grupodao = new GenericDAO;
		$grupodao->setEntity("grupo");
		$grupodao->setObj($objGrupo);
		
		$lista = $grupodao->getList("gru_nome='".$objGrupo->getNome()."'");
		unset($grupodao);
		echo $objGrupo->getNome();
 		$grupodao->classProperties();
		echo $objGrupo->getId() . "<br />";
		echo $objGrupo->getNome() . "<br />";
		echo $objGrupo->getData() . "<br />";
		$grupodao->classProperties('stripslashes');
		echo $objGrupo->getId() . "<br />";
		echo $objGrupo->getNome() . "<br />";
		echo $objGrupo->getData();
		*/
