<?php
namespace Base;

Abstract Class ClassModel{

	private static $dao;
	private static $entity = "";


	public function __construct($id = ""){
		self::$dao = new GenericDAO;
		self::$dao->setEntity(self::$entity);
		
		if($id)
			$this->getObject($id);
	}


	public static function get($where, $fields = "*", $order = "", $first = "", $num = ""){
		
		self::$dao = new GenericDAO;
		self::$dao->setEntity(self::$entity);
		
		$limit = "";
		if($order != ""){ $order = " ORDER BY " . $order; }
		if(is_numeric($first) && is_numeric($num)){ $limit = " LIMIT ".$first.",".$num; }
		
		return self::$dao->getListByField($fields, $where . $order . $limit);
		
	}

	public static function getInner($where, $fields = "*", $inner = "", $order = "", $first = "", $num = ""){
		
		self::$dao = new GenericDAO;
		self::$dao->setEntity(self::$entity);
	
		$limit = "";
		if($order != ""){ $order = " ORDER BY " . $order; }
		if(is_numeric($first) && is_numeric($num)){ $limit = " LIMIT ".$first.",".$num; }
		
		return self::$dao->getListInner($fields, $inner, $where . $order . $limit, "S");

	}

	public static function isFieldExisting($field, $value){
		$l = self::get($field ."='".$value."'", $field);
		return ($l->size() > 0) ? 1 : 0 ;
	}

}
?>
