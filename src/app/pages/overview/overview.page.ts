import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AlertlistserviceService } from '../../services/alertlistservice.service';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { alertlisting, ratings, comments } from '../../models/firebase-alert.model'; 
import { DatePipe } from '@angular/common';
import { doc, updateDoc, arrayUnion, arrayRemove, FieldValue } from "firebase/firestore";
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Observable } from 'rxjs';
import { FILE } from '../../models/firebase-boerse.model';
import { finalize, tap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { Router } from "@angular/router";
import { SettingService } from '../../services/setting.service';
import { CommunitylistserviceService } from '../../services/communitylistservice.service'
import { CommunityLists, anzeige, anzeigegroup } from '../../models/firebase-community.model';
import { userlisting } from '../../models/firebase-user.model';
import { DogwalklistserviceService } from '../../services/dogwalklistservice.service'
import { dogwalklisting } from '../../models/firebase-dogwalk.model';
import { PetsittinglistserviceService } from '../../services/petsittinglistservice.service'
import { petsittinglisting } from '../../models/firebase-petsitting.model';
import { ChatService } from '../../services/chat.service'
import { chatlisting } from '../../models/firebase-chat.model';
import { Console } from 'console';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {

  datasavailable: boolean = false;
  subscriptions: Subscription;
  subscriptionsdogwalk: Subscription;
  subscriptionspesitting: Subscription;
  subscriptionschats: Subscription;
  usersubscribe: Subscription;
  showcommunity: any[];
  showdogwalk: any[];
  showpetsitting: any[];
  showchats: any[];
  user: any;
  userdata: any;
  uid: any;
  anzeige: Array<anzeige> = [];
  anzeigegruppe: Array<anzeigegroup> = [];
  anzeigegruppedistinct: any = [];
  excludeTracks: any = [];
  segmentModel: any = 'community';
  standardbild: any;

  constructor(
    private loadingCtrl: LoadingController,
    private communitylistservice: CommunitylistserviceService,
    private dogwalklisservice: DogwalklistserviceService,
    private petsittinglistservice: PetsittinglistserviceService,
    private chatservice: ChatService,
    public router: Router,
    private ngFirestore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    private userservice: UserService,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public config: Config,
    private settingservice: SettingService,
    private storage: Storage,
  ) 
  { 

  }

  async ngOnInit()
  {

  }

  async ionViewWillEnter()
  {
    
  }

  async segmentChanged(event)
  {

    this.showcommunity = [];
    this.showdogwalk = [];
    this.showpetsitting = [];
    this.showchats = [];

    //console.log('event');
    //console.log(event);
    //console.log(this.segmentModel);
    this.anzeigegruppedistinct = [];

    <any>await this.getuser();

    if(this.segmentModel == 'community')
    {
      <any>await this.getdatacommunity();
    }
    if(this.segmentModel == 'dogwalk')
    {
      <any>await this.getdatadogwalk();
    }
    if(this.segmentModel == 'petsitting')
    {
      <any>await this.getdatapetsitting();
    }
    if(this.segmentModel == 'chats')
    {
      <any>await this.getdatachats();
    }


    /*
    <any>await this.getdatacommunity();
    <any>await this.getdatadogwalk();
    <any>await this.getdatapetsitting();
    <any>await this.getdatachats();
    */
    <any>await this.countdata();

    this.anzeigegruppedistinct = [...new Set(this.anzeigegruppe.map(item => item.group))];
    //console.log('this.anzeigegruppedistinct');
    //console.log(this.anzeigegruppedistinct);

  }

  async ionViewDidEnter()
  {

    this.storage.get('hasLoggedIn').then(loggedin => 
      {
        console.log('hasLoggedIn ' + loggedin);
        if (!loggedin)
        {
          this.router.navigateByUrl('/login');
        }
      }
    )

    this.showcommunity = [];
    this.showdogwalk = [];
    this.showpetsitting = [];
    this.showchats = [];

    this.standardbild = this.settingservice.dog_icon;

    this.anzeigegruppedistinct = [];

    <any>await this.getuser();

    if(this.segmentModel == 'community')
    {
      <any>await this.getdatacommunity();
    }
    if(this.segmentModel == 'dogwalk')
    {
      <any>await this.getdatadogwalk();
    }
    if(this.segmentModel == 'petsitting')
    {
      <any>await this.getdatapetsitting();
    }
    if(this.segmentModel == 'chats')
    {
      <any>await this.getdatachats();
    }
    /*
    <any>await this.getdatacommunity();
    <any>await this.getdatadogwalk();
    <any>await this.getdatapetsitting();
    <any>await this.getdatachats();
    */
    <any>await this.countdata();
    
    this.anzeigegruppedistinct = [...new Set(this.anzeigegruppe.map(item => item.group))];
    //console.log('this.anzeigegruppedistinct');
    //console.log(this.anzeigegruppedistinct);
    
  }


  async presentFilter() {
    const modal = await this.modalCtrl.create({
      component: ScheduleFilterPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { 
        excludedTracks: this.excludeTracks,
        from: 'Overview'
       }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludeTracks = data;
     // this.updateSchedule();
    }
  }

  ionViewWillLeave(): void 
  {
    if (this.subscriptions)
    {
      this.subscriptions.unsubscribe();
    }
    if (this.subscriptionsdogwalk)
    {
      this.subscriptionsdogwalk.unsubscribe();
    }
    if (this.subscriptionspesitting)
    {
      this.subscriptionspesitting.unsubscribe();
    }
    if (this.subscriptionschats)
    {
      this.subscriptionschats.unsubscribe();
    }
    if (this.usersubscribe)
    {
      this.usersubscribe.unsubscribe();
    }
    
  }


  async getuser()
  {
    //console.log('1');
    const loading = await this.loadingCtrl.create({
      message: `retrieve data...`,
      duration: 1000//(Math.random() * 1000) + 500
    });
    await loading.present();
    await loading.onWillDismiss();
    return new Promise(async resolve => {
      this.user = await this.ngFireAuth.currentUser;
      this.userdata = this.userservice.getUserdata(this.user.uid);
      //console.log('this.userdata ' + this.user.uid);
      this.usersubscribe = this.userdata.subscribe(userdates => 
        {
          this.uid = userdates[0].uid;
          this.usersubscribe.unsubscribe;
          resolve(this.uid);
        })
      })
  }

  countdata = async () =>
  {
    
    //console.log(this.showcommunity);
    //console.log(this.showdogwalk);
    //console.log(this.showpetsitting);
    //console.log(this.showchats);
    this.datasavailable = false;
      
    var filler = false;
    var fillerchatuser_to = false;
    var fillerchatuser_from = false;
    this.anzeige = [];
    if (this.showcommunity)
    {
      this.showcommunity.forEach(
        data => 
        {
          filler = false;
          if (this.uid == data.user)
          {
            filler = true;
          }
          if (data.comments)
          {
            data.comments.forEach(commenter => 
            {
              if (this.uid == commenter.user)
              {
                filler = true;
              }
            })
          }
          if (filler == true)
          {
            this.datasavailable = true;
            this.anzeige.push(
              {
                id: data.id,
                name: data.name,       
                desc: data.desc,
                user: data.user,
                contact: data.contact,
                timestamp: data.timestamp,
                timestampformat: data.timestampformat,
                lat: data.lat,
                lng: data.lng,
                adress: data.adress,
                mo: data.mo,
                di: data.di,
                mi: data.mi,
                do: data.do,
                fr: data.fr,
                sa: data.sa,
                so: data.so,
                von: data.von,
                bis: data.bis,
                datum: data.datum,
                bild1: data.bild1,
                bild2: data.bidl2,
                bild3: data.bild3,
                bild4: data.bild4,
                bild5: data.bild5,
                uhrzeit: data.uhrzeit,
                maxanzahl: data.maxanzahl,
                big: data.big,
                mid: data.mid,
                small: data.small,
                ratings: data.ratings,
                ratingcounter: data.ratingcounter,
                commentscounter: data.commentscounter,
                comments: data.comments,
                kat: data.kat,
                type: 'Community', 
                url: '/categoriesdetail/'+data.id,
              }
            );
            this.anzeigegruppe.push(
              {
                group: 'Community',
              }
            );
          }
        }
      )  
    }
    else
    {
      this.getdatacommunity();
    }
    if (this.showdogwalk)
    {
      this.showdogwalk.forEach(
        data => 
        {
          filler = false;
          if (this.uid == data.user)
          {
            filler = true;
          }
          if (data.comments)
          {
            data.comments.forEach(commenter => 
            {
              if (this.uid == commenter.user)
              {
                filler = true;
              }
            })
          }
          if (filler == true)
          {
            this.datasavailable = true;
            this.anzeige.push(
              {
                id: data.id,
                name: data.name,  
                desc: data.desc,
                user: data.user,
                contact: data.contact,
                timestamp: data.timestamp,
                timestampformat: data.timestampformat,
                lat: data.lat,
                lng: data.lng,
                adress: data.adress,
                mo: data.mo,
                di: data.di,
                mi: data.mi,
                do: data.do,
                fr: data.fr,
                sa: data.sa,
                so: data.so,
                von: data.von,
                bis: data.bis,
                datum: data.datum,
                bild1: data.bild1,
                bild2: data.bidl2,
                bild3: data.bild3,
                bild4: data.bild4,
                bild5: data.bild5,
                uhrzeit: data.uhrzeit,
                maxanzahl: data.maxanzahl,
                big: data.big,
                mid: data.mid,
                small: data.small,
                ratings: data.ratings,
                ratingcounter: data.ratingcounter,
                commentscounter: data.commentscounter,
                comments: data.comments,
                kat: data.kat,   
                type: 'Dogwalk',
                url: '/dogwalkdetail/'+data.id,              
              }
            );   
            this.anzeigegruppe.push(
              {
                group: 'Dogwalk',
              }
            ); 
          }
        }
      )  
    }
    else
    {
      this.getdatadogwalk();
    }
    if (this.showpetsitting)
    {
      this.showpetsitting.forEach(
        data => 
        {
          filler = false;
          if (this.uid == data.user)
          {
            filler = true;
          }
          if (data.comments)
          {
            data.comments.forEach(commenter => 
            {
              if (this.uid == commenter.user)
              {
                filler = true;
              }
            })
          }
          if (filler == true)
          {
            this.datasavailable = true;
            this.anzeige.push(
              {
                id: data.id,
                name: data.name,     
                desc: data.desc,
                user: data.user,
                contact: data.contact,
                timestamp: data.timestamp,
                timestampformat: data.timestampformat,
                lat: data.lat,
                lng: data.lng,
                adress: data.adress,
                mo: data.mo,
                di: data.di,
                mi: data.mi,
                do: data.do,
                fr: data.fr,
                sa: data.sa,
                so: data.so,
                von: data.von,
                bis: data.bis,
                datum: data.datum,
                bild1: data.bild1,
                bild2: data.bidl2,
                bild3: data.bild3,
                bild4: data.bild4,
                bild5: data.bild5,
                uhrzeit: data.uhrzeit,
                maxanzahl: data.maxanzahl,
                big: data.big,
                mid: data.mid,
                small: data.small,
                ratings: data.ratings,
                ratingcounter: data.ratingcounter,
                commentscounter: data.commentscounter,
                comments: data.comments,
                kat: data.kat,
                type: 'Petsitting',
                url: '/petsittingdetail/'+data.id,              
              }
            );  
            this.anzeigegruppe.push(
              {
                group: 'Petsitting',
              }
            );
          }
        }
      )  
    }
    else
    {
      this.getdatapetsitting();
    }
    if (this.showchats)
    {
      this.showchats.forEach(
        data => 
        {
          filler = false;
          if (this.uid == data.from_uid)
          {
            fillerchatuser_from = true;
          }
          if (this.uid == data.to_uid)
          {
            fillerchatuser_to = true;
          }
          var searchName = '';
          //console.log('data.from_id')
          //console.log(data.from_id)  
          if(data.from_id)
          {
            var checker = this.anzeige.filter(x=> x.id === data.from_id);
            //console.log('checker')
            //console.log(checker.length)  
          }
          if ((checker.length == 0) && ((fillerchatuser_to == true) || (fillerchatuser_from == true)))
          {
            filler = true;
          }
          if (filler == true)
          {
            this.datasavailable = true;
            this.anzeige.push(
              {
                id: data.from_id,
                name: '',     
                desc: data.desc,
                user: data.user,
                contact: data.contact,
                timestamp: data.timestamp,
                timestampformat: data.timestampformat,
                lat: data.lat,
                lng: data.lng,
                adress: data.adress,
                mo: data.mo,
                di: data.di,
                mi: data.mi,
                do: data.do,
                fr: data.fr,
                sa: data.sa,
                so: data.so,
                von: data.von,
                bis: data.bis,
                datum: data.datum,
                bild1: data.bild1,
                bild2: data.bidl2,
                bild3: data.bild3,
                bild4: data.bild4,
                bild5: data.bild5,
                uhrzeit: data.uhrzeit,
                maxanzahl: data.maxanzahl,
                big: data.big,
                mid: data.mid,
                small: data.small,
                ratings: data.ratings,
                ratingcounter: data.ratingcounter,
                commentscounter: data.commentscounter,
                comments: data.comments,
                kat: data.kat,
                message: data.message,
                from_username: data.from_username,
                to_username: data.to_username,
                time: data.time,
                chatanzeige: data.to_username + ' - ' + data.time,
                type: 'Chat',
                url: '/chat',              
              }
            );    
            this.anzeigegruppe.push(
              {
                group: 'Chat',
              }
            );
            filler = false;
          }
        }
      )  
    }
    else
    {
      this.getdatachats();
    }
  }

  goData(what, id, url)
  {
    /*
    console.log(what);
    console.log(id);
    console.log(url);
    */
    localStorage.setItem('from', 'overview');
    localStorage.setItem('id', id);
    this.router.navigate([url]);
  }

  async getdatacommunity()
  {
    return new Promise(resolve => {
      this.subscriptions = this.communitylistservice.getTasks().subscribe((res) => {
        this.showcommunity = res.map((t) => {
          return {
            id: t.payload.doc.id,
            ...t.payload.doc.data() as CommunityLists,
            counters: this.getcommentcounter(t.payload.doc.id)
          };
        })
        resolve(this.showcommunity);
        //console.log('this.showdata ' + this.showdata);
      });
    });
  }

  async getdatadogwalk()
  {
    return new Promise(resolve => {
      this.subscriptionsdogwalk = this.dogwalklisservice.getTasks().subscribe((res) => {
        this.showdogwalk = res.map((t) => {
          return {
            id: t.payload.doc.id,
            ...t.payload.doc.data() as dogwalklisting,
            counters: this.getcommentcounter(t.payload.doc.id)
          };
        })
        resolve(this.showdogwalk);
      });
    });
  }

  async getdatapetsitting()
  {
    return new Promise(resolve => {
      this.subscriptionspesitting = this.petsittinglistservice.getTasks().subscribe((res) => {
        this.showpetsitting = res.map((t) => {
          return {
            id: t.payload.doc.id,
            ...t.payload.doc.data() as petsittinglisting,
            counters: this.getcommentcounter(t.payload.doc.id)
          };
        })
        resolve(this.showpetsitting);
        //console.log('this.showpetsitting ' + this.showpetsitting);
      });
    });
  }

  async getdatachats()
  {
    return new Promise(resolve => {
      this.subscriptionschats = this.chatservice.getChats().subscribe((res) => {
        this.showchats = res.map((t) => {
          return {
            id: t.payload.doc.id,
            ...t.payload.doc.data() as petsittinglisting,
            counters: this.getcommentcounter(t.payload.doc.id)
          };
        })
        resolve(this.showchats);
        //console.log('this.showdata ' + this.showdata);
      });
    });
  }

  getcommentcounter(id)
  {
    return new Promise(resolve => {
      const visitArray = this.ngFirestore.collection('community').doc(id).collection('comments').snapshotChanges();
        visitArray.subscribe(payload => {
        const returner =  payload.length;
        return returner;
      });
    });
  }
}
