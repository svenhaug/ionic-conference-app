import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavParams, IonContent } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { communitylisting, ratings, comments } from '../../models/firebase-community.model'; 
import { DatePipe } from '@angular/common';
import { doc, updateDoc, arrayUnion, arrayRemove, FieldValue } from "firebase/firestore";
import { ModalController, AlertController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Observable } from 'rxjs';
import { FILE } from '../../models/firebase-boerse.model';
import { finalize, tap } from 'rxjs/operators';

import { Router } from '@angular/router';
import { chatlisting } from '../../models/firebase-chat.model'
import { ChatService } from '../../services/chat.service'
import { UserService } from '../../services/user.service';
import { CommunitylistserviceService } from '../../services/communitylistservice.service';
import { DogwalklistserviceService } from '../../services/dogwalklistservice.service';
import { BoerselistserviceService } from '../../services/boerselistservice.service';
import { PetsittinglistserviceService } from '../../services/petsittinglistservice.service';
import { AlertlistserviceService } from '../../services/alertlistservice.service';
import { petsittinglisting } from '../../models/firebase-petsitting.model';
import { alertlisting } from '../../models/firebase-alert.model';

declare var google;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})

export class ChatPage implements OnInit {

  @ViewChild('content') content: IonContent;
  @ViewChild('chat_input') messageInput: ElementRef;

  User: string = "";
  toUser: string = "";

  to_username: string;
  from_username: string;
  to_uid: string;
  from_uid: string;

  inp_text: any;
  editorMsg = '';
  showEmojiPicker = false;
  from: any;
  from_id: any;
  subscriptions: Subscription;
  usersubscribe: Subscription;

  msgList: Array<chatlisting> = [];
  public count = 0;
  public arr = [
    {
      "messageId": "1",
      "userId": "140000198202211138",
      "userName": "Luff",
      "userImgUrl": "./assets/user.jpg",
      "toUserId": "210000198410281948",
      "toUserName": "Hancock",
      "userAvatar": "./assets/to-user.jpg",
      "time": 1488349800000,
      "message": "Hey, that\'s an awesome chat UI",
      "status": "success"

    },
    {
      "messageId": "2",
      "userId": "210000198410281948",
      "userName": "Hancock",
      "userImgUrl": "./assets/to-user.jpg",
      "toUserId": "140000198202211138",
      "toUserName": "Luff",
      "userAvatar": "./assets/user.jpg",
      "time": 1491034800000,
      "message": "Right, it totally blew my mind. They have other great apps and designs too !",
      "status": "success"
    },
    {
      "messageId": "3",
      "userId": "140000198202211138",
      "userName": "Luff",
      "userImgUrl": "./assets/user.jpg",
      "toUserId": "210000198410281948",
      "toUserName": "Hancock",
      "userAvatar": "./assets/to-user.jpg",
      "time": 1491034920000,
      "message": "And it is free ?",
      "status": "success"
    },
    {
      "messageId": "4",
      "userId": "210000198410281948",
      "userName": "Hancock",
      "userImgUrl": "./assets/to-user.jpg",
      "toUserId": "140000198202211138",
      "toUserName": "Luff",
      "userAvatar": "./assets/user.jpg",
      "time": 1491036720000,
      "message": "Yes, totally free. Beat that ! ",
      "status": "success"
    },
    {
      "messageId": "5",
      "userId": "210000198410281948",
      "userName": "Hancock",
      "userImgUrl": "./assets/to-user.jpg",
      "toUserId": "140000198202211138",
      "toUserName": "Luff",
      "userAvatar": "./assets/user.jpg",
      "time": 1491108720000,
      "message": "Wow, that\'s so cool. Hats off to the developers. This is gooood stuff",
      "status": "success"
    },
    {
      "messageId": "6",
      "userId": "140000198202211138",
      "userName": "Luff",
      "userImgUrl": "./assets/user.jpg",
      "toUserId": "210000198410281948",
      "toUserName": "Hancock",
      "userAvatar": "./assets/to-user.jpg",
      "time": 1491231120000,
      "message": "Check out their other designs.",
      "status": "success"
    }
  ]

  constructor(
    //private events: Events, 
    private datepipe: DatePipe,
    private chatservice: ChatService,
    private communityservice: CommunitylistserviceService,
    private dogwalkservice: DogwalklistserviceService,
    private boerseservice: BoerselistserviceService,
    private petsittingservice: PetsittinglistserviceService,
    private alertservice: AlertlistserviceService,
    private router: Router, 
    public ngFireAuth: AngularFireAuth,
    public userservice: UserService
    ) 
    {
      /*
      this.msgList = [
        {
          userId: this.User,
          userName: this.User,
          userAvatar: "assets/driver.jpeg",
          time: "12:01 pm",
          message: 'Hey, that\'s an awesome chat UI',
          upertext: 'Hello'
        },
        {
          userId: this.toUser,
          userName: this.toUser,
          userAvatar: "assets/user.jpeg",
          time: "12:01 pm",
          message: "Right, it totally blew my mind. They have other great apps and designs too!",
          upertext: "Hii"
        },
        {
          userId: this.User,
          userName: this.User,
          userAvatar: "assets/driver.jpeg",
          time: "12:01 pm",
          message: 'And it is free ?',
          upertext: 'How r u '
        },
        {
          userId: this.toUser,
          userName: this.toUser,
          userAvatar: "assets/user.jpeg",
          time: "12:01 pm",
          message: 'Yes, totally free. Beat that !',
          upertext: 'good'
        },
        {
          userId: this.User,
          userName: this.User,
          userAvatar: "assets/driver.jpeg",
          time: "12:01 pm",
          message: 'Wow, that\'s so cool. Hats off to the developers. This is gooood stuff',
          upertext: 'How r u '
        },
        {
          userId: this.toUser,
          userName: this.toUser,
          userAvatar: "assets/user.jpeg",
          time: "12:01 pm",
          message: 'Check out their other designs.',
          upertext: 'good'
        },
        {
          userId: this.User,
          userName: this.User,
          userAvatar: "assets/driver.jpeg",
          time: "12:01 pm",
          message: 'Have you seen their other apps ? They have a collection of ready-made apps for developers. This makes my life so easy. I love it! ',
          upertext: 'How r u '
        },
        {
          userId: this.toUser,
          userName: this.toUser,
          userAvatar: "assets/user.jpeg",
          time: "12:01 pm",
          message: 'Well, good things come in small package after all',
          upertext: 'good'
        },
      ];
      */
    }

    ngOnInit() 
    {

    }
  
    async getuser()
    {
      
      const usercheck = await this.ngFireAuth.currentUser;
      const userdatacheck = this.userservice.getUserdata(usercheck.uid);
      //console.log('this.userdata ' + this.user.uid);
      this.usersubscribe = userdatacheck.subscribe(userdates => 
        {
          this.User = userdates[0].uid;
          this.from_uid = userdates[0].uid;
          this.from_username = userdates[0].name;
        })
    }
  

    goBack()
    {
      if(this.from == "categorie")
      {
        this.router.navigateByUrl('/categoriesdetail/' + this.from_id);
      }
      if(this.from == "dogwalk")
      {
        this.router.navigateByUrl('/dogwalkdetail/' + this.from_id);
      }
      if(this.from == "petsitting")
      {
        this.router.navigateByUrl('/petsittingdetail/' + this.from_id);
      }
      if(this.from == "alert")
      {
        this.router.navigateByUrl('/alertdetail/' + this.from_id);
      }
      if(this.from == "overview")
      {
        this.router.navigateByUrl('/app/tabs/taboverview');
      }
    }

    getdata()
    {
      this.from = localStorage.getItem('from');
      this.from_id = localStorage.getItem('id');
      
      this.getuser();

      if (this.from == 'categorie')
      {
        this.communityservice.getTask(this.from_id).subscribe(community => 
          {
            const userdatacheck = this.userservice.getUserdata(community.user);
            //console.log('this.userdata ' + this.user.uid);
            this.usersubscribe = userdatacheck.subscribe(userdates => 
              {
                this.toUser = userdates[0].uid;
                this.to_uid = userdates[0].uid;
                this.to_username = userdates[0].name;
              })
          })
      }
      if (this.from == 'dogwalk')
      {
        this.dogwalkservice.getTask(this.from_id).subscribe(community => 
          {
            const userdatacheck = this.userservice.getUserdata(community.user);
            //console.log('this.userdata ' + this.user.uid);
            this.usersubscribe = userdatacheck.subscribe(userdates => 
              {
                this.toUser = userdates[0].uid;
                this.to_uid = userdates[0].uid;
                this.to_username = userdates[0].name;
              })
          })
      }
      if (this.from == 'boerse')
      {
        this.boerseservice.getTask(this.from_id).subscribe(community => 
          {
            const userdatacheck = this.userservice.getUserdata(community.user);
            //console.log('this.userdata ' + this.user.uid);
            this.usersubscribe = userdatacheck.subscribe(userdates => 
              {
                this.toUser = userdates[0].uid;
                this.to_uid = userdates[0].uid;
                this.to_username = userdates[0].name;
              })
          })
      }
      if (this.from == 'petsitting')
      {
        this.petsittingservice.getTask(this.from_id).subscribe(community => 
          {
            const userdatacheck = this.userservice.getUserdata(community.user);
            //console.log('this.userdata ' + this.user.uid);
            this.usersubscribe = userdatacheck.subscribe(userdates => 
              {
                this.toUser = userdates[0].uid;
                this.to_uid = userdates[0].uid;
                this.to_username = userdates[0].name;
              })
          })
      }
      if (this.from == 'alert')
      {
        this.alertservice.getTask(this.from_id).subscribe(community => 
          {
            const userdatacheck = this.userservice.getUserdata(community.user);
            //console.log('this.userdata ' + this.user.uid);
            this.usersubscribe = userdatacheck.subscribe(userdates => 
              {
                this.toUser = userdates[0].uid;
                this.to_uid = userdates[0].uid;
                this.to_username = userdates[0].name;
              })
          })
      }
      this.subscriptions = this.chatservice.getChatdata(this.from_id).subscribe(data => 
      {
        this.msgList = data;
      });
    }

    scrollToBottom() {
      this.content.scrollToBottom(100);
    }
  
    ionViewWillLeave() {
      //this.events.unsubscribe('chat:received');
    }
  
    ionViewDidEnter() {
      setTimeout(() => {
        this.scrollToBottom();
        this.getdata();
      }, 500)
    }
  
    logScrollStart(){
      document.getElementById('chat-parent');
    }
  
    logScrolling(event){
      console.log('event',event)
    }

  
    sendMsg() {
      let otherUser;
      if (this.count === 0) {
        otherUser = this.arr[0].message
        this.count++
      }
      else if (this.count == this.arr.length) {
        this.count = 0;
        otherUser = this.arr[this.count].message
      }
      else {
        otherUser = this.arr[this.count].message;
        this.count++
      }
  
      const current = new Date();

      let customObj = new chatlisting();
      customObj.userId = this.User;
      customObj.userName = this.User;
      customObj.message = this.inp_text;
      customObj.time = this.datepipe.transform(current, 'yyyy-MM-dd HH:mm:ss');
      customObj.timestamp = current.getTime().toString();
      customObj.userAvatar = "assets/user.jpeg";
      customObj.upertext = this.inp_text;
      customObj.from = this.from;
      customObj.from_id = this.from_id;
      customObj.to_uid = this.to_uid;
      customObj.to_username = this.to_username;
      customObj.from_uid = this.from_uid;
      customObj.from_username = this.from_username;
      this.chatservice.create(Object.assign({}, customObj));

      /*
      let customObj2 = new chatlisting();
      customObj2.userId = this.toUser;
      customObj2.userName = this.toUser;
      customObj2.message = this.inp_text;
      customObj2.time = this.datepipe.transform(current, 'yyyy-MM-dd HH:mm:ss');
      customObj2.userAvatar = "assets/user.jpeg";
      customObj2.upertext = this.inp_text;
      customObj2.from = this.from;
      customObj2.from_id = this.from_id;
      this.chatservice.create(Object.assign({}, customObj2));
      */

      this.inp_text = "";
      console.log('scrollBottom');
      setTimeout(() => {
        this.scrollToBottom()
      }, 10)
    }

}
