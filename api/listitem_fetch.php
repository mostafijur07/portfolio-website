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

    $listName = $_GET['listname'];

    $sql = "SELECT listitem, itemstatus FROM listitems WHERE listname='$listName'";
    $result = mysqli_query($conn, $sql);
    if(!$result){
        echo "Error: ".mysqli_error($conn);
        exit;
    }

    $listItemData = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $listItemData[] = [
            'listitem' => $row['listitem'],
            'itemstatus' => $row['itemstatus']
        ];
    }

    echo json_encode($listItemData);
    mysqli_close($conn);
?>