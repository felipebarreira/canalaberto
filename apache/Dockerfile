FROM php:8.2-apache

RUN a2enmod rewrite
COPY . /var/www/html/
EXPOSE 80
CMD echo "ServerName localhost" >> /etc/apache2/apache2.conf
CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]

RUN docker-php-ext-install pdo pdo_mysql