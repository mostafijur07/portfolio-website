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

    $sql = "SELECT listname FROM listnames where listname='$listName'";
    $result = mysqli_query($conn, $sql);
    if(!$result){
        echo "Error: ".mysqli_error($conn);
        exit;
    }

    $row = mysqli_fetch_assoc($result);
    if($row!=0){
        echo "list already selected";
        exit;
    }

    $sql= "INSERT INTO listnames (listname) VALUES ('$listName')";
    $result = mysqli_query($conn, $sql);
    if(!$result){
        echo "Error: ".mysqli_error($conn);
        exit;
    }

    mysqli_close($conn);
?>
