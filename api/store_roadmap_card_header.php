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

    $sql = "SELECT card_name FROM cardname where card_name='$updatedText'";
    $result = mysqli_query($conn, $sql);
    if(!$result){
        echo "Error: ".mysqli_error($conn);
        exit;
    }

    $row = mysqli_fetch_assoc($result);
    if($row!=0){
        echo "This Heading Already Exist";
        exit;
    }

    if($prevText==''){
        $sql= "INSERT INTO cardname (card_name) VALUES ('$updatedText')";
        $result = mysqli_query($conn, $sql);
        if(!$result){
            echo "Error: ".mysqli_error($conn);
            exit;
        }
    }else{
        $sql = "UPDATE carditem SET card_heading='$updatedText' WHERE card_heading='$prevText'";
        $result = mysqli_query($conn, $sql);
        if(!$result){
            echo "Error: ".mysqli_error($conn);
            exit;
        }else{
            $sql = "UPDATE cardname SET card_name='$updatedText' WHERE card_name='$prevText'";
            $result = mysqli_query($conn, $sql);
            if(!$result){
                echo "Error: ".mysqli_error($conn);
                exit;
            }
        }
    }

    mysqli_close($conn);
?>
