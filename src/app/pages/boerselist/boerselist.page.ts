import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config } from '@ionic/angular';

import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { BoerselistserviceService } from '../../services/boerselistservice.service';
import { Subscription } from 'rxjs';
import { boerselisting } from '../../models/firebase-boerse.model';
import { Storage } from '@ionic/storage';
import { SettingService } from '../../../app/services/setting.service';
import { RadiusServiceService } from '../../services/radius-service.service';
import { PositionServiceService } from '../../services/position-service.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, switchMap, first } from 'rxjs/operators'

@Component({
  selector: 'app-boerselist',
  templateUrl: './boerselist.page.html',
  styleUrls: ['./boerselist.page.scss'],
})
export class BoerselistPage implements OnInit {

  @ViewChild('scheduleList', { static: true }) scheduleList: IonList;

  ios: boolean;
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  includeTracks: any = [];
  groups: any = [];
  confDate: string;
  showSearchbar: boolean;
  showdata: any[];
  subscriptions: Subscription;

  insert_desk_lat_lng: boolean = false;
  new_lng_from: any;
  new_lng_to: any;
  new_lat_from: any;
  new_lat_to: any;

  datasavailable: boolean = false;

  insert_fun: boolean = false;
  insert_find_friends: boolean = false;
  insert_geschichten: boolean = false;
  insert_pics: boolean = false;
  standardbild: any;

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
    public boerselistservice: BoerselistserviceService, 
    private storage: Storage,
    public posservice: PositionServiceService,
    private radiusservice: RadiusServiceService,
    private ngFirestore: AngularFirestore,
    private settingservice: SettingService,
  ) { }

  ngOnInit() {
    //this.updateSchedule();
    this.getdata();

    this.ios = this.config.get('mode') === 'ios';

  }

  async getkat()
  {
    this.includeTracks = [];
    this.confData.getBoerseKat().subscribe((tracks: any[]) => {
      tracks.forEach(track => {
        this.includeTracks.push(track.name);
      });
    });  
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
    
    this.insert_desk_lat_lng = false;
    this.insert_find_friends = false;
    this.insert_fun = false;
    this.insert_geschichten = false;
    this.insert_pics = false;
    this.datasavailable = false;

    var questionsRef = this.ngFirestore.collection<boerselisting>('boerse');

    this.subscriptions = this.ngFirestore.collection<boerselisting>('boerse').snapshotChanges().subscribe();

    var questionsCol = questionsRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
         //return a.payload.doc.data(); // get id using a.payload.doc.id
         return {
          id: a.payload.doc.id,
          ...a.payload.doc.data() as boerselisting
        };
      }))
    );

    questionsCol.forEach(doc => {
      this.showdata = [];
      doc.forEach(t =>
        {
          this.insert_desk_lat_lng = false;
          this.insert_find_friends = false;
          this.insert_fun = false;
          this.insert_geschichten = false;
          this.insert_pics = false;

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
  
          if (this.includeTracks.indexOf("Fun") > -1)
          {
            if (t.kat.toString() == 'Fun')
            {
              this.insert_fun = true;
            }
            else
            {
              this.insert_fun = false;
            }
          }
  
          if (this.includeTracks.indexOf("Freunde finden") > -1)
          {
            if (t.kat.toString() == 'Freunde finden')
            {
              this.insert_find_friends = true;
            }
            else
            {
              this.insert_find_friends = false;
            }
          }
  
          if (this.includeTracks.indexOf("Geschichten") > -1)
          {
            if (t.kat.toString() == 'Geschichten')
            {
              this.insert_geschichten = true;
            }
            else
            {
              this.insert_geschichten = false;
            }
          }
  
          if (this.includeTracks.indexOf("Pics") > -1)
          {
            if (t.kat.toString() == 'Pics')
            {
              this.insert_pics = true;
            }
            else
            {
              this.insert_pics = false;
            }
          }
  
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
            && 
            ( this.insert_find_friends === true ||
              this.insert_fun === true ||
              this.insert_geschichten  === true ||
              this.insert_pics === true
            )
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
  }

  async ionViewDidEnter()
  {
    this.includeTracks = [];
    this.includeTracks.push('Fun');
    this.includeTracks.push('Freunde finden');
    this.includeTracks.push('Geschichten');
    this.includeTracks.push('Pics');

    this.standardbild = this.settingservice.dog_icon;

    this.posservice.getpos().then(pos => 
      {
        this.storage.get('Latitude').then(Latitude =>
          {
          this.storage.get('Longitude').then(Longitude => 
          {
            this.storage.get('Boerse_umkreis').then( umkreis => 
            {
              this.radiusservice.calcradius(Latitude, Longitude,umkreis, 'Boerse').then(pos => 
              {
                this.storage.get('Boerse_lat_from').then(lat_from => 
                {
                  this.storage.get('Boerse_lat_to').then(lat_to => 
                  {
                    this.storage.get('Boerse_lng_from').then(lng_from => 
                    {
                      this.storage.get('Boerse_lng_to').then(lng_to => 
                      {

                        console.log('Boerse lat_from')
                        console.log(lat_from)
                        console.log(lat_to)
                        console.log(lng_from)
                        console.log(lng_to)
                        this.new_lat_from = lat_from;
                        this.new_lat_to = lat_to;
                        this.new_lng_from = lng_from;
                        this.new_lng_to = lng_to;
                      }).catch(umkreis => 
                        {
                          this.storage.set('Boerse_lng_to', 8.386743580769513);
                        })
                      }).catch(umkreis => 
                      {
                        this.storage.set('Boerse_lng_from', 8.502266419230486);
                      })
                    }).catch(umkreis => 
                    {
                      this.storage.set('Boerse_lat_to', 47.115874235794024);
                    })
                  }).catch(umkreis => 
                  {
                    this.storage.set('Boerse_lat_from', 47.20570576420597);
                  })
                }).catch(umkreis => 
                {
                  this.storage.set('Boerse_umkreis', 5);
                })
          })
        })
      })
    })
  }

  
  ionViewWillLeave(): void 
  {
    this.subscriptions.unsubscribe();
  }

  updateSchedule() {
    this.includeTracks = [];
    this.includeTracks.push('Fun');
    this.includeTracks.push('Freunde finden');
    this.includeTracks.push('Geschichten');
    this.includeTracks.push('Pics');
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
      componentProps: { excludedTracks: this.excludeTracks,
        from: 'Boerse' }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludeTracks = data;
      this.updateSchedule();

      var counter = 0;
      this.excludeTracks.forEach(data =>
      {
        counter = 0;
        this.includeTracks.forEach(element => {
          if(element == data)
          {
            /*
            console.log('element');
            console.log(element);
            console.log('data');
            console.log(data);
            console.log(counter);
            */
            this.includeTracks.splice(counter,1);
          }
          ++counter;
        });        
      })
      this.getdata();
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


  openBoerseCreateModal()
  {
    this.router.navigate(['/boersecreate']);
  }

}