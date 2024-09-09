import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoerselistserviceService } from '../../services/boerselistservice.service';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { boerselisting, ratings, comments } from '../../models/firebase-boerse.model'; 
import { DatePipe } from '@angular/common';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { doc, updateDoc, arrayUnion, arrayRemove, FieldValue } from "firebase/firestore";
import { ModalController, AlertController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Observable } from 'rxjs';
import { FILE } from '../../models/firebase-boerse.model';
import { Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { finalize, tap } from 'rxjs/operators';
import { SettingService } from '../../../app/services/setting.service';
import { ConferenceData } from '../../providers/conference-data';
declare var google;

@Component({
  selector: 'app-boersedetail',
  templateUrl: './boersedetail.page.html',
  styleUrls: ['./boersedetail.page.scss'],
})

export class BoersedetailPage implements OnInit {
  
  @ViewChild('map') public mapElement: ElementRef;

  slidesOptions: any = {
    zoom: {
      toggle: false // Disable zooming to prevent weird double tap zomming on slide images
    }
  };


  map: any;
  posting: any;
  isFavorite = false;
  defaultHref = '';
  boerseId: any;
  subscriptions: Subscription;
  docommentsubscribe: Subscription;
  usersubscribe: Subscription;
  doratingsubscribe: Subscription;
  username: any;
  comments: Array<comments> = [];
  user: any;
  canedit: any = 0;
  boersename: any;
  boersedesc: any;
  boersecontact: any;
  boersepreis: any;
  boerseadresse: any;
  reserviert: any;
  boerse: boerselisting = new boerselisting();
  ratings: Array<ratings> = [];
  ratings_update: Array<ratings> = [];
  lat: any;
  lng: any;
  latLng: any;
  boersekat: any;

  directionsDisplay = new google.maps.DirectionsRenderer;
  showImages: Array<any> = [];
  colorVariants = [];
  sizeVariants = [];
  sameuser: any = '0';
  files: Observable<FILE[]>;
  //files: Array<any> = [];
  isImgUploading: boolean;
  isImgUploaded: boolean;
  filecounter: number = 0;

  FileName: string;
  FileSize: number = 1;
  filelisting: any;
  ngFireUploadTask: AngularFireUploadTask;
  progressNum: Observable<number>;
  progressSnapshot: Observable<any>;
  fileUploadedPath: Observable<string>;
  filescreated: number = 0;


  boerseadress: any;
  boerselongitude: any;
  boerselatitude: any;
  createboerseForm: FormGroup;
  disable: any;
  downloadurl: string; 
  mo: any = false;
  di: any = false;
  mi: any = false;
  do: any = false;
  fr: any = false;
  sa: any = false;
  so: any = false;
  datum: any = "";
  uhrzeit: any = "";
  maxanzahl: any = "";
  specdatum: any = false;
  specday: any = true;
  zeitanzeige = 'day';

  bild1_upload: any;
  bild2_upload: any;
  bild3_upload: any;
  bild4_upload: any;
  bild5_upload: any;
  disableupload: any = false;

  kats: {name: string, icon: string}[] = [];

  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;

  constructor(
    private route: ActivatedRoute,
    private boerselistserviceservice: BoerselistserviceService,
    private boerselistservicecervice: BoerselistserviceService,
    public ngFireAuth: AngularFireAuth,
    public datePipe: DatePipe,
    private ngFirestore: AngularFirestore,
    public platform: Platform,
    private iab: InAppBrowser,
    private angularFirestore: AngularFirestore,
    private alertController: AlertController,
    private angularFireStorage: AngularFireStorage,
    private router: Router,
    private nativeGeocoder: NativeGeocoder,
    private geolocation: Geolocation,
    private settingservice: SettingService,
    public confData: ConferenceData,
  ) { }

  ngOnInit() 
  {
    this.getdata();
    this.getkat();
    
  }

  goBack()
  {
    this.router.navigate['/boerselist'];
  }

  async getkat()
  {
    this.kats = [];
    this.confData.getCommuntiyKat().subscribe((tracks: any[]) => {
      tracks.forEach(track => {
        this.kats.push({
          name: track.name,
          icon: track.icon
          //,isChecked: (excludedTrackNames.indexOf(track.name) === -1)
        });
      });
    });  

  }

  async meins()
  {
    this.getuser();
    this.boerseId = this.route.snapshot.paramMap.get('boerseId');

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Willst du das haben?',
      //message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Nein',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ja',
          id: 'confirm-button',
          handler: () => {
            this.domeins(this.boerseId);
          }
        }
      ]
    });

    await alert.present();

  }
  
  domeins(id)
  {
      this.boerse.reserviert = "1";
      this.boerse.reserviert_user = this.user;
      this.boerselistserviceservice.meinding(id, Object.assign({},this.boerse));
  }

  getdata()
  {
    this.ratings_update = [];
    this.showImages = [];
    const current = new Date();
    this.boerseId = this.route.snapshot.paramMap.get('boerseId');
    this.subscriptions = this.boerselistserviceservice.getTask(this.boerseId).subscribe(data => {
      if (data.ratings)
      {
        data.ratings.forEach(rates =>
          {
            this.ratings_update.push(
              {
              rating: rates['rating'], timestamp: rates['timestamp'], user: rates['user']
              }
              );    
          }
        )
      }
      this.posting = data;
      this.showImages = [];
      this.boersename = this.posting.name;
      this.boersedesc = this.posting.desc;
      this.boersecontact = this.posting.contact;
      this.boersepreis = this.posting.preis;
      this.reserviert = this.posting.reserviert;
      this.boerseadresse = this.posting.adress;
      this.boersekat = this.posting.kat;

      if (this.posting.user)
      {
        if (this.posting.user == this.user.uid)
        {
          this.canedit = 1;
        }  
      }
      
      if (this.posting.bild1 != 'undefined')
      {
        if(this.posting.bild1.length > 0)
        {
          this.showImages.push(
            {
              source: this.posting.bild1
            }
          );    
        }
        else
        {
          this.showImages.push(
            {
              source: this.settingservice.dog_icon
            }
          );    
        }
      } 
      else
      {
        this.showImages.push(
          {
            source: this.settingservice.dog_icon
          }
        );  
      }
      if (this.posting.bild2 != 'undefined')
      {
        if(this.posting.bild2.length > 0)
        {
          this.showImages.push(
            {
              source: this.posting.bild2
            }
          );    
        }
        else
        {
          this.showImages.push(
            {
              source: this.settingservice.dog_icon
            }
          );    
        }
      }
      else
      {
        this.showImages.push(
          {
            source: this.settingservice.dog_icon
          }
        );  
      }
      if (this.posting.bild3 != 'undefined')
      {
        if(this.posting.bild3.length > 0)
        {
          this.showImages.push(
            {
              source: this.posting.bild3
            }
          );    
        }
        else
        {
          this.showImages.push(
            {
              source: this.settingservice.dog_icon
            }
          );    
        }

      }
      else
      {
        this.showImages.push(
          {
            source: this.settingservice.dog_icon
          }
        );  
      }
      if (this.posting.bild4 != 'undefined')
      {
        if(this.posting.bild4.length > 0)
        {
          this.showImages.push(
            {
              source: this.posting.bild4
            }
          );    
        }
        else
        {
          this.showImages.push(
            {
              source: this.settingservice.dog_icon
            }
          );    
        }

      }
      else
      {
        this.showImages.push(
          {
            source: this.settingservice.dog_icon
          }
        );  
      }
      if (this.posting.bild5 != 'undefined')
      {
        if(this.posting.bild5.length > 0)
        {
          this.showImages.push(
            {
              source: this.posting.bild5
            }
          );    
        }
        else
        {
          this.showImages.push(
            {
              source: this.settingservice.dog_icon
            }
          );    
        }

      }
      else
      {
        this.showImages.push(
          {
            source: this.settingservice.dog_icon
          }
        );  
      }

      this.getuser();
      this.initMap(this.posting.lat, this.posting.lng);
      
      if (this.user.uid == this.posting.user)
      {
        this.sameuser = '1';
      }

      this.boerselongitude = this.posting.lng;
      this.boerselatitude = this.posting.lat;
      this.boerseadress = this.posting.adress;
      this.boersepreis = this.posting.preis;

      if(this.filescreated == 0)
      {
        this.filescreated = 1;
        if (this.posting.bild1.length > 0)
        {
          this.createFile({
            name: 'bild1',
            filepath: this.posting.bild1,
            size: this.FileSize,
            user: localStorage.getItem('user'), 
            timestamp: current.getTime().toString()
          });  
        }
        if (this.posting.bild2.length > 0)
        {
          this.createFile({
            name: 'bild2',
            filepath: this.posting.bild2,
            size: this.FileSize,
            user: localStorage.getItem('user'), 
            timestamp: current.getTime().toString()
          });
        }
        if (this.posting.bild3.length > 0)
        {
          this.createFile({
            name: 'bild3',
            filepath: this.posting.bild3,
            size: this.FileSize,
            user: localStorage.getItem('user'), 
            timestamp: current.getTime().toString()
          });
        }
        if (this.posting.bild4.length > 0)
        {
          this.createFile({
            name: 'bild4',
            filepath: this.posting.bild4,
            size: this.FileSize,
            user: localStorage.getItem('user'), 
            timestamp: current.getTime().toString()
          });
        }
        if (this.posting.bild5.length > 0)
        {
          this.createFile({
            name: 'bild5',
            filepath: this.posting.bild5,
            size: this.FileSize,
            user: localStorage.getItem('user'), 
            timestamp: current.getTime().toString()
          });
        }
      }
    });
  }

  async initMap(lat, lng)
  {
    console.log('hier' + lat + lng);
    this.latLng = new google.maps.LatLng(lat,lng);
    var mapzoom: number = 0;
    mapzoom = 12;

    let mapOptions = {
        center: this.latLng,
        zoom: mapzoom,
        mapTypeId: 'roadmap',
        streetViewControl: false
      }

    this.directionsDisplay.setMap(this.map);

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    var marker = new google.maps.Marker({
      position: this.latLng,
      map: this.map,
      title: ''
    });

    google.maps.event.addListener(this.map, 'click', () => {

      this.GoNavigation();

    });    

    await this.createMarker(lat, lng);

  }

  createMarker(lat, lng) {
    var myLatLngList = {
    myLatLng : [{ lat: lat, lng: lng }]    
    };

    for(const data of myLatLngList.myLatLng){
      var marker = new google.maps.Marker({
        position: data,
        map: this.map,
        title: ''
      });
    }
  }

  async getuser()
  {
    this.user = await this.ngFireAuth.currentUser;
    
  }

  GoNavigation() 
  { 
    let direction = this.posting.lat+","+this.posting.lng;
    if(this.platform.is('ios')){
      this.iab.create( "maps://?q="+direction, "_system");
    }else{
      this.iab.create( "https://www.google.com/maps/search/"+direction, "_system");
    }
  } 

  async openColorChooser() {
    const alert = await this.alertController.create({
      header: 'Color',
      inputs: this.colorVariants,
      cssClass: 'variant-alert color-chooser',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'OK',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  async openSizeChooser() {
    const alert = await this.alertController.create({
      header: 'Size',
      inputs: this.sizeVariants,
      cssClass: 'variant-alert size-chooser',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'OK',
          handler: (selectedValue) => {
            console.log('Selected Value', selectedValue);
          }
        }
      ]
    });

    await alert.present();
  }

  ionViewDidLeave()
  {
    this.boerselistservicecervice.deletefilesCollection();
  }  

  async addrating()
  {
      await this.getuser();
      let customObj = new ratings();
      const current = new Date();
      customObj.rating = '1';
      customObj.user = 'test';
      customObj.timestamp = current.getTime().toString();
      this.boerseId = this.route.snapshot.paramMap.get('boerseId');
      this.ratings.push(customObj);
      const updateRef = this.ngFirestore.collection('community').doc(this.boerseId);
      const unionRes = await updateRef.update({
        ratings: arrayUnion(Object.assign({}, customObj))
      });
  }

  async aremoverating()
  {
    await this.getuser();
    const updateRef = this.ngFirestore.collection('community').doc(this.boerseId);
    let customObj = new ratings();
    this.ratings_update.forEach(rate =>      
      {
        customObj.rating = rate['rating'];
        customObj.user = rate['user'];
        customObj.timestamp = rate['timestamp'];
      }
    );
    updateRef.set(
      {
        ratings: arrayRemove(Object.assign({}, customObj))
      },
      {merge: true},
    );  
  }

  async ionViewDidEnter()
  {
    await this.getuser();
    await this.getdata();
    await this.getkat();


    this.getcurrentfilelist();
  }


  getcurrentfilelist()
  {

    this.ngFirestoreCollection = this.angularFirestore.collection<FILE>('filesCollection', ref => ref.where('user', '==' , localStorage.getItem('user')).orderBy('timestamp', 'desc'));
    this.files = this.ngFirestoreCollection.valueChanges();

    this.bild1_upload = '';
    this.bild2_upload = '';
    this.bild3_upload = '';
    this.bild4_upload = '';
    this.bild5_upload = '';
    this.files.subscribe(filelist => 
      {
        this.filecounter = 0;
        this.filelisting = filelist;
        this.filelisting.forEach(filecheck => {
          console.log(filecheck);
          this.filecounter++;
        });
        console.log('this.filecounter ' + this.filecounter);
        if (this.filecounter >= 5)
        {
          this.disableupload = true;
        }
        else 
        {
          this.disableupload = false;
        }

        for (let index = 0; index < this.filecounter; index++) 
        {
          if (index == 0)
          {
            if (this.filelisting[index].filepath === 'undefined')
            {
              this.bild1_upload = '';
            }
            else 
            {
              this.bild1_upload = this.filelisting[index].filepath;
            }            
          } 
          else if (index == 1)
          {
            if (this.filelisting[index].filepath === 'undefined')
            {
              this.bild2_upload = '';
            }
            else 
            {
              this.bild2_upload = this.filelisting[index].filepath;
            }
          }
          else if (index == 2)
          {
            if (this.filelisting[index].filepath === 'undefined')
            {
              this.bild3_upload = '';
            }
            else 
            {
              this.bild3_upload = this.filelisting[index].filepath;
            }
          }
          else if (index == 3)
          {
            if (this.filelisting[index].filepath === 'undefined')
            {
              this.bild4_upload = '';
            }
            else 
            {
              this.bild4_upload = this.filelisting[index].filepath;
            }
          }
          else
          {
            if (this.filelisting[index].filepath === 'undefined')
            {
              this.bild5_upload = '';
            }
            else 
            {
              this.bild5_upload = this.filelisting[index].filepath;
            }
          }
        }    
        //console.log('this.bild1_upload ' + this.bild1_upload);
      }
    )

  }


  ionViewWillLeave(): void {
    this.subscriptions.unsubscribe();
  }

  savedata()
  {
    //this.getcurrentfilelist();
    this.boerse.name = this.posting.name;
    this.boerse.user = this.user.uid;
    const current = new Date();
    this.boerse.timestamp = current.getTime().toString();
    this.boerse.timestampformat =  this.datePipe.transform(current, 'yyyy-MM-dd HH:mm:ss')
    this.boerselistserviceservice.update(this.boerseId, Object.assign({}, this.boerse));

    this.boerse.name = this.boersename;
    this.boerse.desc = this.boersedesc;
    //console.log('this.bild1_upload' + this.bild1_upload);
    this.boerse.user = localStorage.getItem('user');//this.user.uid;
    this.boerse.timestamp = current.getTime().toString();
    this.boerse.timestampformat =  this.datePipe.transform(current, 'yyyy-MM-dd HH:mm:ss')
    this.boerse.lat = this.boerselatitude;
    this.boerse.lng = this.boerselongitude;
    this.boerse.adress = this.boerseadress;
    this.boerse.contact = this.boersecontact;
    if (!this.bild1_upload)
    {
      this.bild1_upload = this.settingservice.dog_icon;
    }
    this.boerse.bild1 = this.bild1_upload;
    this.boerse.bild2 = this.bild2_upload;
    this.boerse.bild3 = this.bild3_upload;
    this.boerse.bild4 = this.bild4_upload;
    this.boerse.bild5 = this.bild5_upload;
    this.boerse.kat = this.boersekat;
    if (!this.boersepreis)
    {
      this.boersepreis = '0.00';
    }
    this.boerse.preis = this.boersepreis;
    this.boerse.reserviert = "0";
    this.boerse.datum = this.datePipe.transform(this.datum, 'yyyy-MM-dd');
    this.boerse.uhrzeit = this.datePipe.transform(this.uhrzeit, 'HH:mm');
    console.log('this.boerse ' + this.boerse.desc);
    this.boerselistservicecervice.update(this.boerseId, Object.assign({}, this.boerse));
    //this.boerselistservicecervice.deletefilesCollection();
    //this.router.navigate(['/app/tabs/tabboerse']);
  }

  deldata()
  {
    this.boerselistserviceservice.delete(this.boerseId);
  }


  checkadress()
  {

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.forwardGeocode(this.boerseadress, options)
      .then((result: NativeGeocoderResult[]) => 
        {
          console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude);
          this.boerselatitude = result[0].latitude;
          this.boerselongitude = result[0].longitude;
        }
      )
      .catch((error: any) => 
      
        {
          console.log(error);
          this.boerselatitude = null;
          this.boerselongitude = null;
        }
      );
  }

  checklocaladress()
  {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };


    this.geolocation.getCurrentPosition().then((resp) => {
      this.boerselatitude = resp.coords.latitude;
      this.boerselongitude = resp.coords.longitude;
      this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options).then((result: NativeGeocoderResult[]) => 
        {
          console.log('______Adresse________');
          console.log(JSON.stringify(result[0]));
          this.boerseadress = result[0].thoroughfare + ' ' + result[0].subThoroughfare + ', '+ result[0].postalCode + ' ' + result[0].locality;
        })
        .catch((error: any) => 
        {
          console.log(error);
        }
      );
      
     }).catch((error) => {

       this.boerselatitude = 47.16102;
       this.boerselongitude = 8.44443;
 
       this.nativeGeocoder.reverseGeocode(this.boerselatitude, this.boerselongitude , options).then((result: NativeGeocoderResult[]) => 
        {
          console.log('______Adresse________');
          console.log(JSON.stringify(result[0]));
          this.boerseadress = result[0].thoroughfare + ' ' + result[0].subThoroughfare + ', '+ result[0].postalCode + ' ' + result[0].locality;

        })
        .catch((error: any) => 
        {
          console.log(error);
        }
      );
      console.log('Error getting location', error);
    });  
  }

  delsingelfile(filepath)
  {
    this.angularFirestore.collection<FILE>('filesCollection', ref => ref.where('filepath', '==' , filepath)).get().subscribe((querySnapshot) => 
    {
      querySnapshot.forEach((doc) => 
      {
        doc.ref.delete().then(() => {
          console.log('deleted')
          this.getcurrentfilelist();
        }).catch(function (error) {
          console.log('FEHLER')
        })
      })
    });
  }

  async presentAlertConfirm(filepath) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Bild löschen?',
      //message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Nein',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ja',
          id: 'confirm-button',
          handler: () => {
            this.delsingelfile(filepath);
          }
        }
      ]
    });

    await alert.present();
  }

  async noUpdate() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Max. 5 Bilder pro Posting',
      //subHeader: 'Subtitle',
      //message: 'This is an alert message.',
      buttons: ['Ok']
    });

    await alert.present();
  }

  createFile(image: FILE)
  {
    this.boerselistservicecervice.createFile(image);
  }
  
  fileUpload(event: FileList) {    

    console.log('event ' + event);
    const file = event.item(0)
    if(this.filecounter >= 5)
    {
      this.noUpdate();
      return;
    }

    if (file.type.split('/')[0] !== 'image') { 
      console.log('File type is not supported!')
      return;
    }

    this.isImgUploading = true;
    this.isImgUploaded = false;
    this.FileName = file.name;
    const fileStoragePath = `filesStorage/${new Date().getTime()}_${file.name}`;
    const imageRef = this.angularFireStorage.ref(fileStoragePath);
    this.ngFireUploadTask = this.angularFireStorage.upload(fileStoragePath, file);
    this.progressNum = this.ngFireUploadTask.percentageChanges();

    this.ngFireUploadTask.snapshotChanges().pipe(
    finalize(() => 
        {
          this.fileUploadedPath = imageRef.getDownloadURL();
          const current = new Date();
          this.fileUploadedPath.subscribe(resp=>{
            this.createFile({
              name: file.name,
              filepath: resp,
              size: this.FileSize,
              user: localStorage.getItem('user'), 
              timestamp: current.getTime().toString()
            });
            this.isImgUploading = false;
            this.isImgUploaded = true;
            this.getcurrentfilelist();
          },error => {
            console.log(error);
          })

        }
      )
    )
    .subscribe(

    );
  }
}
