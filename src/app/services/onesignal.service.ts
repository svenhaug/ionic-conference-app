import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OnesignalService {

  touserarray: Array<string> = [];

  constructor(
    public http: HttpClient,
  )
  { 

  }

  sendmessage(touser, message, subtitle)
  {
    
    /*
    this.http.get('http://my-ally.ch/_doggy/send_user_notification.php?topushuserid='+touser+'&messagetext='+message+'&subtitle='+subtitle).subscribe((response) => 
    {
      console.log('http://my-ally.ch/_doggy/send_user_notification.php?topushuserid='+touser+'&messagetext='+message+'&subtitle='+subtitle);    
    });
    
    
    this.http.get('http://my-ally.ch/_doggy/send_user_notification2.php?topushuserid='+touser+'&messagetext='+message).subscribe((response) => 
    {
      console.log('http://my-ally.ch/_doggy/send_user_notification2.php?topushuserid='+touser+'&messagetext='+message);    
    });
    */

    this.http.get('http://my-ally.ch/_doggy/send_user_notification3.php?topushuserid='+touser+'&messagetext='+message).subscribe((response) => 
    {
      console.log('http://my-ally.ch/_doggy/send_user_notification3.php?topushuserid='+touser+'&messagetext='+message);    
    });

  }

  sendmessage_neu(touser, message)
  {
    this.touserarray.push(touser);
    var userarray = this.touserarray;

    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Basic MzdlZjcwOWUtODIxZC00NWYwLTlmYjUtNWEyZWRiM2U3YmY2',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        app_id: '54fc8f77-8bab-458f-8cd4-10bf08ea81b7',
        include_player_ids: {userarray},
        external_id: '',
        contents: {en: message}
      })
    };
    
    fetch('https://onesignal.com/api/v1/notifications', options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
    
  }

}
