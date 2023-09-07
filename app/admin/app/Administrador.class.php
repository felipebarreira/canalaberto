<?php
class Administrador extends ManagementAccess
{

	use \Component\SingleImageUpload;

	private $id;
	private $nome;
	private $image;
	private $email;
	private $senha;
	private $salt;
	private $nivel;
	private $preferencias;
	private $timesession = '00:20';
	private $datacadastro;

	# Propriedades estáticas
	private static $pathPaste, $domainPaste;
	private static $widthThumb  = 500;
	private static $heightThumb = 500;

	public function __construct($id = "")
	{
		self::setEntity("administracao");

		self::$dao = new GenericDAO;
		self::$dao->setEntity(self::getEntity());
		if ($id) {
			$this->getObject($id);
		}
	}

	public function getId()
	{
		return $this->id;
	}

	public function getNome()
	{
		return $this->nome;
	}

	public function getImage()
	{
		return $this->image;
	}

	public function getEmail()
	{
		return $this->email;
	}

	public function getSenha()
	{
		return $this->senha;
	}

	public function getSalt()
	{
		return $this->salt;
	}

	public function getNivel()
	{
		return $this->nivel;
	}

	public function getPreferencias()
	{
		return $this->preferencias;
	}

	public function getTimeSession()
	{
		return $this->timesession;
	}

	public function getData()
	{
		return $this->datacadastro;
	}

	public static function getPathPaste()
	{
		return self::$pathPaste;
	}

	public static function getDomainPaste()
	{
		return self::$domainPaste;
	}

	public static function getWidthThumb()
	{
		return self::$widthThumb;
	}

	public static function getHeightThumb()
	{
		return self::$heightThumb;
	}

	public function setId($id)
	{
		$this->id = $id;
	}

	public function setNome($nome)
	{
		$this->nome = $nome;
	}

	public function setImage($image)
	{
		$this->image = $image;
	}

	public function setEmail($email)
	{
		$this->email = $email;
	}

	public function setSenha($senha)
	{
		$this->senha = $senha;
	}

	public function setSalt($salt)
	{
		$this->salt = $salt;
	}

	public function setNivel($nivel)
	{
		$this->nivel = $nivel;
	}

	public function setPreferencias($preferencias)
	{
		$this->preferencias = $preferencias;
	}

	public function setTimeSession($timesession)
	{
		$this->timesession = $timesession;
	}

	public function setData($datacadastro)
	{
		$this->datacadastro = $datacadastro;
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


	public function getImagePath()
	{

		if ($this->getId() == "")
			return false;

		$image_default = HTTP_DOMAIN . 'admin/img/avatar_default_solid.png';

		if ($this->getImage() == "")
			return $image_default;

		if (!file_exists(self::getPathPaste() . $this->getImage()))
			return $image_default;

		return (self::getDomainPaste() . $this->getImage());
	}

	/*
	 * Methods
	 * # public function add(){}
	 * # public function update(){}
	 * # public function delete(){}
	 * # public function getObject($id = "", $fields = "*"){}
	 * # public function get($where, $fields = "*", $order = "", $first = "", $num = ""){}
	 */

	private function generatePasswordWithSalt($password)
	{

		$hash = array();

		#define algorithm and generate aleatory salt
		$algorithm  = (rand(1, 9) % 2 == 0) ? 'm' : 's';
		$salt		= rand(1, 9) . rand(1, 9) . rand(1, 9) . rand(1, 9) . rand(1, 9) . rand(1, 9) . rand(1, 9) . rand(1, 9) . rand(1, 9) . rand(1, 9) . rand(2, 9);
		$salt	   .= $algorithm;

		# generate hash password
		$password = $this->getHash($salt, $password, $this->getAlgorithmObject($algorithm));

		# return array with salt key and hash-password
		$hash['salt'] = $salt;
		$hash['password'] = $password;

		return $hash;
	}

	public function add()
	{

		try {

			self::$dao->setObj($this);

			$accessInfo = $this->generatePasswordWithSalt($this->getSenha());

			$boolean = self::$dao->add("adm_nome||adm_email||adm_senha||adm_salt||adm_nivel||adm_timesession||adm_datacadastro", "'" . $this->getNome() . "'||'" . $this->getEmail() . "'||'" . $accessInfo['password'] . "'||'" . $accessInfo['salt'] . "'||'" . $this->getNivel() . "'||'" . $this->getTimeSession() . "'||'" . $this->getData() . "'");
			if ($boolean == false) {
				throw new Exception("throw exception");
			}

			$this->setId(self::$dao->nextId('adm_id'));
			return true;
		} catch (Exception $e) {
			return false;
		}
	}


	public function update()
	{
		try {

			self::$dao->setObj($this);


			$boolean = self::$dao->update("adm_nome='" . $this->getNome() . "', adm_image='" . $this->getImage() . "', adm_email='" . $this->getEmail() . "', adm_nivel='" . $this->getNivel() . "', adm_timesession='" . $this->getTimeSession() . "', adm_preferencias='" . $this->getPreferencias() . "'", "adm_id='" . $this->getId() . "'");
			if ($boolean == false) {
				throw new Exception("throw exception");
			}

			return true;
		} catch (Exception $e) {
			return false;
		}
	}

	public function updateWithPassword()
	{
		try {

			self::$dao->setObj($this);

			$accessInfo = $this->generatePasswordWithSalt($this->getSenha());

			$boolean = self::$dao->update("adm_nome='" . $this->getNome() . "', adm_image='" . $this->getImage() . "', adm_email='" . $this->getEmail() . "', adm_senha='" . $accessInfo['password'] . "', adm_salt='" . $accessInfo['salt'] . "', adm_nivel='" . $this->getNivel() . "', adm_timesession='" . $this->getTimeSession() . "', adm_preferencias='" . $this->getPreferencias() . "'", "adm_id='" . $this->getId() . "'");
			if ($boolean == false) {
				throw new Exception("throw exception");
			}
			$this->setSenha($accessInfo['password']);
			return true;
		} catch (Exception $e) {
			return false;
		}
	}


	public function delete()
	{

		try {

			if (!is_numeric($this->getId())) {
				throw new Exception("throw exception");
			}

			$boolean = self::$dao->remove("adm_id='" . $this->getId() . "'");

			if ($boolean == false) {
				throw new Exception("throw exception");
			}


			return true;
		} catch (Exception $e) {
			return false;
		}
	}


	public function getObject($id = "", $fields = "*")
	{
		self::$dao->setEntity(self::$entity);
		if (is_numeric($id)) {
			$where = "adm_id=" . $id;
		} else {
			if (!is_numeric($id)) {
				return null;
			}
			$where = "adm_id=" . $this->getId();
		}

		$administrador = self::$dao->getObject($fields, $where);

		if (is_object($administrador)) {

			$this->setId($administrador->adm_id);
			$this->setNome($administrador->adm_nome);
			$this->setImage($administrador->adm_image);
			$this->setEmail($administrador->adm_email);
			$this->setSenha($administrador->adm_senha);
			$this->setSalt($administrador->adm_salt);
			$this->setNivel($administrador->adm_nivel);
			$this->setPreferencias(@$administrador->adm_preferencias);
			$this->setTimeSession($administrador->adm_timesession);
			$this->setData($administrador->adm_datacadastro);

			# setting time limit on session
			$time_seconds = parent::timeToSeconds(@$administrador->adm_timesession);
			$this->setTimeLimit($time_seconds);

			self::$dao->setObj($this, "escapeCharacters");
		}
		return null;
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

	public static function isFieldExisting($field, $value)
	{
		$l = self::get($field . "='" . $value . "'", $field);
		return ($l->size() > 0) ? 1 : 0;
	}

	# ---not used--- CS :: Métodos de valiação / redirecionamento de tipos de acesso
	/* Validação de tipos de acessos (pré-determinados):
	 * @method validation(self $adm);
	 * 0 = ADM FULL;
	 * 1 = ADM EDUCACIONAL;
	 * 2 = ADM FINANCEIRO;
	 */
	public static function validation(self $adm)
	{

		if (!is_numeric($adm->getNivel()))
			return false;


		switch ($adm->getNivel()) {

			case 2:
				switch ($_GET['rt']) {
					case "contracts":
					case "contracts/archive":
					case "contracts/add":
					case "contracts/update":
					case "contracts/delete":
					case "payments":
					case "payments/add":
					case "payments/update":
					case "payments/delete":
					case "payments/deletefile":
					case "paynotifications":
					case "paynotifications/send":
					case "services":
					case "services/add":
					case "services/update":
					case "services/delete":
					case "clients":
					case "clients/add":
					case "clients/update":
					case "clients/delete":
					case "clients/xls":
					case "clientusers":
					case "clientusers/add":
					case "clientusers/update":
					case "clientusers/delete":
						return true;
						break;

					default:
						header("Location: " . $adm->getPathUriValidation());
						break;
				}
				break;

			case 1:
				switch ($_GET['rt']) {
					case "students":
					case "students/add":
					case "students/update":
					case "students/delete":
					case "students/rel":
					case "students/xls":
					case "courses":
					case "courses/add":
					case "courses/update":
					case "courses/delete":
					case "courses/xls":
					case "teachers":
					case "teachers/add":
					case "teachers/update":
					case "teachers/delete":
					case "teachers/xls":
					case "lessons":
					case "lessons/student":
					case "lessons/group":
					case "lessons/delete":
					case "schoolgroups":
					case "schoolgroups/add":
					case "schoolgroups/update":
					case "schoolgroups/delete":
					case "schoolgroups/xls":
					case "schoolreports":
					case "schoolreports/group":
					case "schoolreports/student":
					case "schoolreports/lesson":
					case "schoolreports/dados":
					case "clients":
					case "clients/add":
					case "clients/update":
					case "clients/delete":
					case "clients/xls":
					case "clientusers":
					case "clientusers/add":
					case "clientusers/update":
					case "clientusers/delete":
						return true;
						break;

					default:
						header("Location: " . $adm->getPathUriValidation());
						break;
				}
				break;

			case 0:
				return true;
				break;
		}
	}

	/* Redirecionamento por tipos de acessos (pré-determinados):
	 * @method header(self $adm);
	 * 0 = ADM FULL;
	 * 1 = ADM EDUCACIONAL;
	 * 2 = ADM FINANCEIRO;
	 */
	public static function header(self $adm)
	{
		switch ($adm->getNivel()) {
			case 2:
				header("Location: ?rt=payments");
				break;

			case 1:
				header("Location: ?rt=category");
				break;

			case 0:
				header("Location: ?rt=payments");
				break;
		}
	}

	public function addAccess(array $modules)
	{

		if (!is_numeric($this->getId()))
			return false;


		for ($i = 0; $i < sizeof($modules); $i++) {

			$module = new \Auth\AdminModule($modules[$i]);

			if ($module->getId() != '') {

				$l = \Auth\AdminAccessModule::get("lm_adm_id='" . $this->getId() . "' and lm_module_id='" . $module->getId() . "'", "*");

				if ($l->size() == 0) {
					$obj = new \Auth\AdminAccessModule;
					$obj->setModule($module);
					$obj->setAdm($this);
					$obj->setUpdated(date('Y-m-d H:i:s'));
					$obj->setCreated(date('Y-m-d H:i:s'));

					$obj->add();
					unset($obj);
				}
			}

			unset($l);
		}
	}
}
