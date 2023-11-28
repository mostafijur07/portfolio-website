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

    $listName = $_POST['listname'];

    $sql = "DELETE FROM listnames WHERE listname = '$listName'";
    $result = mysqli_query($conn, $sql);
    if(!$result){
        echo "Error: ".mysqli_error($conn);
        exit;
    }

    echo "list delete successfully";

    mysqli_close($conn);
?>
    