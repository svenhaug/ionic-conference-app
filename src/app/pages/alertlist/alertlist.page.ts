import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config } from '@ionic/angular';

import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { AlertlistserviceService } from '../../services/alertlistservice.service';
import { Subscription } from 'rxjs';
import { alertlisting, AlertLists } from '../../models/firebase-alert.model'
import { SettingService } from '../../../app/services/setting.service';
import { RadiusServiceService } from '../../services/radius-service.service';
import { PositionServiceService } from '../../services/position-service.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, switchMap, first } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-alertlist',
  templateUrl: './alertlist.page.html',
  styleUrls: ['./alertlist.page.scss'],
})
export class AlertlistPage implements OnInit {

  @ViewChild('scheduleList', { static: true }) scheduleList: IonList;

  ios: boolean;
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;
  showSearchbar: boolean;
  showdata: any[];
  subscriptions: Subscription;
  standardbild: any;
  includeTracks: any = [];

  insert_desk_lat_lng: boolean = false;
  new_lng_from: any;
  new_lng_to: any;
  new_lat_from: any;
  new_lat_to: any;

  insert_mo: boolean = false;
  insert_di: boolean = false;
  insert_mi: boolean = false;
  insert_do: boolean = false;
  insert_fr: boolean = false;
  insert_sa: boolean = false;
  insert_so: boolean = false;
  datasavailable: boolean = false;
  

  constructor(
    public alertCtrl: AlertController,
    public confData: ConferenceData,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public user: UserData,
    public config: Config, 
    public alertlistservice: AlertlistserviceService,
    private settingservice: SettingService,
    public posservice: PositionServiceService,
    private radiusservice: RadiusServiceService,
    private ngFirestore: AngularFirestore,
    private storage: Storage,

  ) { }

  ngOnInit() {

    //this.updateSchedule();
   
    this.ios = this.config.get('mode') === 'ios';

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

    this.getdata();
    this.includeTracks = [];

    this.posservice.getpos().then(pos => 
      {
        this.storage.get('Latitude').then(Latitude =>
          {
          this.storage.get('Longitude').then(Longitude => 
          {
            this.storage.get('Alert_umkreis').then( umkreis => 
            {
              this.radiusservice.calcradius(Latitude, Longitude,umkreis, 'Alert').then(pos => 
              {
                this.storage.get('Alert_lat_from').then(lat_from => 
                {
                  this.storage.get('Alert_lat_to').then(lat_to => 
                  {
                    this.storage.get('Alert_lng_from').then(lng_from => 
                    {
                      this.storage.get('Alert_lng_to').then(lng_to => 
                      {
                        this.new_lat_from = lat_from;
                        this.new_lat_to = lat_to;
                        this.new_lng_from = lng_from;
                        this.new_lng_to = lng_to;
                      }).catch(umkreis => 
                        {
                          this.storage.set('Alert_lng_to', 8.386743580769513);
                        })
                      }).catch(umkreis => 
                      {
                        this.storage.set('Alert_lng_from', 8.502266419230486);
                      })
                    }).catch(umkreis => 
                    {
                      this.storage.set('Alert_lat_to', 47.115874235794024);
                    })
                  }).catch(umkreis => 
                  {
                    this.storage.set('Alert_lat_from', 47.20570576420597);
                  })
                }).catch(umkreis => 
                {
                  this.storage.set('Alert_umkreis', 5);
                })
          })
        })
      })
    })
  }

  async ionViewWillEnter()
  {
    this.standardbild = this.settingservice.dog_icon;
  }

  async getdata()
  {
    const loading = await this.loadingCtrl.create({
      message: `retrieve data...`,
      duration: 1000//(Math.random() * 1000) + 500
    });
    await loading.present();
    await loading.onWillDismiss();

    this.showdata = [];
    
    this.excludeTracks.forEach(exclude =>
      {
        console.log('exclude');
        console.log(exclude);
        //this.includeTracks.splice(exclude, 1);
      }
    )

    var questionsRef = this.ngFirestore.collection<alertlisting>('alert');

    this.subscriptions = this.ngFirestore.collection<alertlisting>('alert').snapshotChanges().subscribe();

    var questionsCol = questionsRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
         //return a.payload.doc.data(); // get id using a.payload.doc.id
         return {
          id: a.payload.doc.id,
          ...a.payload.doc.data() as alertlisting
        };
      }))
    );

    this.insert_mo = false;
    this.insert_di = false;
    this.insert_mi = false;
    this.insert_do = false;
    this.insert_fr = false;
    this.insert_sa = false;
    this.insert_so = false;
    this.datasavailable = false;
    this.showdata = [];


    questionsCol.forEach(doc => {
      this.showdata = [];
      doc.forEach(t =>
        {

          if (+t.lng.toString() <= +this.new_lng_from)  
          {
            if (+t.lng.toString() >= +this.new_lng_to)
            { 
              if (+t.lat.toString() <= +this.new_lat_from)             
              {
                if (+t.lat.toString() >= +this.new_lat_to)             
                {
                  this.insert_desk_lat_lng = true;
                }
              }                    
            }       
          } 
        /*
        if (this.includeTracks.indexOf("Mo") > -1)
        {
          if (t.mo)
          {
            if (t.mo.toString() == 'true')
            {
              this.insert_mo = true;
            }
            else
            {
              this.insert_mo = false;
            }
          }
          else
          {
            this.insert_mo = false;
          }

        }

        if (this.includeTracks.indexOf("Di") > -1)
        {
          if(t.di)
          {
            if (t.di.toString() == 'true')
            {
              this.insert_di = true;
            }
            else
            {
              this.insert_di = false;
            }
          }  
          else
          {
            this.insert_di = false;
          }        
        }

        if (this.includeTracks.indexOf("Mi") > -1)
        {
          if (t.mi)
          {
            if (t.mi.toString() == 'true')
            {
              this.insert_mi = true;
            }
            else
            {
              this.insert_mi = false;
            }  
          }
          else
          {
            this.insert_mi = false;
          }

        }

        if (this.includeTracks.indexOf("Do") > -1)
        {
          if (t.do)
          {
            if (t.do.toString() == 'true')
            {
              this.insert_do = true;
            }
            else
            {
              this.insert_do = false;
            }
          }
          else
          {
            this.insert_do = false;
          }
        }

        if (this.includeTracks.indexOf("Fr") > -1)
        {
          if (t.fr)
          {
            if (t.fr.toString() == 'true')
            {
              this.insert_fr = true;
            }
            else
            {
              this.insert_fr = false;
            }  
          }
          else
          {
            this.insert_fr = false;
          }
        }

        if (this.includeTracks.indexOf("Sa") > -1)
        {
          if (t.sa)
          {
            if (t.sa.toString() == 'true')
            {
              this.insert_sa = true;
            }
            else
            {
              this.insert_sa = false;
            }  
          }
          else
          {
            this.insert_sa = false;
          }
        }

        if (this.includeTracks.indexOf("So") > -1)
        {

          if (t.so)
          {
            if (t.so.toString() == 'true')
            {
              this.insert_so = true;
            }
            else
            {
              this.insert_so = false;
            }  
          }
          else
          {
            this.insert_so = false;
          }
        }
        */
  
          /*
          console.log(this.includeTracks.indexOf("Fun"));
          console.log(this.includeTracks.indexOf("Freunde finden"));
          console.log(this.includeTracks.indexOf("Geschichten"));
          console.log(this.includeTracks.indexOf("Pics"));
          console.log(t.kat.toString());
  
          console.log(this.insert_geschichten)
          console.log(this.insert_find_friends)
          console.log(this.insert_fun)
          console.log(this.insert_pics)
  
          console.log(this.insert_desk_lat_lng)
          console.log(this.includeTracks)
          console.log('t-data');
          console.log(t);
          */

          if(
            (this.insert_desk_lat_lng == true)
            /*
            && 
            (  this.insert_mo === true ||
              this.insert_di === true ||
              this.insert_mi === true ||
              this.insert_do === true ||
              this.insert_fr === true ||
              this.insert_sa === true ||
              this.insert_so === true
            )
            */
          )
          {
            this.datasavailable = true;  
            /*
            console.log('data');
            console.log(t);
            */
            this.showdata.push(t);
          }  
        }
      )

    });

    /*
    this.subscriptions = this.alertlistservice.getTasks().subscribe((res) => {
      this.showdata = res.map((t) => {
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as AlertLists
        };
      })
    });
    */
  }

  updateSchedule() {
    // Close any open sliding items when the schedule updates
    if (this.scheduleList) {
      this.scheduleList.closeSlidingItems();
    }

    this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
      this.shownSessions = data.shownSessions;
      this.groups = data.groups;
    });
  }

  async presentFilter() {
    const modal = await this.modalCtrl.create({
      component: ScheduleFilterPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { excludedTracks: this.excludeTracks, from: 'Alert' }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludeTracks = data;
      this.updateSchedule();
    }
  }

  async addFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any) {
    if (this.user.hasFavorite(sessionData.name)) {
      // Prompt to remove favorite
      this.removeFavorite(slidingItem, sessionData, 'Favorite already added');
    } else {
      // Add as a favorite
      this.user.addFavorite(sessionData.name);

      // Close the open item
      slidingItem.close();

      // Create a toast
      const toast = await this.toastCtrl.create({
        header: `${sessionData.name} was successfully added as a favorite.`,
        duration: 3000,
        buttons: [{
          text: 'Close',
          role: 'cancel'
        }]
      });

      // Present the toast at the bottom of the page
      await toast.present();
    }

  }

  async removeFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any, title: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(sessionData.name);
            this.updateSchedule();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    await alert.present();
  }

  async openSocial(network: string, fab: HTMLIonFabElement) {
    const loading = await this.loadingCtrl.create({
      message: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    await loading.present();
    await loading.onWillDismiss();
    fab.close();
  }


  openAlertCreateModal()
  {
    this.router.navigate(['/alertcreate']);
  }

}