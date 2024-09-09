import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
//import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class PositionServiceService {

  km_search: any;
  from_view: any;
  lat: any;
  lng: any;

  constructor(
    private storage: Storage,
    private geolocation: Geolocation,
    public platform: Platform,

  ) { }

  async setvaribales()
  {
    this.storage.get('Community_umkreis').then(umkreis =>
    {
      if(!umkreis)
      {
        this.storage.set('Community_umkreis', 5);
      }
    }).catch(err =>
    {
      this.storage.set('Community_umkreis', 5);
    })

    this.storage.get('Dogwalk_umkreis').then(umkreis =>
    {
      if(!umkreis)
      {
        this.storage.set('Dogwalk_umkreis', 5);
      }
    }).catch(err =>
    {
      this.storage.set('Dogwalk_umkreis', 5);
    })

    this.storage.get('Boerse_umkreis').then(umkreis =>
    {
      if(!umkreis)
      {
        this.storage.set('Boerse_umkreis', 5);
      }
    }).catch(err =>
    {
      this.storage.set('Boerse_umkreis', 5);
    })

    this.storage.get('Petsitting_umkreis').then(umkreis =>
    {
      if(!umkreis)
      {
        this.storage.set('Petsitting_umkreis', 5);
      }
    }).catch(err =>
    {
      this.storage.set('Petsitting_umkreis', 5);
    })

    this.storage.get('Alert_umkreis').then(umkreis =>
    {
      if(!umkreis)
      {
        this.storage.set('Alert_umkreis', 5);
      }
    }).catch(err =>
    {
      this.storage.set('Alert_umkreis', 5);
    })

    this.storage.get('Overview_umkreis').then(umkreis =>
    {
      if(!umkreis)
      {
        this.storage.set('Overview_umkreis', 5);
      }
    }).catch(err =>
    {
      this.storage.set('Overview_umkreis', 5);
    })
  }

  async getpos()
  {
    await this.platform.ready().then(() => {
      this.geolocation.getCurrentPosition().then(async (resp) => 
      {
        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;
        this.storage.set('Latitude', this.lat);
        this.storage.set('Longitude', this.lng);
        console.log('PosSerice: ' + this.lat + ' ' + this.lng);
        //await this.radiusservice.calcradius(this.lat, this.lng, this.km_search, this.from_view).then();
      }).catch(async (error) => {
        console.log('No geolocation found - setting default');
        this.lat = 47.160790;
        this.lng = 8.444505;
        this.storage.set('Latitude', this.lat);
        this.storage.set('Longitude', this.lng);
        console.log('PosSerice_Fehler');
        //await this.radiusservice.calcradius(this.lat, this.lng, this.km_search, this.from_view).then();
        console.log('Error getting location', error);
      }); 
    });  
  }
}
