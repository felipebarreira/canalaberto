<?php
/*
	Classe: Conexao
	Using PDO
	
	Desenvolvido por: Felipe Gallo
	www.arkantas.com
*/
class Conexao
{

	private $sgdb = "mysql";
	private $host = "localhost";
	private $user;
	private $pass;
	private $db;
	private $charset = 'utf8mb4';
	private $debug = false;

	public static $instance;
	public static $conn;


	public function init()
	{

		try {
			$settings = array(PDO::ATTR_PERSISTENT => true);


			self::$conn = new PDO(
				$this->getSGDB() . ":host=" . $this->getHost() . ";dbname=" . $this->getDatabase() . ";charset=" . $this->getCharset(),
				$this->getUser(),
				$this->getPassword(),
				$settings
			);
		} catch (PDOException $e) {
			throw new Exception('Nao foi possivel conectar: ' . $e->getMessage());
		}
	}

	final public static function singleton()
	{
		if (empty(self::$instance))
			self::$instance = new self();

		return self::$instance;
	}


	public function setSGBD($sgdb)
	{
		$this->sgdb = $sgdb;
	}

	public function setHost($host)
	{
		$this->host = $host;
	}

	public function setUser($user)
	{
		$this->user = $user;
	}

	public function setPassword($pass)
	{
		$this->pass = $pass;
	}

	public function setDatabase($db)
	{
		$this->db = $db;
	}

	public function setCharset($charset)
	{
		$this->charset = $charset;
	}

	public function setDebug($debug)
	{
		$this->debug = $debug;
	}


	private function getSGDB()
	{
		return $this->sgdb;
	}

	private function getHost()
	{
		return $this->host;
	}

	private function getUser()
	{
		return $this->user;
	}

	private function getPassword()
	{
		return $this->pass;
	}

	private function getDatabase()
	{
		return $this->db;
	}

	private function getCharset()
	{
		return $this->charset;
	}

	protected function getDebug()
	{
		return $this->debug;
	}


	/* 	public function multiQuery($sql){
		$query = self::$instance->multi_query($query);
		return $query;
	} */

	public function numQuery($query)
	{
		$num = $query->rowCount();
		return $num;
	}

	public function fetchQuery($query)
	{
		$dados = @array_map("stripslashes", $query->fetch(PDO::FETCH_BOTH));
		return $dados;
	}

	/* 	public function fetchField($query){
		$obj = $query->fetch(PDO::FETCH_OBJ);
		return $dados;
	} */

	public function fetchObject($query)
	{
		$obj = $query->fetch(PDO::FETCH_OBJ);
		return $obj;
	}

	public function fetchQueryCount($query)
	{
		$dados = $query->fetch(PDO::FETCH_NUM);
		return $dados;
	}

	public function insert($table, $fields, $values)
	{

		$sql 	 = "";
		$fields  = explode("||", $fields);
		$values  = explode("||", $values);

		if (count($fields) != count($values))
			return false;

		$sql .= "INSERT INTO " . $table . "(";
		for ($i = 0, $k = count($fields); $i < $k; $i++) {
			if ($i != ($k - 1)) {
				$sql .= $fields[$i] . ",";
			} else {
				$sql .= $fields[$i];
			}
		}
		$sql .= ") VALUES(";
		for ($i = 0, $k = count($values); $i < $k; $i++) {
			if ($i != ($k - 1)) {
				$sql .= "" . $values[$i] . ",";
			} else {
				$sql .= "" . $values[$i] . "";
			}
		}
		$sql .= ")";

		$query = self::$conn->prepare($sql);
		$query->execute();

		$this->getSQL($sql);

		return ($query->rowCount() <= 0) ? false : true;
	}

	public function update($table, $values, $condition)
	{

		$sql = "Update " . $table . " SET " . $values . " where " . $condition;


		$query = self::$conn->prepare($sql);
		$query->execute();

		$this->getSQL($sql);

		return ($query->rowCount() <= 0) ? false : true;
	}

	public function delete($table, $condition)
	{

		$sql = "Delete From " . $table . " where " . $condition;


		$query = self::$conn->prepare($sql);
		$query->execute();

		$this->getSQL($sql);

		return ($query->rowCount() <= 0) ? false : true;
	}

	public function procedure($procedure, $values)
	{

		if ($values != "OFF") {
			$values = explode("||", $values);
			for ($i = 0, $k = count($values); $i < $k; $i++) {
				if ($i != ($k - 1)) {
					$valor .= "'" . $values[$i] . "',";
				} else {
					$valor .= "'" . $values[$i] . "'";
				}
			}

			$sql = "call " . $procedure . "(" . $valor . ")";
		} else {
			$sql = "call " . $procedure . "()";
		}


		$query = self::$conn->prepare($sql);
		$query->execute();

		$this->getSQL($sql);

		return ($query->rowCount() <= 0) ? false : true;
	}

	public function select($selec, $table, $condition = "")
	{

		$sql = "Select " . $selec . " from " . $table;

		if ($condition != "")
			$sql .= " where " . $condition;


		$query = self::$conn->prepare($sql);
		$query->execute();

		$this->getSQL($sql);

		return $query;
	}

	private function getSQL($sql)
	{
		if ($this->getDebug() == true)
			echo $sql . "<br />";
	}

	public function autocommit($bool)
	{
		if ($bool == false) {
			self::$conn->beginTransaction();
		}
	}

	public function commit()
	{
		return self::$conn->commit();
	}

	public function rollback()
	{
		return self::$conn->rollback();
	}

	public function close()
	{
		self::$instance = null;
		self::$conn = null;
	}

	public function fecha()
	{
		$this->close();
	}

	public function __clone()
	{
		trigger_error('Não é permitido clonar.', E_USER_ERROR);
	}
}
