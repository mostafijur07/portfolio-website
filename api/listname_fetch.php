<?php
    $db_hostname = "127.0.0.1";
    $db_username = "root";
    $db_password = "";
    $db_name = "mr_task";

    $conn = mysqli_connect($db_hostname, $db_username,$db_password,$db_name);
    if(!$conn){
        echo "connection failed: ".mysqli_connect_error();
        exit;
    }

    $sql = "SELECT listname FROM listnames ORDER BY id ASC";
    $result = mysqli_query($conn, $sql);
    if(!$result){
        echo "Error: ".mysqli_error($conn);
        exit;
    }

    $listNames = [];

    while($row = mysqli_fetch_assoc($result)){
        $listNames[] = $row['listname'];
    }

    mysqli_close($conn);

    echo json_encode($listNames);
?>