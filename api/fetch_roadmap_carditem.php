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

    $cardname = $_GET['cardName'];

    $sql = "SELECT card_item FROM carditem WHERE card_heading='$cardname'";
    $result = mysqli_query($conn, $sql);
    if(!$result){
        echo "Error: ".mysqli_error($conn);
        exit;
    }

    $cardItems = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $cardItems[] = $row['card_item'];
    }

    echo json_encode($cardItems);
    mysqli_close($conn);
?>