<?php
/*
	Classe: Conexão FTP
	Objetivo:
		- Tem como objetivo fazer upload e download do FTP desejado com total facilidade.
			
	Desenvolvido por: Felipe Gallo
	www.arkantas.com
*/

class conexaoFTP{

	private $servidor;
	private $usuario;
	private $senha;
	
	public function __construct($servidor, $usuario, $senha){
		$this->setServidor($servidor);
		$this->setUsuario($usuario);
		$this->setSenha($senha);
		
		return true;
	}
	
	public function getServidor(){
		return $this->servidor;
	}

	public function getUsuario(){
		return $this->usuario;
	}
	
	public function getSenha(){
		return $this->senha;
	}
	

	public function setServidor($servidor){
		$this->servidor = $servidor;
	}

	public function setUsuario($usuario){
		$this->usuario = $usuario;
	}	
	
	public function setSenha($senha){
		$this->senha = $senha;
	}
	
	public function upload($local_arquivo, $ftp_pasta, $ftp_arquivo){
	$ftp = $this->conecta($this->getServidor());
		if($ftp == false){
			return false;
		}else{
			if($this->login($ftp) == false){
				return false;
			}else{
				$resposta_envio = $this->uploadFTP($ftp, $ftp_pasta.$ftp_arquivo, $local_arquivo);
				$this->desconecta($ftp);
			}
		}
		return true;
	}
	
	public function download($local_arquivo, $ftp_pasta, $ftp_arquivo){
	$ftp = $this->conecta($this->getServidor());
		if($ftp == false){
			return false;
		}else{
			if($this->login($ftp) == false){
				return false;
			}else{
				$resposta_recebimento = $this->downloadFTP($ftp, $local_arquivo, $ftp_pasta.$ftp_arquivo);
				$this->desconecta($ftp);
			}
		}
		return true;
	}
	
	private function conecta(){
		$ftp = ftp_connect($this->getServidor());
		return $ftp;
	}
	
	private function login($ftp){
		$logou = ftp_login($ftp, $this->getUsuario(), $this->getSenha());
		return $logou;
	}
	
	private function uploadFTP($ftp, $ftp_arquivo, $local_arquivo){
		$envio = ftp_put($ftp, $ftp_arquivo, $local_arquivo, FTP_BINARY);
		return $envio;
	}
	
	private function downloadFTP($ftp, $local_arquivo, $ftp_arquivo){
		$recebe = ftp_get($ftp, $local_arquivo, $ftp_arquivo, FTP_BINARY);
		return $recebe;
	}
	
	private function desconecta($ftp){
		ftp_close($ftp);
	}
	
}
/*
	Exemplo:
	set_time_limit(0);
	$ftp = new ConexaoFTP("", "", "");
	//$envio = $ftp->insereArquivoFTP("C:\Apache\Apache\htdocs\huhu1.jpg", "/public_html/", "huhu.jpg");
	$envio = $ftp->download("C:\Apache\Apache\htdocs\huhu1.jpg", "/public_html/", "huhu.jpg");
		if($envio == true){
			echo "ENVIOU";
		}else{
			echo "FALSO";
		}
*/
?>
