
<?php
header("Content-Type: text/html; charset=UTF-8");

include("cfg.php");

function usertimes()
{
    global $timenewuser, $userfile;

    if (!file_exists($userfile)) {
        return;
    }

    $userarray = file($userfile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $changes = false;

    foreach ($userarray as $key => $line) {
        $explode = explode("|", $line);
        $time = isset($explode[1]) ? (int)$explode[1] : 0;

        if (time() > $time) {
            unset($userarray[$key]);
            $changes = true;
        }
    }

    if ($changes) {
        file_put_contents($userfile, implode("\n", $userarray) . "\n");
    }
}

usertimes();

$userarray = file_exists($userfile) ? file($userfile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];
$votearray = file_exists($votefile) ? file($votefile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];

?>
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Результати голосований</title>
    <link rel="stylesheet" href="css/styles.css" type="text/css">
</head>
<body>
<table align="center"  border = 1 width = 30%  cellpadding="5" cellspacing="0" width="50%">
<tr>
<td align="center" valign="top">
    <p><strong>Домашний  Интернет - Справочник : <br> Учебно-информационный центр <br>Автомобилиста. </strong></p>
    <p><strong>Результати голосований :</strong></p>
    <p><strong><?= !empty($votearray) ? htmlspecialchars($votearray[0]) : "Дані відсутні" ?></strong></p>

    <?php if (count($votearray) > 1): ?>
    <p>
    <table border="0" cellpadding="2" cellspacing="0">
        <?php
        $wmax = 150;
        $maxs = [];

        for ($i = 1; $i < count($votearray); $i++) {
            $explode = explode("|", $votearray[$i]);
            $maxs[$i] = isset($explode[1]) ? (int)$explode[1] * $wmax : 0;
        }

        $max = !empty($maxs) ? max($maxs) : 1;
        $k = ($max > $wmax) ? $wmax / $max : 1;

        for ($i = 1; $i < count($votearray); $i++) {
            $explode = explode("|", $votearray[$i]);
            $voteLabel = htmlspecialchars($explode[0] ?? "Невідомо");
            $voteCount = isset($explode[1]) ? (int)$explode[1] : 0;
            $barWidth = max(1, round($maxs[$i] * $k)); 
        ?>
        <tr>
            <td width="50%" align="right"><?= $voteLabel ?></td>
            <td><img src="polosa.gif" width="<?= $barWidth ?>" height="9" border="0"> (<?= $voteCount ?>)</td>
        </tr>
        <?php } ?>
    </table>
    </p>
    <?php else: ?>
        <p>Нет данних для отображения.</p>
    <?php endif; ?>

    <p> <a href="index.html" target = _self  style="text-decoration: none; color:#000000;"><strong>&nbsp;&nbsp;&nbsp;На Главную Страницу ! &nbsp;&nbsp;&nbsp;</strong>  </a>
                <!-- Текущая дата -->
                <div align = right style="font-size:15px;  color:#000000;"> 
                        <Script language="JavaScript">
                                    var now = new Date();
                                    var days = new Array(' Воскресенье ',' Понедельник ',' Вторник ',' Среда ',' Четверг ',' Пятница ',' Суббота ');
                                    var months = new Array(' Января ',' Февраля ',' Марта ',' Апреля ',' Мая ',' Июня ',' Июля ',' Августа ',' Сентябрь',' Октября  ',' Ноября ',' Декабря ');
                                    var date = ((now.getDate()<10) ? "0" : "")+ now.getDate();
                                    function fourdigits(number)	{ return (number < 1000) ? number + 1900 : number; }
                                    today =  days[now.getDay()]+ " " +date + " " +months[now.getMonth()] + "  " +(fourdigits(now.getYear())) + " года.&nbsp;&nbsp;&nbsp;";
                                    document.write("<span class=\"style2\">"+"Сегодня "+today+"</span>");
                        </Script>
                </div>    
                <!>    

</td>
</tr>
</table>
</body>
</html>
