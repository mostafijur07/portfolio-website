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

    $itemName = $_POST['itemname'];
    $newItemStatus =$_POST['newitemstatus'];

    $sql = "UPDATE listitems SET itemstatus = '$newItemStatus' WHERE listitem = '$itemName'";
    $result = mysqli_query($conn, $sql);
    if(!$result){
        echo "Error: ".mysqli_error($conn);
        exit;
    }

    echo "update sucessfull";

    mysqli_close($conn);
?>


