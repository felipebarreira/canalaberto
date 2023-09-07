<?php
namespace Component;
use \ArrayList, \ManagementAccess, \SecurityManager, \GenericDAO, \ArkantasLog, \MailSender, \Exception, \Image;

/*

	CREATE TABLE tb_access_log(
		log_id              	int auto_increment,
		log_login_id        	int not null,
		log_title 				varchar(255) null,
		log_uri 				varchar(255) not null, 
		log_useragent   		varchar(255) default null,
		log_ip      			varchar(120) not null,
		log_updated 			datetime not null,
		log_created 			timestamp not null,
		primary key(log_id),
		foreign key(log_login_id) references tb_loginadapter(login_id) ON DELETE CASCADE
	);
*/
class AccessLog{


}