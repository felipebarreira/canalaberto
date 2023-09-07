DROP DATABASE IF EXISTS db_canalaberto;

CREATE DATABASE db_canalaberto;
USE db_canalaberto;

CREATE TABLE tb_administracao(
	adm_id 				int(11) NOT NULL AUTO_INCREMENT,
	adm_nome 			varchar(200) NOT NULL,
	adm_image 			varchar(255),
	adm_email 			varchar(200) NOT NULL UNIQUE,
	adm_senha 			varchar(40) NOT NULL,
	adm_salt			varchar(12) not null,
	adm_nivel 			smallint(2) NOT NULL,
	adm_preferencias	mediumtext,
	adm_timesession		TIME NOT NULL DEFAULT '00:20:00',
	adm_datacadastro  	date NOT NULL,
	PRIMARY KEY  (adm_id)
)engine=InnoDB;

INSERT INTO `tb_administracao` (`adm_id`, `adm_nome`, `adm_email`, `adm_senha`, `adm_salt`, `adm_nivel`, `adm_preferencias`, `adm_datacadastro`) VALUES
(1, 'Felipe Gallo Barreira', 'felipegallobarreira@gmail.com', 'a6fe1214e013f2aa85a8df8c39edb7b7', '81732152236m', 0, '', '2013-08-01'),
(2, 'ADMIN FIT', 'admin@impacta.com.br', 'b44c6d8e005e7dd4422420266e4a7e92cc3b23fc', '61929819443s', 0, NULL, '2023-09-07');

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

CREATE TABLE tb_log(
  log_id              int(11) auto_increment,
  log_entidade        varchar(100) not null,
  log_key 			  varchar(255) null,
  log_operacao        mediumtext,
  log_entidadeLogin   varchar(100) default null,
  log_entidadeId      int(11) null,
  log_ip              varchar(80) not null,
  log_data            timestamp not null,
  primary key(log_id)
)engine=InnoDB;

CREATE TABLE tb_session(
	ses_id					int(11) not null auto_increment,
	ses_token				VARCHAR( 255 ) NOT NULL,
	ses_fcm				 	VARCHAR( 255 ) NULL DEFAULT NULL,
	ses_entity				varchar(100) not null,
	ses_entity_id			int(11) not null,
	ses_uri					varchar(128) NOT NULL,
	ses_ip					VARCHAR(255) NOT NULL,
	ses_useragent			varchar(255) not null,
	ses_keytime				bigint(20) NOT NULL,
	ses_keepalive			int(11) not null,
	ses_version				varchar(255),
	ses_status				TINYINT(1) NOT NULL DEFAULT '1',
	ses_datetime			DATETIME not null,
	primary key(ses_id)
)engine=InnoDB;
