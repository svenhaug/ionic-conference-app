import { Component } from '@angular/core';
import { Config, ModalController, NavParams } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';
import { RadiusServiceService } from '../../services/radius-service.service'
import { PositionServiceService } from '../../services/position-service.service'
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

@Component({
  selector: 'page-schedule-filter',
  templateUrl: 'schedule-filter.html',
  styleUrls: ['./schedule-filter.scss'],
})
export class ScheduleFilterPage {
  ios: boolean;
  km_search: any;
  from_view: any;
  lat: any;
  lng: any;
  boersepreis: any;

  tracks: {name: string, icon: string, isChecked: boolean}[] = [];

  constructor(
    public confData: ConferenceData,
    private config: Config,
    
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private radiusservice: RadiusServiceService,
    private storage: Storage,
    private geolocation: Geolocation,
    public platform: Platform,
    public posservice: PositionServiceService
  ) 
  { 

  }

  ionViewWillEnter() {
    this.ios = this.config.get('mode') === `ios`;
    const excludedTrackNames = this.navParams.get('excludedTracks');
    this.from_view = this.navParams.get('from');
    if (this.from_view == 'Dogwalk')
    {
        this.confData.getDogwalkFilter().subscribe((tracks: any[]) => {
          tracks.forEach(track => {
            this.tracks.push({
              name: track.name,
              icon: track.icon,
              isChecked: (excludedTrackNames.indexOf(track.name) === -1)
            });
          });
        });  
    }
    else if (this.from_view == 'Petsitting')
    {
        this.confData.getPetsittingFilter().subscribe((tracks: any[]) => {
          tracks.forEach(track => {
            this.tracks.push({
              name: track.name,
              icon: track.icon,
              isChecked: (excludedTrackNames.indexOf(track.name) === -1)
            });
          });
        });  
    }
    else if (this.from_view == 'Boerse')
    {
        this.confData.getBoerseKat().subscribe((tracks: any[]) => {
          tracks.forEach(track => {
            this.tracks.push({
              name: track.name,
              icon: track.icon,
              isChecked: (excludedTrackNames.indexOf(track.name) === -1)
            });
          });
        });  
    }
    else if (this.from_view == 'Alter')
    {
        this.confData.getAlerteKat().subscribe((tracks: any[]) => {
          tracks.forEach(track => {
            this.tracks.push({
              name: track.name,
              icon: track.icon,
              isChecked: (excludedTrackNames.indexOf(track.name) === -1)
            });
          });
        });  
    }
    else
    {
      this.confData.getCommuntiyKat().subscribe((tracks: any[]) => {
        tracks.forEach(track => {
          this.tracks.push({
            name: track.name,
            icon: track.icon,
            isChecked: (excludedTrackNames.indexOf(track.name) === -1)
          });
        });
      });  
    }
  }

  async ionViewDidEnter() {
    this.from_view = this.navParams.get('from');
    await this.storage.get(this.from_view + '_umkreis').then(umkreis =>
    {
      this.km_search = umkreis + ''; 
    });    
  }

  async getpos()
  {
    await this.posservice.getpos().then(pos =>
    {
      this.platform.ready().then(() => {
        this.geolocation.getCurrentPosition().then(async (resp) => {
        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;
        await this.radiusservice.calcradius(this.lat, this.lng, this.km_search, this.from_view).then();
      }).catch(async (error) => {
        console.log('No geolocation found - setting default');
        this.lat = 47.160790;
        this.lng = 8.444505;
        await this.radiusservice.calcradius(this.lat, this.lng, this.km_search, this.from_view).then();
        console.log('Error getting location', error);
        }); 
      });  
    })
  }

  selectAll(check: boolean) {
    // set all to checked or unchecked
    this.tracks.forEach(track => {
      track.isChecked = check;
    });
  }

  applyFilters() {
    // Pass back a new array of track names to exclude
    const excludedTrackNames = this.tracks.filter(c => !c.isChecked).map(c => c.name);
    this.dismiss(excludedTrackNames);
  }

  async dismiss(data?: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    await this.getpos().then(checked => 
      {
        console.log('this_from_view');
        console.log(this.from_view + '_umkreis');
        this.storage.set(this.from_view + '_umkreis', this.km_search);
        this.modalCtrl.dismiss(data);
      }
    )
  }

}
