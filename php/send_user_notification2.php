<?php

header("Access-Control-Allow-Origin: *");

header('Expires: Sun, 01 Jan 2014 00:00:00 GMT');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', FALSE);
header('Pragma: no-cache');

    $topushuserid = $_GET['topushuserid'];
    $messagetext = $_GET['messagetext'];

    $content = array(
        "en" => $messagetext
        );

    $hashes_array = array();
    array_push($hashes_array, array(
        "id" => "like-button",
        "text" => "Like",
        "icon" => "http://i.imgur.com/N8SN8ZS.png",
        "url" => "https://yoursite.com"
    ));
    array_push($hashes_array, array(
        "id" => "like-button-2",
        "text" => "Like2",
        "icon" => "http://i.imgur.com/N8SN8ZS.png",
        "url" => "https://yoursite.com"
    ));
    
    $ios_attachments = array(  
        "ios_attachments" => 'https://i.imgur.com/N8SN8ZS.png'
    );

    $big_picture = array(  
        "big_picture" => 'https://i.imgur.com/N8SN8ZS.png'
    );    

    $ios_attachments = array(  
        "big_picture" => 'https://i.imgur.com/N8SN8ZS.png'
    );    

    $fields = array(
        'app_id' => "c087723e-61ca-4cfa-a7c1-f752056dc14f",
        //'included_segments' => array('All'),
        'include_player_ids' => array($topushuserid),
        'data' => array(
            "foo" => "bar"
        ),
        'contents' => $content,
        'buttons' => $hashes_array, 
        'big_picture' => $big_picture,
        'ios_attachments' => $ios_attachments,
        //'template_id' => '95b7ef87-0766-4ed4-a40c-e9e94a8d6c93',
    );

    $fields = json_encode($fields);
    print("\nJSON sent:\n");
    print($fields);

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

    $response = sendMessage();
    $return["allresponses"] = $response;
    $return = json_encode( $return);
    //print("\n\nJSON received:\n");
    //print($return);
    //print("\n");
  
?>