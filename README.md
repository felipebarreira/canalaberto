Documentação Técnica – Canal Aberto
===

![logo](https://felipegallo.s3.sa-east-1.amazonaws.com/fit/software-product/logo-canal-aberto-fit.png)

🚀 Bem-vindo a documentação do **Canal Aberto** - desenvolvido para fins academicos na Faculdade Impacta Tecnologia.
  

## Introdução

O **“Canal Aberto”** é um serviço online que visa proporcionar um canal seguro entre empresa-cliente para denúncias, relatos e feedbacks sobre condutas, onde o usuário pode, anonimamente, realizar uma queixa/denúncia através do seu relato. 

## Instalação
Utilizando o Docker, basta executar os comandos de ```build``` e  ```up``` para inicializar o serviço:

```
docker-compose build
docker-compose up
```

> Disponível em http://localhost, caso a porta 80 não seja modificada no arquivo docker-compose.yml


## Painel administrativo

O acesso ao painel administrativo se dá através do link http://localhost/admin

Login: admin@impacta.com.br

Senha: done#2023

> 🔐 Gerenciamento de acessos administrativos disponível no menu "Configurações > Administradores"

## Observações e notas adicionais

**GitHub do projeto:** https://github.com/felipebarreira/canalaberto

