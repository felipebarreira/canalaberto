<?php
/*
 * @classname: SecurityManager
*/
class SecurityManager{

	const STATE_VALIDATION_KEY = '';
	const STATE_ENCRYPTION_KEY = '';

	/**
	 * @var string the name of the hashing algorithm to be used by {@link computeHMAC}.
	 * See {@link http://php.net/manual/en/function.hash-algos.php hash-algos} for the list of possible
	 * hash algorithms. Note that if you are using PHP 5.1.1 or below, you can only use 'sha1' or 'md5'.
	 *
	 * Defaults to 'sha1', meaning using SHA1 hash algorithm.
	 * @since 1.1.3
	 */
	public $hashAlgorithm='sha1';
	/**
	 * @var mixed the name of the crypt algorithm to be used by {@link encrypt} and {@link decrypt}.
	 * This will be passed as the first parameter to {@link http://php.net/manual/en/function.mcrypt-module-open.php mcrypt_module_open}.
	 *
	 * This property can also be configured as an array. In this case, the array elements will be passed in order
	 * as parameters to mcrypt_module_open. For example, <code>array('rijndael-256', '', 'ofb', '')</code>.
	 *
	 * Defaults to 'des', meaning using DES crypt algorithm.
	 * @since 1.1.3
	 */
	public $cryptAlgorithm='des';

	private $_validationKey;
	private $_encryptionKey;
	
	/**
	 * @return string a randomly generated private key
	 */
	protected function generateRandomKey(){
		return sprintf('%08x%08x%08x%08x',mt_rand(),mt_rand(),mt_rand(),mt_rand());
	}

	/**
	 * @return string the private key used to generate HMAC.
	 * If the key is not explicitly set, a random one is generated and returned.
	 */
	public function getValidationKey(){
		if($this->_validationKey !== null){
			return $this->_validationKey;
		}else{
			if(self::STATE_VALIDATION_KEY !== null){
				$this->setValidationKey(self::STATE_VALIDATION_KEY);
			}else{
				$key = $this->generateRandomKey();
				$this->setValidationKey($key);
				//app()->setGlobalState(self::STATE_VALIDATION_KEY,$key);
			}
			return $this->_validationKey;
		}
	}

	/**
	 * @param string $value the key used to generate HMAC
	 * @throws Exception if the key is empty
	 */
	public function setValidationKey($value){
		if(!empty($value)){
			$this->_validationKey=$value;
		}else{
			throw new Exception('SecurityManager.validationKey cannot be empty.');
		}
	}

	/**
	 * @return string the private key used to encrypt/decrypt data.
	 * If the key is not explicitly set, a random one is generated and returned.
	 */
	public function getEncryptionKey(){
		if($this->_encryptionKey!==null){
			return $this->_encryptionKey;
		}else{
			if(self::STATE_ENCRYPTION_KEY !== null){
				$this->setEncryptionKey(self::STATE_ENCRYPTION_KEY);
			}else{
				$key = $this->generateRandomKey();
				$this->setEncryptionKey($key);
				//app()->setGlobalState(self::STATE_ENCRYPTION_KEY,$key);
			}
			return $this->_encryptionKey;
		}
	}

	/**
	 * @param string $value the key used to encrypt/decrypt data.
	 * @throws Exception if the key is empty
	 */
	public function setEncryptionKey($value){
		if(!empty($value)){
			$this->_encryptionKey = $value;
		}else{
			throw new Exception('SecurityManager.encryptionKey cannot be empty.');
		}
	}

	/**
	 * Encrypts data.
	 * @param string $data data to be encrypted.
	 * @param string $key the decryption key. This defaults to null, meaning using {@link getEncryptionKey EncryptionKey}.
	 * @return string the encrypted data
	 * @throws CException if PHP Mcrypt extension is not loaded
	 */
	public function encrypt($data,$key=null){
		$module=$this->openCryptModule();
		$key=substr($key===null ? md5($this->getEncryptionKey()) : $key,0,@mcrypt_enc_get_key_size($module));
		srand();
		$iv=@mcrypt_create_iv(mcrypt_enc_get_iv_size($module), MCRYPT_RAND);
		@mcrypt_generic_init($module,$key,$iv);
		$encrypted=$iv.@mcrypt_generic($module,$data);
		@mcrypt_generic_deinit($module);
		@mcrypt_module_close($module);
		return $encrypted;
	}

	/**
	 * Decrypts data
	 * @param string $data data to be decrypted.
	 * @param string $key the decryption key. This defaults to null, meaning using {@link getEncryptionKey EncryptionKey}.
	 * @return string the decrypted data
	 * @throws CException if PHP Mcrypt extension is not loaded
	 */
	public function decrypt($data,$key=null){
		$module=$this->openCryptModule();
		$key=substr($key===null ? md5($this->getEncryptionKey()) : $key,0,@mcrypt_enc_get_key_size($module));
		$ivSize=@mcrypt_enc_get_iv_size($module);
		$iv=substr($data,0,$ivSize);
		@mcrypt_generic_init($module,$key,$iv);
		$decrypted=@mdecrypt_generic($module,substr($data,$ivSize));
		@mcrypt_generic_deinit($module);
		@mcrypt_module_close($module);
		return rtrim($decrypted,"\0");
	}

	/**
	 * Opens the mcrypt module with the configuration specified in {@link cryptAlgorithm}.
	 * @return resource the mycrypt module handle.
	 * @since 1.1.3
	 */
	protected function openCryptModule()
	{
		if(extension_loaded('mcrypt')){
			if(is_array($this->cryptAlgorithm))
				$module=@call_user_func_array('mcrypt_module_open',$this->cryptAlgorithm);
			else
				$module=@mcrypt_module_open($this->cryptAlgorithm, '', MCRYPT_MODE_CBC, '');

			if($module===false)
				throw new Exception('Failed to initialize the mcrypt module.');

			return $module;
		}
		else
			throw new Exception('SecurityManager requires PHP mcrypt extension to be loaded in order to use data encryption feature.');
	}

	/**
	 * Prefixes data with an HMAC.
	 * @param string $data data to be hashed.
	 * @param string $key the private key to be used for generating HMAC. Defaults to null, meaning using {@link validationKey}.
	 * @return string data prefixed with HMAC
	 */
	public function hashData($data,$key=null){
		return $this->computeHMAC($data,$key).$data;
	}

	/**
	 * Validates if data is tampered.
	 * @param string $data data to be validated. The data must be previously
	 * generated using {@link hashData()}.
	 * @param string $key the private key to be used for generating HMAC. Defaults to null, meaning using {@link validationKey}.
	 * @return string the real data with HMAC stripped off. False if the data
	 * is tampered.
	 */
	public function validateData($data,$key=null){
		$len=strlen($this->computeHMAC('test'));
		if(strlen($data)>=$len)
		{
			$hmac=substr($data,0,$len);
			$data2=substr($data,$len);
			return $hmac===$this->computeHMAC($data2,$key)?$data2:false;
		}
		else
			return false;
	}

	/**
	 * Computes the HMAC for the data with {@link getValidationKey ValidationKey}.
	 * @param string $data data to be generated HMAC
	 * @param string $key the private key to be used for generating HMAC. Defaults to null, meaning using {@link validationKey}.
	 * @return string the HMAC for the data
	 */
	public function computeHMAC($data,$key=null){
		if($key === null)
			$key = $this->getValidationKey();

		if(function_exists('hash_hmac'))
			return hash_hmac($this->hashAlgorithm, $data, $key);

		if(!strcasecmp($this->hashAlgorithm,'sha1'))
		{
			$pack='H40';
			$func='sha1';
		}
		else
		{
			$pack='H32';
			$func='md5';
		}
		if(strlen($key) > 64)
			$key=pack($pack, $func($key));
		if(strlen($key) < 64)
			$key=str_pad($key, 64, chr(0));
	    $key=substr($key,0,64);
		return $func((str_repeat(chr(0x5C), 64) ^ $key) . pack($pack, $func((str_repeat(chr(0x36), 64) ^ $key) . $data)));
	}


	public static function generateKey($saltpart){

		$entropy = date('YHid') . md5(uniqid(rand(), true)) . $saltpart;
		$sort = mt_rand(0, 1);

		$sec = new SecurityManager;
		$sec->hashAlgorithm = ($sort) ? 'sha1' : 'md5';
		$sec->setValidationKey($saltpart);
		$key = $sec->computeHMAC($entropy);

		return $key;
		
	}

}
