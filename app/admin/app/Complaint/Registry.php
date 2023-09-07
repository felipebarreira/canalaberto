<?php

namespace Complaint;

use \GenericDAO, \ArkantasLog, \ArrayList, \MailSender, \Exception, \DateTime;

/*	--
	CREATE TABLE tb_complaint_registry(
		registry_id						    int auto_increment,
		registry_key 					    varchar(120) unique not null,
        registry_name 					    varchar(255) null,
        registry_email					    varchar(255) null,
		registry_message				    mediumtext NULL,
        registry_data   				    varchar(255) null,
        registry_status   				    tinyint(1) not null default '0',
        registry_response				    mediumtext NULL,
        registry_bucket   				    varchar(255) null,
        registry_ip        				    varchar(255) null,
        registry_useragent   				varchar(255) null,
		registry_updated				    timestamp not null,
		registry_created 				    timestamp not null,
		primary key (registry_id)
	)engine=InnoDB;

*/

class Registry
{

	use \Component\SingleFileUpload;

	private $id;
	private $key;
	private $name;
	private $email;
	private $message;
	private $data;
	private $status;
	private $response;
	private $bucket;
	private $ip;
	private $useragent;
	private $updated;
	private $created;

	private static $dao;
	private static $entity = 'complaint_registry';

	private static $pathPaste;
	private static $domainPaste;

	public function __construct($id = "")
	{
		self::$dao = new GenericDAO;
		self::$dao->setEntity(self::$entity);

		if ($id)
			$this->getObject($id);
	}


	# getters
	public function getId()
	{
		return $this->id;
	}

	public function getKey()
	{
		return $this->key;
	}

	public function getName()
	{
		return $this->name;
	}

	public function getEmail()
	{
		return $this->email;
	}

	public function getMessage()
	{
		return $this->message;
	}

	public function getData()
	{
		return $this->data;
	}

	public function getStatus()
	{
		return $this->status;
	}

	public function getResponse()
	{
		return $this->response;
	}

	public function getBucket()
	{
		return $this->bucket;
	}

	public function getIp()
	{
		return $this->ip;
	}

	public function getUseragent()
	{
		return $this->useragent;
	}

	public function getUpdated()
	{
		return $this->updated;
	}

	public function getCreated()
	{
		return $this->created;
	}

	public function getCreatedDateTime()
	{
		return (new DateTime($this->getCreated()));
	}

	public function getUpdatedDateTime()
	{
		return (new DateTime($this->getUpdated()));
	}

	public static function getPathPaste()
	{
		return self::$pathPaste;
	}

	public static function getDomainPaste()
	{
		return self::$domainPaste;
	}


	# setters
	public function setId($id)
	{
		$this->id = $id;
	}

	public function setKey($key)
	{
		$this->key = $key;
	}

	public function setName($name)
	{
		$this->name = $name;
	}

	public function setEmail($email)
	{
		$this->email = $email;
	}

	public function setMessage($message)
	{
		$this->message = $message;
	}

	public function setData($data)
	{
		$this->data = $data;
	}

	public function setStatus($status)
	{
		$this->status = $status;
	}

	public function setResponse($response)
	{
		$this->response = $response;
	}

	public function setBucket($bucket)
	{
		$this->bucket = $bucket;
	}

	public function setIp($ip)
	{
		$this->ip = $ip;
	}

	public function setUseragent($useragent)
	{
		$this->useragent = $useragent;
	}

	public function setUpdated($updated)
	{
		$this->updated = $updated;
	}

	public function setCreated($created)
	{
		$this->created = $created;
	}

	public static function setPathPaste($path)
	{
		if (!file_exists($path))
			throw new Exception("O diretorio informado na propriedade estatica da classe <strong>" . __CLASS__ . "</strong> nao existe.");

		self::$pathPaste = $path;
	}

	public static function setDomainPaste($domain)
	{
		self::$domainPaste = $domain;
	}


	public static function generateKey($len = 12)
	{

		$prospect_key = self::randSha1($len);
		if (self::isFieldExisting("registry_key", $prospect_key)) {
			$prospect_key = self::generateKey(($len + rand(2, 8)));
		}

		return $prospect_key;
	}

	private static function randSha1($length)
	{

		$max = ceil($length / 40);
		$random = '';

		for ($i = 0; $i < $max; $i++)
			$random .= sha1(microtime(true) . mt_rand(10000, 90000));

		return substr($random, 0, $length);
	}

	public static function validDate($date, $format = 'YYYY-MM-DD')
	{
		if (strlen($date) >= 8 && strlen($date) <= 10) {
			$separator_only = str_replace(array('M', 'D', 'Y'), '', $format);
			$separator = $separator_only[0];
			if ($separator) {
				$regexp = str_replace($separator, "\\" . $separator, $format);
				$regexp = str_replace('MM', '(0[1-9]|1[0-2])', $regexp);
				$regexp = str_replace('M', '(0?[1-9]|1[0-2])', $regexp);
				$regexp = str_replace('DD', '(0[1-9]|[1-2][0-9]|3[0-1])', $regexp);
				$regexp = str_replace('D', '(0?[1-9]|[1-2][0-9]|3[0-1])', $regexp);
				$regexp = str_replace('YYYY', '\d{4}', $regexp);
				$regexp = str_replace('YY', '\d{2}', $regexp);
				if ($regexp != $date && preg_match('/' . $regexp . '$/', $date)) {
					foreach (array_combine(explode($separator, $format), explode($separator, $date)) as $key => $value) {
						if ($key == 'YY') $year = '20' . $value;
						if ($key == 'YYYY') $year = $value;
						if ($key[0] == 'M') $month = $value;
						if ($key[0] == 'D') $day = $value;
					}
					if (checkdate($month, $day, $year)) return true;
				}
			}
		}
		return false;
	}

	public function registryLink()
	{

		if (!is_numeric($this->getId()))
			return '#';


		return HTTP_DOMAIN . 'status/' . $this->getKey();
	}




	# crud
	public function add()
	{

		try {

			self::$dao->setObj($this);

			$name = ($this->getName() == '') ? 'NULL' : "'" . $this->getName() . "'";
			$email = ($this->getEmail() == '') ? 'NULL' : "'" . $this->getEmail() . "'";
			$response = ($this->getResponse() == '') ? 'NULL' : "'" . $this->getResponse() . "'";
			$bucket = ($this->getBucket() == '') ? 'NULL' : "'" . $this->getBucket() . "'";
			$data = ($this->getData() == '') ? 'NULL' : "'" . $this->getData() . "'";
			$status = ($this->getStatus() == '') ? '0' : "'" . $this->getStatus() . "'";


			$boolean = self::$dao->add(
				array(
					"registry_key" => "'" . $this->getKey() . "'",
					"registry_name" => $name,
					"registry_email" => $email,
					"registry_message" => "'" . $this->getMessage() . "'",
					"registry_data" => $data,
					"registry_status" => $status,
					"registry_response" => $response,
					"registry_bucket" => $bucket,
					"registry_ip" => "'" . $this->getIp() . "'",
					"registry_useragent" => "'" . $this->getUseragent() . "'",
					"registry_updated" => "'" . $this->getUpdated() . "'",
					"registry_created" => "'" . $this->getCreated() . "'"
				)
			);

			if ($boolean == false)
				throw new Exception("throw exception");

			$this->setId(self::$dao->nextId('registry_id'));
			return true;
		} catch (Exception $e) {
			return false;
		}
	}

	public function update()
	{

		try {

			self::$dao->setObj($this);

			//$notifybefore = ($this->getNotifyBefore() == '') ? 'NULL' : $this->getNotifyBefore();


			$boolean = self::$dao->update("registry_name='" . $this->getName() . "', registry_email='" . $this->getEmail() . "', registry_status='" . $this->getStatus() . "', registry_data='" . $this->getData() . "', registry_bucket='" . $this->getBucket() . "', registry_response='" . $this->getResponse() . "',registry_updated='" . $this->getUpdated() . "'", "registry_id='" . $this->getId() . "'");
			if ($boolean == false)
				throw new Exception("throw exception");


			return true;
		} catch (Exception $e) {
			return false;
		}
	}

	public static function updateWhere($set, $where)
	{

		self::$dao = new GenericDAO;
		self::$dao->setEntity(self::$entity);

		try {


			$boolean = self::$dao->update($set, $where);

			if ($boolean == false)
				throw new Exception("throw exception");

			return true;
		} catch (Exception $e) {
			return false;
		}
	}

	public function delete()
	{

		try {

			if (!is_numeric($this->getId()))
				throw new Exception("throw exception");


			$boolean = self::$dao->update("registry_status=3", "registry_id='" . $this->getId() . "'");
			if ($boolean == false)
				throw new Exception("throw exception");


			# arquiva @Contract caso não existam pagamentos ativos relacionados

			return true;
		} catch (Exception $e) {
			return false;
		}
	}

	public function getObjectByKey($key, $fields = "*")
	{

		$obj = self::$dao->getObject($fields, "registry_key='" . $key . "'");

		if (is_object($obj))
			$this->constructObj($obj);

		return null;
	}

	public function getObject($id = "", $fields = "*")
	{

		if (is_numeric($id)) {
			$where = "registry_id=" . $id;
		} elseif (is_string($id)) {
			$where = "registry_key='" . $id . "'";
		} else {
			$where = "registry_id=" . $this->getId();
		}

		$obj = self::$dao->getObject($fields, $where);

		if (is_object($obj))
			$this->constructObj($obj);

		return null;
	}

	private function constructObj($obj)
	{

		//$login 	= new \Component\LoginAdapter();

		$this->setId($obj->registry_id);
		//$this->setLogin($login);
		$this->setKey($obj->registry_key);
		$this->setName($obj->registry_name);
		$this->setEmail($obj->registry_email);
		$this->setMessage($obj->registry_message);
		$this->setData($obj->registry_data);
		$this->setStatus($obj->registry_status);
		$this->setResponse($obj->registry_response);
		$this->setBucket($obj->registry_bucket);
		$this->setIp($obj->registry_ip);
		$this->setUserAgent($obj->registry_useragent);
		$this->setUpdated($obj->registry_updated);
		$this->setCreated($obj->registry_created);

		self::$dao->setObj($this, "escapeCharacters");
	}

	public static function get($where, $fields = "*", $order = "", $first = "", $num = "")
	{

		self::$dao = new GenericDAO;
		self::$dao->setEntity(self::$entity);

		$limit = "";
		if ($order != "") {
			$order = " ORDER BY " . $order;
		}
		if (is_numeric($first) && is_numeric($num)) {
			$limit = " LIMIT " . $first . "," . $num;
		}

		return self::$dao->getListByField($fields, $where . $order . $limit);
	}

	public static function getInner($where, $fields = "*", $inner = "", $order = "", $first = "", $num = "")
	{

		self::$dao = new GenericDAO;
		self::$dao->setEntity(self::$entity);

		$limit = "";
		if ($order != "") {
			$order = " ORDER BY " . $order;
		}

		if (is_numeric($first) && is_numeric($num)) {
			$limit = " LIMIT " . $first . "," . $num;
		}

		return self::$dao->getListInner($fields, $inner, $where . $order . $limit, "S");
	}

	public static function isFieldExisting($field, $value)
	{
		$l = self::get($field . "='" . $value . "'", $field);
		return ($l->size() > 0) ? 1 : 0;
	}
}
