<?php
use Jenssegers\Agent\Agent;
use duncan3dc\Laravel\BladeInstance;

Class TemplateAdapter extends Template{


	public function show($name){

		$agent = new Agent();
		$type  = 'desktop';

		if($agent->isMobile() || $agent->isTablet())
			$type = 'mobile';

		if(@$_GET['mobile'] == 1)
			$type = 'mobile';

		if($_SERVER["SERVER_NAME"] == ('m.'.DOMAIN))
			$type = 'mobile';

		#
		$path = ARKANTAS_MVC_SYSTEM . '/views/' . $type . '/' . $name . '.php';
		$path_blade = ARKANTAS_MVC_SYSTEM . '/views/' . $type . '/' . $name . '.blade.php';
		$dir  = ARKANTAS_MVC_SYSTEM . '/views/' . $type;
		echo $path; exit;
		if (!file_exists($path)){
			if (!file_exists($path_blade)){
				throw new Exception('Template não encontrado em '. $path);
				return false;
			}
			$path = $path_blade;
		}

		# Load vars
		foreach ($this->vars as $key => $value)
			$$key = $value;
		
		# include
		include($path);
	}

}
?>
