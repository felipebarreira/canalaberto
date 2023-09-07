<?php
namespace Component;


trait SingleFileUpload{

	protected $datafile;

	public static $persist = true;
	public static $prefix = 'p';
	protected static $maxSize = 100485760;
	protected static $_allowedExtensions = array(
		array("name" => "jpg"),
		array("name" => "jpeg"),
		array("name" => "png"),
		array("name" => "gif"),
		array("name" => "ppt"),
		array("name" => "pptx", "ico" => "ppt"),
		array("name" => "pps"),
		array("name" => "xls"), 
		array("name" => "xlsx"),
		array("name" => "doc"),
		array("name" => "docx", "ico" => "doc"),
		array("name" => "pdf"),
		array("name" => "zip"),
		array("name" => "rar", "ico" => "zip"),
		array("name" => "mp3"),
		array("name" => "mp4"),
		array("name" => "wav"),
		array("name" => "wmv"),
		array("name" => "mov"),
		array("name" => "avi"),
		array("name" => "flv"),
		array("name" => "fla"),
		array("name" => "3gp"),
		array("name" => "ai"),
		array("name" => "design"),
		array("name" => "in"),
		array("name" => "html"),
		array("name" => "htm"),
		array("name" => "css"),
		array("name" => "js"),
		array("name" => "txt")
	);

	public function uploadData($file){

		# basic validation
		//if(!is_numeric($this->getId()))
		//	return false;

		if(!is_array($file))
			return false;

		if($file['tmp_name'] == '')
			return false;

		if(!is_dir(self::getPathPaste()) == true)
			return 'Diretório informado não é válido.';

		# operations
		set_time_limit(0);

		$files = scandir(self::getPathPaste());

		// file info
		$real_filename = $file['name'];
		$arr_ext = explode('.', $file['name']);
		$file['name'] = self::$prefix . "-" .$this->getId() . date('ymds') . "." . strtolower(end($arr_ext));
		
		// file name validation
		if(in_array($file['name'], $files)){
			$fname = reset($arr_ext);
			$fext  = "." . strtolower(end($arr_ext));
			$image['name'] = $fname . "-" . date('ymds') . $fext;
			return $this->uploadData($file);
		}

		//check if extentions is allowed on array
		$allow = $this->isValidExtention($file['name']);
		if(!$allow)
			return "Extensão não permitida para upload (".$real_filename.").";
		
		// check filesize limit
		if(filesize($file['tmp_name']) > self::$maxSize)
			return "Tamanho do arquivo ".$real_filename." é superior ao permitido (".FileSizeConvert(self::$maxSize)." bytes).";

		// upload
		if(self::$persist) $this->deleteData(); # remove data atual
		if(!move_uploaded_file($file['tmp_name'], self::getPathPaste() . $file['name']))
			return "Não foi possível fazer upload do arquivo ".$real_filename."";

		// persist
		$this->setDataFile($file['name']);

		if(self::$persist){
		$this->setData($file['name']);
		if(is_numeric($this->getId())){
			$update = $this->update();
			if(!$update){
				unlink(self::getPathPaste() . $file['name']);
				return "Ocorreu um problema na persistência dos dados do arquivo ".$real_filename."";
			}
		}
		}

		return true;
	}
	
	private function isValidExtention($name){
		$allow = 0;
		foreach(self::$_allowedExtensions as $extension){
			$arr_ext = explode(".", strtolower($name));
			if($extension['name'] == end($arr_ext)){
				$allow = 1;
				break;
			}
		}
		
		return $allow;
	}

	public function deleteData(){
		if(self::$persist){
		if($this->getData() != ""){
			if(is_dir(self::getPathPaste())){
				if(file_exists(self::getPathPaste() . $this->getData())){
					if(!unlink(self::getPathPaste() . $this->getData()))
						return false;
				}
			}
		}
		}
		return true;
	}


	public function setDataFile($data){
		$this->datafile = $data;
	}

	public function getDataFile(){
		return $this->datafile;
	}
}
?>