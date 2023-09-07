<?php
/*
 * @classname: Template
 * @created: 21-07-2012
 * @update : 13-09-2021 - implement template-engine solution "twig"
*/
class Template
{

	public $twig;
	private $hasEngine = 0;
	private $registro;
	private $prefix = '';
	protected $vars = array();


	public function __construct($objRegistro = "")
	{

		$this->setRegistro($objRegistro);

		// start twig
		$this->loadTwig();
	}

	public function setPrefix($prefix)
	{
		$this->prefix = $prefix;

		// reset twig
		$this->loadTwig();
	}

	private function loadTwig()
	{
		if ($this->hasEngine) {
			// Specify our Twig templates location
			$loader = new \Twig\Loader\FilesystemLoader(ARKANTAS_MVC_SYSTEM . '/views' . $this->prefix);

			// Instantiate our Twig
			$this->registro->twig = new \Twig\Environment($loader, [
				//'debug' => true
				//'cache' => PATH . 'uploads/template_cache',
			]);

			$this->twig = $this->registro->twig;
		}
	}

	public function setRegistro($registro)
	{
		$this->registro = $registro;
	}

	public function __set($index, $value)
	{
		$this->vars[$index] = $value;
	}

	public function getVar($index)
	{
		return @$this->vars[$index];
	}

	public function show($name)
	{

		$path = ARKANTAS_MVC_SYSTEM . '/views' . $this->prefix . '/' . $name . '.php';
		$ext  = $this->findExtension($name);

		if ($ext == "twig")
			$path = ARKANTAS_MVC_SYSTEM . '/views' . $this->prefix . '/' . $name;

		if (!file_exists($path)) {
			throw new Exception('Template not found: ' . $path);
			return false;
		}

		// Load engine
		if ($this->hasEngine && $ext == "twig") {
			$vars = array();

			// Load variaveis
			foreach ($this->vars as $key => $value) {
				$vars[$key] = $value;
			}

			echo $this->registro->twig->render($name, $vars);
		} else {

			// Load variaveis
			foreach ($this->vars as $key => $value) {
				$$key = $value;
			}

			include($path);
		}
	}

	public function show_path($path, $name)
	{
		$path = $path . $name . '.php';
		$ext  = $this->findExtension($name);

		if ($ext == "twig")
			$path = $path . $name;

		if (!file_exists($path)) {
			throw new Exception('Template not found: ' . $path);
			return false;
		}

		// Load engine
		if ($this->hasEngine && $ext == "twig") {
			$vars = array();

			// Load variaveis
			foreach ($this->vars as $key => $value) {
				$vars[$key] = $value;
			}

			echo $this->registro->twig->render($name, $vars);
		} else {

			// Load variaveis
			foreach ($this->vars as $key => $value) {
				$$key = $value;
			}

			include($path);
		}
	}

	private function findExtension($filename)
	{
		$filename = strtolower($filename);
		$exts = explode(".", $filename);
		$n = count($exts) - 1;
		$exts = $exts[$n];
		return $exts;
	}
}
