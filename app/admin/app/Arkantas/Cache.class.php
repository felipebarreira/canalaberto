<?php
/*
	Classe: Cache
	
		- 19-04-2011
	
	Desenvolvido por: Felipe Gallo
	www.arkantas.com
*/
class Cache{

    private $cacheDir = 'cache/';
    private $cacheTime = 20;

    private $caching = false;
    private $arquivo;

	
    public function load($url = "", $cron = ""){
	
		if(!empty($url) || !empty($cron)){
			$this->setArquivo($url);
			$this->setCacheTime($cron);
		}
		$arquivo = $this->getArquivo();
        if(file_exists($arquivo) && (filemtime($arquivo) + $this->getCacheTime()) > time()){
		
            //Grab the cache:
            $handle = fopen($arquivo, "r");
            do {
                $data = fread($handle, filesize($arquivo));
                if (strlen($data) == 0) {
                    break;
                }
				echo $data;
            } while (true);
            fclose($handle);
			//exit();
        }
        else
        {
            $this->setCaching(true);
            ob_start();
        }
    }

	public function getCacheDir(){
		return $this->cacheDir;
	}
	
	public function getCacheTime(){
		return $this->cacheTime;
	}
	
	public function getCaching(){
		return $this->caching;
	}
	
	public function getArquivo(){
		return $this->arquivo;
	}
	
	
	public function setCacheDir($cacheDir){
		$this->cacheDir = $cacheDir;
	}
	
	public function setCacheTime($cacheTime){
		$this->cacheTime = $cacheTime;
	}
	
	public function setCaching($caching){
		if(is_bool($caching)){
			$this->caching = $caching;
		}
	}
	
	public function setArquivo($arquivo){
		$this->arquivo = $this->getCacheDir() . urlencode($arquivo);
	}
	
	
	public function addPage($pagina){
		$this->load();
		
		if($this->getCaching() == true){
			include($pagina);
			$this->close();
		}
	}

    private function close(){
		if($this->getCaching() == true){
            $data = ob_get_clean();
            echo $data;
            $fp = fopen($this->getArquivo(), 'w');
            fwrite ($fp , $data);
            fclose ($fp);
        }
    }
	
}

/*

	$ch = new Cache;
	$ch->setArquivo("galeria-de-fotos.html");
	$ch->setCacheTime(86400);
	
	$ch->addPage('galeria-index.php');

*/
?>