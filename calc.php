<?php

session_start();
if (!isset($_SESSION["tableRows"])) $_SESSION["tableRows"] = array();
date_default_timezone_set("Europe/Moscow");
$x = (float) $_POST["x"];
$y = (float) $_POST["y"];
$r = (float) $_POST["r"];
if ($x == 0 && $y == 0 && $r == 0){

}
if (checkData($x, $y, $r)) {
    $y = round($y,2);
    $coordsStatus = checkCoordinates($x, $y, $r);
    $currentTime = date("H : i : s");
    $benchmarkTime = microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"];
    $benchmarkTime = round($benchmarkTime,7);
    array_push($_SESSION["tableRows"], 
    "<tr>
    <td>$x</td>
    <td>$y</td>
    <td>$r</td>
    <td>$coordsStatus</td>
    <td>$currentTime</td>
    <td>$benchmarkTime</td>
    </tr>");
    echo end($_SESSION['tableRows']);
} else {
    http_response_code(400);
    return;
}

function checkData($x, $y, $r) {
    return in_array($x, array(-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2)) &&
        is_numeric($y) && ($y > -5 && $y < 5) &&
        in_array($r, array( 1, 1.5, 2, 2.5, 3));
}

function checkCoordinates($x, $y, $r) {
    if (((abs($x) + abs($y) <= $r) && ($x <= 0) && ($y <= 0)) ||
        (($x >= -$r) && ($y <= $r) && ($x <= 0) && ($y >= 0)) ||
        (($x**2 + $y**2) <= ($r**2) && ($x >= 0) && ($y >= 0))) return "да";
    else return "нет";
}
?>