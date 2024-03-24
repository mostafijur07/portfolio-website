<?php
    $db_hostname = "127.0.0.1";
    $db_username = "root";
    $db_password = "";
    $db_name = "roadmap";

    $conn = mysqli_connect($db_hostname, $db_username,$db_password,$db_name);
    if(!$conn){
        echo "connection failed: ".mysqli_connect_error();
        exit;
    }

    $sql = "SELECT card_name FROM cardname ORDER BY card_name ASC";
    $result = mysqli_query($conn, $sql);
    if(!$result){
        echo "Error: ".mysqli_error($conn);
        exit;
    }

    $cardNames = [];

    while($row = mysqli_fetch_assoc($result)){
        $cardNames[] = $row['card_name'];
    }

    mysqli_close($conn);

    echo json_encode($cardNames);
?>