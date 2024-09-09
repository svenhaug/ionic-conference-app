import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config } from '@ionic/angular';

import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { DogwalklistserviceService } from '../../services/dogwalklistservice.service';
import { Subscription } from 'rxjs';
import { dogwalklisting } from '../../models/firebase-dogwalk.model'
import { count } from 'console';
import { Storage } from '@ionic/storage';
import { SettingService } from '../../services/setting.service';
import { RadiusServiceService } from '../../services/radius-service.service';
import { PositionServiceService } from '../../services/position-service.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, switchMap, first } from 'rxjs/operators'


@Component({
  selector: 'app-dogwalklist',
  templateUrl: './dogwalklist.page.html',
  styleUrls: ['./dogwalklist.page.scss'],
})
export class DogwalklistPage implements OnInit {

  @ViewChild('dogwalkList', { static: true }) dogwalkList: IonList;

  ios: boolean;
  datasavailable: boolean = false;
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
  //showdata: dogwalklisting = new dogwalklisting();
  subscriptions: Subscription;
  showtage: any = false;
  insert_lat_lng: boolean = false;
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
    public dogwalklistserviceservice: DogwalklistserviceService,
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

  async ionViewWillEnter()
  {
    await this.getdata();

    /*
    if (this.showdata.datum)
    {
      if(this.showdata.datum.length == 0)
      {
        this.showtage = false;
      }
      else
      {
        this.showtage = true;
      }      
    }
    else
    {
      this.showtage = true;
    }
    */
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

    this.includeTracks = [];
    this.includeTracks.push('Mo');
    this.includeTracks.push('Di');
    this.includeTracks.push('Mi');
    this.includeTracks.push('Do');
    this.includeTracks.push('Fr');
    this.includeTracks.push('Sa');
    this.includeTracks.push('So');

    this.standardbild = this.settingservice.dog_icon;

    /*
    this.storage.get('Dogwalk_umkreis').then( umkreis => 
    {
      this.storage.get('Dogwalk_lat_from').then(lat_from => 
      {
        this.storage.get('Dogwalk_lat_to').then(lat_to => 
        {
          this.storage.get('Dogwalk_lng_from').then(lng_from => 
          {
            this.storage.get('Dogwalk_lng_to').then(lng_to => 
            {
              this.new_lat_from = lat_from;
              this.new_lat_to = lat_to;
              this.new_lng_from = lng_from;
              this.new_lng_to = lng_to;
            }).catch(umkreis => 
            {
              this.storage.set('Dogwalk_lng_to', 8.386743580769513);
            })
          }).catch(umkreis => 
          {
            this.storage.set('Dogwalk_lng_from', 8.502266419230486);
          })
        }).catch(umkreis => 
        {
          this.storage.set('Dogwalk_lat_to', 47.115874235794024);
        })
      }).catch(umkreis => 
      {
        this.storage.set('Dogwalk_lat_from', 47.20570576420597);
      })
    }).catch(umkreis => 
    {
      this.storage.set('Dogwalk_umkreis', 5);
    })
    */


    this.posservice.getpos().then(pos => 
      {
        this.storage.get('Latitude').then(Latitude =>
          {
          this.storage.get('Longitude').then(Longitude => 
          {
            this.storage.get('Dogwalk_umkreis').then( umkreis => 
            {
              this.radiusservice.calcradius(Latitude, Longitude,umkreis, 'Dogwalk').then(pos => 
              {
                this.storage.get('Dogwalk_lat_from').then(lat_from => 
                {
                  this.storage.get('Dogwalk_lat_to').then(lat_to => 
                  {
                    this.storage.get('Dogwalk_lng_from').then(lng_from => 
                    {
                      this.storage.get('Dogwalk_lng_to').then(lng_to => 
                      {
                        this.new_lat_from = lat_from;
                        this.new_lat_to = lat_to;
                        this.new_lng_from = lng_from;
                        this.new_lng_to = lng_to;
                      }).catch(umkreis => 
                        {
                          this.storage.set('Dogwalk_lng_to', 8.386743580769513);
                        })
                      }).catch(umkreis => 
                      {
                        this.storage.set('Dogwalk_lng_from', 8.502266419230486);
                      })
                    }).catch(umkreis => 
                    {
                      this.storage.set('Dogwalk_lat_to', 47.115874235794024);
                    })
                  }).catch(umkreis => 
                  {
                    this.storage.set('Dogwalk_lat_from', 47.20570576420597);
                  })
                }).catch(umkreis => 
                {
                  this.storage.set('Dogwalk_umkreis', 5);
                })
          })
        })
      })
    })
  }

  ionViewWillLeave(): void {
    this.subscriptions.unsubscribe();
  }

  async getdata()
  {
    console.log('this.includeTracks');
    console.log(this.includeTracks);
    const loading = await this.loadingCtrl.create({
      message: `retrieve data...`,
      duration: 1000//(Math.random() * 1000) + 500
    });
    await loading.present();
    await loading.onWillDismiss();

    this.insert_mo = false;
    this.insert_di = false;
    this.insert_mi = false;
    this.insert_do = false;
    this.insert_fr = false;
    this.insert_sa = false;
    this.insert_so = false;
    this.datasavailable = false;
    this.showdata = [];
    
    this.excludeTracks.forEach(exclude =>
      {
        console.log('exclude');
        console.log(exclude);
        //this.includeTracks.splice(exclude, 1);
      }
    )
    
    //console.log('this.includeTracks');
    //console.log(this.includeTracks);

    var questionsRef = this.ngFirestore.collection<dogwalklisting>('dogwalk');

    this.subscriptions = this.ngFirestore.collection<dogwalklisting>('dogwalk').snapshotChanges().subscribe();

    var questionsCol = questionsRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
         //return a.payload.doc.data(); // get id using a.payload.doc.id
         return {
          id: a.payload.doc.id,
          ...a.payload.doc.data() as dogwalklisting
        };
      }))
    );

    //console.log('questionsCol');
    //console.log(questionsCol);

    questionsCol.forEach(doc => {
      this.showdata = [];
      doc.forEach(t =>
        {
        
        console.log('questionsCol - for each');

        this.insert_lat_lng = false;

        if (+t.lng.toString() <= +this.new_lng_from)  
        {
          if (+t.lng.toString() >= +this.new_lng_to)
          { 
            if (+t.lat.toString() <= +this.new_lat_from)             
            {
              if (+t.lat.toString() >= +this.new_lat_to)             
              {
                this.insert_lat_lng = true;
              }
            }                    
          }       
        } 

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

        /*
        console.log('t.do')
        console.log(t.do)
        console.log('t.fr')
        console.log(t.fr)
        console.log('t.sa')
        console.log(t.sa)
        console.log('t.so')
        console.log(t.so)
        console.log(this.includeTracks.indexOf("Do"))
        */

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
        
        /*
        console.log('t.fr')
        console.log(t.fr)
        console.log(this.includeTracks)
        console.log(this.includeTracks.indexOf("Fr"))
        */

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

        /*
        console.log('this.insert_fr')
        console.log(this.insert_fr)
        */

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

        /*
        console.log('this.insert_mo')
        console.log(this.insert_mo)
        console.log('this.insert_di')
        console.log(this.insert_di)
        console.log('this.insert_mi')
        console.log(this.insert_mi)
        console.log('this.insert_do')
        console.log(this.insert_do)
        console.log('this.insert_fr')
        console.log(this.insert_fr)
        console.log('this.insert_sa')
        console.log(this.insert_sa)
        console.log('this.insert_so')
        console.log(this.insert_so)
        */

        if(
          (this.insert_lat_lng == true)
          && 
          ( this.insert_mo === true ||
            this.insert_di === true ||
            this.insert_mi === true ||
            this.insert_do === true ||
            this.insert_fr === true ||
            this.insert_sa === true ||
            this.insert_so === true
          )
        )
        {
          this.datasavailable = true;
          this.showdata.push(t);
        }        
       })
    });
  }

  updateSchedule() {
    // Close any open sliding items when the schedule updates

    this.includeTracks = [];
    this.includeTracks.push('Mo');
    this.includeTracks.push('Di');
    this.includeTracks.push('Mi');
    this.includeTracks.push('Do');
    this.includeTracks.push('Fr');
    this.includeTracks.push('Sa');
    this.includeTracks.push('So');

    if (this.dogwalkList) {
      this.dogwalkList.closeSlidingItems();
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
        from: 'Dogwalk' }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludeTracks = data;
      this.updateSchedule();
      /*
      console.log('this.excludeTracks');
      console.log(this.excludeTracks);
      */
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
        console.log('this.includeTracks')   
        console.log(this.includeTracks)   
      })
      this.getdata();
      /*
      console.log('this.includeTracks');
      console.log(this.includeTracks);
      */
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


  openDogwalkCreateModal()
  {
    this.router.navigate(['/dogwalkcreate']);
  }

}
