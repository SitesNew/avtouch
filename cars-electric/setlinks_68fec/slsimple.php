<?php
/*
 Код вызова ссылок SetLinks.ru.
 Версия 3.0.7.
*/
require_once(dirname(__FILE__)."/slclient.php");

$sl = new SLClient();
echo $sl->GetLinks(); 

?>
