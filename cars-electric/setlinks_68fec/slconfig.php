<?php
/*
 Код вызова ссылок SetLinks.ru.
 Версия 3.0.8.
*/
class SLConfig
{
    var $aliases = Array(); // алиасы сайтов. без www, в нижнем регистре. пример: Array("sitealias.ru" => "mainsite.ru", "sitealias2.ru" => "mainsite.ru")
    var $password = '0ef3827241c11e8b551dcdb250368fec';  // Пароль                    
    var $encoding = 'WINDOWS-1251'; // Необходимая вам кодировка. (WINDOWS-1251, UTF-8, KOI8-R)
    var $server = 'show.setlinks.ru'; // сервер с которого берутся коды ссылок
    var $cachetimeout = 600;  // Время обновления кеша в секундах
    var $errortimeout = 60;  // Период обновления кеша после ошибки в секундах
    var $cachedir = ''; // Директория куда будет сохраняться кеш(если пусто, то будет сохранен в папке со скриптом), в конце обязателен слэш "/"    
    var $cachetype = 'FILE'; // тип кеша. (FILE, MYSQL)
    var $connecttype = '';  // тип соединения с сервером setlinks. (CURL - использовать библиотеку CURL, SOCKET - использовать сокеты, NONE - не соединяться с сервером, использовать данные кеша)
                            // если $connecttype пусто, то тип соединения определяется автоматом
    var $sockettimeout = 10; // Ожидание кода, секунд    
    var $indexfile = '^/index\\.(html|htm|php|phtml|asp)$'; // фильтр индексной страницы 
}

?>
