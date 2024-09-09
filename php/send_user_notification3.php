<?php

    header("Access-Control-Allow-Origin: *");

    header('Expires: Sun, 01 Jan 2014 00:00:00 GMT');
    header('Cache-Control: no-store, no-cache, must-revalidate');
    header('Cache-Control: post-check=0, pre-check=0', FALSE);
    header('Pragma: no-cache');
  
    function sendMessage(){

        $topushuserid = $_GET['topushuserid'];
        $messagetext = $_GET['messagetext'];
        
        $content = array(
            "en" => $messagetext
            );

        $fields = array(
            'app_id' => "c087723e-61ca-4cfa-a7c1-f752056dc14f",
            'include_player_ids' => array($topushuserid),
            'data' => array("foo" => "bar"),
            'large_icon' =>"ic_launcher_round.png",
            'contents' => $content
        );
    
        $fields = json_encode($fields);
    
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
                                                   'Authorization: Basic Nzc4YWYwZmUtMzE3Mi00MjQ4LTk5NWMtMGNjOWM2ODhlNzBk'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_POST, TRUE);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);    
    
        $response = curl_exec($ch);
        curl_close($ch);
    
        return $response;
    }

    $response = sendMessage();
    $return["allresponses"] = $response;
    $return = json_encode( $return);
    
?>