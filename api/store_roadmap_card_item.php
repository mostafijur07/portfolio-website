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

    $updatedText = $_POST['UpdatedText'];
    $prevText = $_POST['PrevText'];
    $cardHeading = $_POST['CardHeading'];

    $sql = "SELECT card_item FROM carditem where card_heading='$cardHeading' AND card_item = '$updatedText'";
    $result = mysqli_query($conn, $sql);
    if(!$result){
        echo "Error: ".mysqli_error($conn);
        exit;
    }

    $row = mysqli_fetch_assoc($result);
    if($row!=0){
        echo "This item Already Exist";
        exit;
    }

    if($prevText==''){
        $sql= "INSERT INTO carditem (card_heading, card_item) VALUES ('$cardHeading', '$updatedText')";
        $result = mysqli_query($conn, $sql);
        if(!$result){
            echo "Error: ".mysqli_error($conn);
            exit;
        }
    }else{
        $sql = "UPDATE carditem SET card_item='$updatedText' WHERE card_heading='$cardHeading' AND card_item='$prevText'";
        $result = mysqli_query($conn, $sql);
        if(!$result){
            echo "Error: ".mysqli_error($conn);
            exit;
        }
    }

    mysqli_close($conn);
?>
