<?php
/*
 * @classname: ManagementAccess
*/
abstract class ManagementAccess
{

	private $timeLimit = 120; //seconds
	public $fields = array();
	private $pathUriValidation;
	private $session = array();
	protected $useragentValidation = 1;
	protected $rememberMe = 1;
	private $_rememberMe = 'rememberme';
	private $_prefix = '';

	protected static $entity = '';
	public static $dao;


	public function __construct($id = "")
	{
		self::$dao = new GenericDAO;
		self::$dao->setEntity(static::$entity);
		if ($id) {
			$this->getObject($id);
		}
	}


	public function getRememberMe()
	{
		return $this->rememberMe;
	}

	public function hasRememberMe()
	{

		if ($this->getRememberMe() == 0)
			return 0;

		$c = $this->getCookieRememberMe();
		$cookie = $c->getCookie();

		return (!$cookie) ? 0 : 1;
	}

	public function getRememberMeCookieName()
	{
		return $this->_rememberMe;
	}

	public function getPrefix()
	{
		return $this->_prefix;
	}

	public function getCookieRememberMe()
	{
		$cookie = new Cookie($this->getRememberMeCookieName());
		$cookie->setDominio(DOMAIN);
		$cookie->setPath('/');
		return $cookie;
	}

	public function getTimeLimit()
	{
		return $this->timeLimit;
	}

	public function getFields()
	{
		return $this->fields;
	}

	public function getPathUriValidation()
	{
		return $this->pathUriValidation;
	}

	public function getRemoteAddr()
	{
		if (@$_SERVER['HTTP_SAVE_DATA'] == 'on' && @$_SERVER['HTTP_VIA'] != '')
			return @$_SERVER["HTTP_X_FORWARDED_FOR"];

		return $_SERVER['REMOTE_ADDR'];
	}

	public static function getEntity()
	{
		return static::$entity;
	}

	public function setTimeLimit($timeLimit)
	{
		$this->timeLimit = $timeLimit;
	}

	public function setFields($fields)
	{
		$this->fields = $fields;
	}

	public function setPathUriValidation($pathUriValidation)
	{
		$this->pathUriValidation = $pathUriValidation;
	}

	public function setRememberMe($remember)
	{
		$this->rememberMe = $remember;
	}

	public function setRememberMeCookieName($remember)
	{
		$this->_rememberMe = $remember;
	}

	public function setPrefix($prefix)
	{
		$this->_prefix = $prefix;
	}

	public static function setEntity($entity)
	{
		static::$entity = $entity;
	}

	public function getSession()
	{

		$session = $this->session;
		if (sizeof($this->session) == 0) {
			$session = $_SESSION;
		}

		if (sizeof($_SESSION) > 0) {

			# get object on last registry on entity session
			$addr = ($this->getRemoteAddr() == "::1") ? 127001 : str_replace(".", '', $this->getRemoteAddr());
			$uri  = str_replace('http://', '', str_replace('https://', '', $this->getPathUriValidation()));
			$prefix = $this->getPrefix();

			$dao = new GenericDAO;
			$dao->setEntity("session");
			$dao->setLog(0);

			$obj  	 = ($this->useragentValidation == true) ? $dao->getObject("*", "ses_entity='" . static::$entity . "' and ses_entity_id='" . base64_decode(@$_SESSION[$prefix . 'iduser']) . "' and ses_ip='" . $this->getRemoteAddr() . "' and ses_uri='" . $uri . "' and ses_useragent='" . @$_SESSION[$prefix . 'browser'] . "' ORDER BY ses_id DESC LIMIT 0,1") : $dao->getObject("*", "ses_entity='" . static::$entity . "' and ses_entity_id='" . base64_decode(@$_SESSION[$prefix . 'iduser']) . "' and ses_ip='" . $this->getRemoteAddr() . "' and ses_uri='" . $uri . "' ORDER BY ses_id DESC LIMIT 0,1");
			$session = $_SESSION;

			if (is_numeric(@$obj->ses_id)) {
				$session[$prefix . 'sessiontime'] = $this->getTimeLimit();

				$session[$prefix . 'obj'] = $obj;
				$session[$prefix . 'timeleft'] = ($obj->ses_keepalive - time() <= 0) ? '0' : $obj->ses_keepalive - time();
			}
		}

		return $session;
	}


	public function getSessionByToken($token)
	{

		$dao = new GenericDAO;
		$dao->setEntity("session");
		$dao->setLog(false);

		$obj = $dao->getObject("*", "ses_status=1 and ses_token='" . $token . "' ORDER BY ses_id DESC LIMIT 0,1");
		$session = $_SESSION;
		$prefix  = $this->getPrefix();

		if ($token == "")
			return $session;

		if (is_numeric(@$obj->ses_id)) {
			$session[$prefix . 'sessiontime'] = $this->getTimeLimit();

			$session[$prefix . 'obj'] = $obj;
			$session[$prefix . 'timeleft'] =  $obj->ses_keepalive - time();
			$session[$prefix . 'token'] = $obj->ses_token;
			$session[$prefix . 'status'] = $obj->ses_status;

			if ($session[$prefix . 'status'] == "0") {
				$session[$prefix . 'sessiontime'] = 0;
				$session[$prefix . 'timeleft'] = 0;
			}
		}

		return $session;
	}

	public function getUserByToken($token)
	{

		$key = $this->getSessionByToken($token);
		$prefix  = $this->getPrefix();
		if (!is_array($key))
			return false;

		return @$key[$prefix . 'obj']->ses_entity_id;
	}

	/*
	 * methods
	*/
	protected function _getUser($id)
	{
		self::$dao->setEntity(static::$entity);

		$db_id		= $this->fields['id'];
		$db_salt	= $this->fields['salt'];

		$object = self::$dao->getObject("*", $db_id . "='" . $id . "'");
		if (!is_numeric(@$object->$db_id))
			return 0;

		return $object;
	}

	protected function _getUserSalt($id)
	{
		$db_salt = $this->fields['salt'];
		return @$this->_getUser($id)->$db_salt;
	}

	public function decodeId()
	{
		$prefix = $this->getPrefix();
		if (@$_SESSION[$prefix . 'iduser'] != "")
			return base64_decode($_SESSION[$prefix . 'iduser']);


		return 0;
	}

	protected function getAlgorithmObject($salt)
	{
		$salt = strtolower(substr($salt, -1));
		if ($salt == "m")
			return "md5";
		else
			return "sha1";
	}

	public function isTokenAuthenticated($token)
	{

		$authenticated = 1;
		$prefix = $this->getPrefix();
		$key = $this->getSessionByToken($token);
		$authenticated = (@$key[$prefix . 'timeleft'] > 0 && $key[$prefix . 'status'] == "1") ? 1 : 0;
		if (!$authenticated) {

			# logout
			\Component\LoginSession::status(0, $token);
			$this->destroyAccess(false);
		}

		return $authenticated;
	}

	public function isSessionAuthenticated($aliveValidation = 1)
	{
		$prefix = $this->getPrefix();
		$authenticated = 1;
		$timecurrent = time();

		# validation data
		if (@$_SESSION[$prefix . 'entity'] != static::$entity)
			$authenticated = 0;

		if (@$_SESSION[$prefix . 'ip'] != $this->getRemoteAddr())
			$authenticated = 0;

		if ($this->useragentValidation == 1) {
			if (@$_SESSION[$prefix . 'browser'] != $_SERVER["HTTP_USER_AGENT"])
				$authenticated = 0;
		}

		# alive validation
		if ($aliveValidation == 1) {
			if ($this->isAlive() == 0)
				$authenticated = 0;
		} else {
			if ($timecurrent > ($_SESSION[$prefix . 'time'] + ($this->getTimeLimit())))
				$authenticated = 0;
		}

		# destroy if not authenticated
		if ($authenticated == 0) {

			# rememberme validation before destroy
			if ($this->hasRememberMe()) {
				$authenticated = $this->validateRememberMe();
				//echo $authenticated; exit;
			}

			if ($authenticated == 0)
				$this->destroyAccess();
		}

		return $authenticated;
	}

	protected function validateRememberMe()
	{
		$cookie = $this->getCookieRememberMe()->getCookie();

		if (!$cookie)
			return 0;


		list($user, $salt, $mac) = explode(':', $cookie);
		if (!hash_equals(hash_hmac('sha256', $user . ':' . $salt, PROJECTKEY), $mac))
			return 0;

		$user_salt = $this->_getUserSalt($user);
		if (!@hash_equals($user_salt, $salt))
			return 0;

		#
		//if($this->isSessionAuthenticated(false))
		//	return 1;

		#
		$user = $this->_getUser($user);
		$register = $this->registerSession($user);

		if (!$register)
			return 0;

		$db_id = $this->fields['id'];
		$this->getObject($user->$db_id);


		return ($register) ? 1 : 0;
	}

	public function isAuthenticated($aliveValidation = 1, $redirect = "")
	{
		$redirect 	   = ($redirect == "" && $this->getPathUriValidation() != "") ? $this->getPathUriValidation() : $redirect;
		$authenticated = $this->isSessionAuthenticated($aliveValidation);

		if (!$authenticated) {
			$this->destroyAccess(1, $redirect);
		}
	}

	protected function isAlive()
	{

		$keepalive   = 0;
		$timecurrent = time();
		$addr 		 = ($this->getRemoteAddr() == "::1") ? 127001 : str_replace(".", '', $this->getRemoteAddr());
		$uri  		 = str_replace('http://', '', str_replace('https://', '', $this->getPathUriValidation()));
		$prefix 	 = $this->getPrefix();

		# get session
		$session = $this->getSession();
		$session = @$session[$prefix . 'obj'];

		if (is_object($session)) {
			if (is_numeric($session->ses_id)) {

				if ($_SESSION[$prefix . 'keysession'] === hash('sha256', $addr . $uri . $session->ses_keytime)) {


					if ($session->ses_keepalive == ($_SESSION[$prefix . 'time'] + ($this->getTimeLimit()))) {
						if ($timecurrent > $session->ses_keepalive) {
							return 0;
						}
					} else
						return 0;

					/*
					echo "ses:" . $session->ses_keepalive;
					echo "<br />";
					echo "_se:" . ($_SESSION['time'] + ($this->getTimeLimit()));
					echo "<br />";
					echo "tim:" . $timecurrent;
					echo "<br />";
					echo "__t:" . $_SESSION['time'];

					echo $session->ses_keepalive . "<br />";
					echo ($_SESSION['time'] + ($this->getTimeLimit())) . "<br><br>";
					echo ($_SESSION['time'] + ($this->getTimeLimit())) - $timecurrent;
					exit;*/

					if (($_SESSION[$prefix . 'time'] + ($this->getTimeLimit())) > $timecurrent) {
						$keytime = intval(ceil(($timecurrent / 2)));
						$this->updateSession($keytime, $timecurrent, $session);
						$keepalive = 1;
					} else {
						$keepalive = 0;
					}
				}
			}
		}

		return $keepalive;
	}

	private function updateSession($keytime, $timecurrent, $session)
	{

		$addr 		 = ($this->getRemoteAddr() == "::1") ? 127001 : str_replace(".", '', $this->getRemoteAddr());
		$uri  		 = str_replace('http://', '', str_replace('https://', '', $this->getPathUriValidation()));
		$prefix 	 = $this->getPrefix();

		# dao update
		$dao = new GenericDAO;
		$dao->setEntity("session");
		$dao->setLog(0);
		$update  = $dao->update("ses_keytime='" . $keytime . "', ses_keepalive='" . ($timecurrent + ($this->getTimeLimit())) . "'", "ses_id='" . $session->ses_id . "'");

		if ($update) {
			$_SESSION[$prefix . 'time'] = $timecurrent;
			$_SESSION[$prefix . 'keysession'] = hash('sha256', $addr . $uri . $keytime);
		}

		return $update;
	}

	protected function registerSession($obj)
	{

		$register = 0;

		//cria campo em tb_session e cria as sessions de login
		$dao = new GenericDAO;
		$dao->setEntity("session");
		$dao->setLog(0);

		$db_id		= $this->fields['id'];
		$db_salt	= $this->fields['salt'];
		$db_time	= $this->fields['time'];
		$db_login	= $this->fields['login'][1];
		$db_senha	= $this->fields['pass'][1];

		$version = @addslashes($_POST[$this->fields['version']]);
		$fcm = (@$_POST[$this->fields['fcm']] != "") ? "'" . $_POST[$this->fields['fcm']] . "'" : 'NULL';
		$prefix  = $this->getPrefix();

		# necessário para o registro da sessão inicial e sobrescrever o tempo padrão da classe
		if ($db_time != '')
			$this->setTimeLimit(self::timeToSeconds($obj->$db_time));


		$time	 = time();
		$keytime = intval(ceil(($time / 2)));
		$addr    = ($this->getRemoteAddr() == "::1") ? 127001 : str_replace(".", '', $this->getRemoteAddr());
		$uri 	 = str_replace('http://', '', str_replace('https://', '', $this->getPathUriValidation()));
		$key_session_token = hash('sha256', @$obj->$db_id . $addr . $uri . $keytime);

		$add 	 = $dao->add("ses_token||ses_fcm||ses_entity||ses_entity_id||ses_uri||ses_ip||ses_useragent||ses_keytime||ses_keepalive||ses_version||ses_datetime", "'" . $key_session_token . "'||" . $fcm . "||'" . static::$entity .  "'||'" . $obj->$db_id . "'||'" . $uri . "'||'" . $this->getRemoteAddr() . "'||'" . $_SERVER["HTTP_USER_AGENT"] . "'||'" . $keytime . "'||'" . ($time + $this->getTimeLimit()) . "'||'" . $version . "'||'" . date("Y-m-d H:i:s") . "'");

		if ($add) {
			$_SESSION[$prefix . 'entity']		= static::$entity;
			$_SESSION[$prefix . 'iduser']		= base64_encode($obj->$db_id);
			$_SESSION[$prefix . 'time']		= $time;
			$_SESSION[$prefix . 'keysession']	= hash('sha256', $addr . $uri . $keytime);
			$_SESSION[$prefix . 'ip']			= $this->getRemoteAddr();
			$_SESSION[$prefix . 'browser']	= $_SERVER["HTTP_USER_AGENT"];
			$_SESSION[$prefix . 'token']		= $key_session_token;

			# remember-me by cookie
			$this->registerRememberMe($obj->$db_id, $obj->$db_salt);

			$register = 1;
		}

		unset($dao, $keytime, $addr, $uri, $add);
		return $register;
	}

	protected function registerRememberMe($iduser, $salt)
	{

		if ($this->getRememberMe() == 1) {

			$cookie = $this->getCookieRememberMe();
			$data = $iduser . ':' . $salt;
			$mac = hash_hmac('sha256', $data, PROJECTKEY);
			$data .= ':' . $mac;

			$cookie->setCookie($data, (time() + 31556926)); // 1 year
		}
	}

	public function authenticateAccess()
	{

		if ($this->isSessionAuthenticated())
			return 1;

		self::$dao->setEntity(static::$entity);
		$login = addslashes($_POST[$this->fields['login'][0]]);
		$senha = addslashes($_POST[$this->fields['pass'][0]]);

		$db_id		= $this->fields['id'];
		$db_salt	= $this->fields['salt'];
		$db_login	= $this->fields['login'][1];
		$db_senha	= $this->fields['pass'][1];

		try {

			if (empty($login))
				throw new Exception("Informe: Login");
			if (empty($senha))
				throw new Exception("Informe: Senha");

			$object = self::$dao->getObject("*", $this->fields['login'][1] . "='" . $login . "'");
			if (!is_numeric(@$object->$db_id))
				throw new Exception("Usuário não encontrado");

			//check password
			$hashPass = $this->getHash($object->$db_salt, $senha, $this->getAlgorithmObject($object->$db_salt));
			if ($hashPass == $object->$db_senha) {

				//register sessions
				if (!$this->registerSession($object))
					throw new Exception("Ocorreu um erro de persistência.");
			} else
				throw new Exception("Senha Inválida");

			return 1;
		} catch (Exception $e) {
			return $e->getMessage();
		}
	}

	protected function getHash($data, $key, $algorithm = 'md5')
	{
		$security = new SecurityManager;
		$security->hashAlgorithm = $algorithm;
		$security->setValidationKey($key);
		return $security->computeHMAC($data);
	}

	public function destroyAccess($redirect = 0, $href = "?")
	{
		$prefix  = $this->getPrefix();

		# session
		unset($_SESSION[$prefix . 'entity'], $_SESSION[$prefix . 'iduser'], $_SESSION[$prefix . 'time'], $_SESSION[$prefix . 'keysession'], $_SESSION[$prefix . 'ip'], $_SESSION[$prefix . 'browser'], $_SESSION[$prefix . 'token']);

		# cookie (rememberme)
		$cookie = $this->getCookieRememberMe()->destroy();

		if ($redirect) {
			header("Location: " . $href);
			exit();
		}
	}

	public static function timeToSeconds($time)
	{
		$str_time = preg_replace("/^([\d]{1,2})\:([\d]{2})$/", "$1:$2:00", $time);
		sscanf($str_time, "%d:%d:%d", $hours, $minutes, $seconds);
		return ($hours * 3600 + $minutes * 60 + $seconds);
	}

	//methods on class
	public function getObject($id = "", $fields = "*")
	{
	}
}
