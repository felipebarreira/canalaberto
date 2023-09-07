<?php
namespace Component;

use \Image;

trait SingleImageUpload{
	

	public static $persistImage = true;

	/*
	 * Realiza upload do thumb do login
	 * @return string
 	 */
	public function uploadImage($image, $type_resize = 'crop'){
		
		# basic validation
		if(self::$persistImage){
		if(!is_numeric($this->getId()))
			return false;
		}

		if(!is_array($image))
			return false;

		if($image['tmp_name'] == '')
			return false;

		if(!is_dir(self::getPathPaste()) == true)
			return 'Diretório informado não é válido.';

		# operations
		set_time_limit(0);

		$images  = scandir(self::getPathPaste());
		$maxSize = 18192000;
		
		// image info
		$real_filename = $image['name'];
		$arr_ext = explode('.', $image['name']);

		if(self::$persistImage){
		$image['name'] = $this->getId() . "-p" . date('ymds') . "." . strtolower(end($arr_ext));
		}else{
		$image['name'] = rand(0,99999) . "-p" . date('ymds') . "." . strtolower(end($arr_ext));
		}
		
		// image name validation
		if(in_array($image['name'], $images)){
			$fname = reset($arr_ext);
			$fext  = "." . strtolower(end($arr_ext));
			$image['name'] = $fname . "-" . date('ymds') . $fext;
			return $this->uploadImage($image);
		}

		//check if extentions is allowed on array
		$allow = $this->isValidExtentionImage($image['name']);
		if(!$allow)
			return "Apenas as extensões .jpg, .gif, .png e .bmp são permitidas.";
		
		// check filesize limit
		if(filesize($image['tmp_name']) > $maxSize)
			return "Tamanho da imagem ".$real_filename." é superior ao permitido (".self::humanFileSize($maxSize).").";

		// upload
		$this->deleteImage(); 	#remove thumb atual
		if(!move_uploaded_file($image['tmp_name'], self::getPathPaste() . $image['name']))
			return "Não foi possível fazer upload da imagem ".$real_filename."";

		// persist
		$this->setImage($image['name']);

		if(self::$persistImage){
		$update = $this->update();
		if(!$update){
			unlink(self::getPathPaste() . $image['name']);
			return "Ocorreu um problema na persistência dos dados da imagem ".$real_filename."";
		}
		}

		# EXIF conditions/rotate if necessary
		Image::imageFixOrientation(self::getPathPaste() . $image['name']);

		//resize image
		$img = new Image(self::getPathPaste() . $image['name']);
		$img->transparency();
		
		if(self::getWidthThumb() != null && self::getHeightThumb() != null)
			$img->resize(self::getWidthThumb(), self::getHeightThumb(), $type_resize)->save(self::getPathPaste() . $image['name']);


		return true;
	}

	public function deleteImage(){
		
		if(!self::$persistImage)
			return false;

		if($this->getImage() != ""){
			if(is_dir(self::getPathPaste())){
				if(file_exists(self::getPathPaste() . $this->getImage())){
					if(!unlink(self::getPathPaste() . $this->getImage()))
						return false;
				}
			}
		}
		return true;
	}

	protected function isValidExtentionImage($imageName){
		$allow = 0;
		$allowedExtensions = array(
			array("name" => "jpg"),
			array("name" => "jpeg"),
			array("name" => "png"),
			array("name" => "gif"),
			array("name" => "bmp")
		);
		
		foreach($allowedExtensions as $extension){
			$arr_ext = explode(".", strtolower($imageName));
			if($extension['name'] == end($arr_ext)){
				$allow = 1;
				break;
			}
		}
		
		return $allow;
	}


	public static function humanFileSize($size,$unit="") {
	  if( (!$unit && $size >= 1<<30) || $unit == "GB")
	    return number_format($size/(1<<30),2)."GB";
	  if( (!$unit && $size >= 1<<20) || $unit == "MB")
	    return number_format($size/(1<<20),2)."MB";
	  if( (!$unit && $size >= 1<<10) || $unit == "KB")
	    return number_format($size/(1<<10),2)."KB";
	  return number_format($size)." bytes";
	}

}
?>