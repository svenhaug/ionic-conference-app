import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertlistserviceService } from '../../services/alertlistservice.service';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { alertlisting, ratings, comments } from '../../models/firebase-alert.model'; 
import { DatePipe } from '@angular/common';
import { doc, updateDoc, arrayUnion, arrayRemove, FieldValue } from "firebase/firestore";
import { ModalController, AlertController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Observable } from 'rxjs';
import { FILE } from '../../models/firebase-boerse.model';
import { finalize, tap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { Router } from "@angular/router";
import { SettingService } from '../../services/setting.service';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-alertdetail',
  templateUrl: './alertdetail.page.html',
  styleUrls: ['./alertdetail.page.scss'],
})
export class AlertdetailPage implements OnInit {
  
  @ViewChild('map') public mapElement: ElementRef;
  
  map: any;
  posting: any;
  isFavorite = false;
  defaultHref = '';
  alertId: any;
  commentsdata: any;
  useravatar: any = '';
  userdata: any;
  username: any;
  subscriptions: Subscription;
  doratingsubscribe: Subscription;
  docommentsubscribe: Subscription;
  usersubscribe: Subscription;
  comment: any;
  comments: Array<comments> = [];
  user: any;
  canedit: any = 0;
  alertname: any;
  alert: alertlisting = new alertlisting();
  ratings: Array<ratings> = [];
  ratings_update: Array<ratings> = [];
  lat: any;
  lng: any;
  latLng: any;
  directionsDisplay = new google.maps.DirectionsRenderer;
  ratingnr: any;

  slidesOptions: any = {
    zoom: {
      toggle: false // Disable zooming to prevent weird double tap zomming on slide images
    }
  };

  alertdesc: any;
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

  alertadress: any;
  alertlongitude: any;
  alertlatitude: any;
  //createalertForm: FormGroup;
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

  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;

  constructor(
    private route: ActivatedRoute,
    private alertlistserviceservice: AlertlistserviceService,
    public ngFireAuth: AngularFireAuth,
    public datePipe: DatePipe,
    private ngFirestore: AngularFirestore,
    public platform: Platform,
    private iab: InAppBrowser,
    private angularFireStorage: AngularFireStorage,
    private angularFirestore: AngularFirestore,
    private alertController: AlertController,
    private userservice: UserService, 
    private router: Router, 
    private settingservice: SettingService,
    private nativeGeocoder: NativeGeocoder,
    private geolocation: Geolocation,
  ) { }

  ngOnInit() 
  {
    this.getdata();
  }

  getdata()
  {
    this.ratings_update = [];
    this.alertId = this.route.snapshot.paramMap.get('alertId');
    this.subscriptions = this.alertlistserviceservice.getTask(this.alertId).subscribe(data => {
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
      this.alertname = this.posting.name;
      this.alertdesc = this.posting.desc;
      this.alertadress = this.posting.adress;
      this.alertlatitude = this.posting.lat;
      this.alertlongitude = this.posting.lng;
      
      if (this.posting.user)
      {
        if (this.posting.user == this.user.uid)
        {
          this.canedit = 1;
        }  
      }

      if (this.posting.bild1 != 'undefined')
      {
        this.showImages.push(
          {
            source: this.posting.bild1
          }
        );  
      }
      if (this.posting.bild2 != 'undefined')
      {
        this.showImages.push(
          {
            source: this.posting.bild2
          }
        );  
      }
      if (this.posting.bild3 != 'undefined')
      {
        this.showImages.push(
          {
            source: this.posting.bild3
          }
        );  
      }
      if (this.posting.bild4 != 'undefined')
      {
        this.showImages.push(
          {
            source: this.posting.bild4
          }
        );  
      }
      if (this.posting.bild5 != 'undefined')
      {
        this.showImages.push(
          {
            source: this.posting.bild5
          }
        );  
      }

      const current = new Date();

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
      this.initMap(this.posting.lat, this.posting.lng);
    });

    this.alertlistserviceservice.getTaskComments(this.alertId).subscribe(commentsdata => {
      this.commentsdata = commentsdata.comments;
      
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
      title: 'Dogwalk'
    });

    google.maps.event.addListener(this.map, 'click', () => {

      this.GoNav();

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
        title: 'Dogwalk'
      });
    }
  }

  async getuser()
  {
    this.user = await this.ngFireAuth.currentUser;
    this.userdata = this.userservice.getUserdata(this.user.uid);
    console.log('this.userdata ' + this.user.uid);
    this.usersubscribe = this.userdata.subscribe(userdates => 
      {
        this.username = userdates[0].name;
        this.useravatar = userdates[0].bild1;
        this.usersubscribe.unsubscribe;
      })
  }

  GoNav() 
  { 
    let direction = this.posting.lat+","+this.posting.lng;
    if(this.platform.is('ios')){
      this.iab.create( "maps://?q="+direction, "_system");
    }else{
      this.iab.create( "https://www.google.com/maps/search/"+direction, "_system");
    }

  } 

  checkadress()
  {

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.forwardGeocode(this.alertadress, options)
      .then((result: NativeGeocoderResult[]) => 
        {
          console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude);
          this.alertlatitude = result[0].latitude;
          this.alertlongitude = result[0].longitude;
        }
      )
      .catch((error: any) => 
      
        {
          console.log(error);
          this.alertlatitude = null;
          this.alertlongitude = null;
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
      this.alertlatitude = resp.coords.latitude;
      this.alertlongitude = resp.coords.longitude;
      this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options).then((result: NativeGeocoderResult[]) => 
        {
          console.log('______Adresse________');
          console.log(JSON.stringify(result[0]));
          this.alertadress = result[0].thoroughfare + ' ' + result[0].subThoroughfare + ', '+ result[0].postalCode + ' ' + result[0].locality;
        })
        .catch((error: any) => 
        {
          console.log(error);
        }
      );
      
     }).catch((error) => {

       this.alertlatitude = 47.16102;
       this.alertlongitude = 8.44443;
 
       this.nativeGeocoder.reverseGeocode(this.alertlatitude, this.alertlongitude , options).then((result: NativeGeocoderResult[]) => 
        {
          console.log('______Adresse________');
          console.log(JSON.stringify(result[0]));
          this.alertadress = result[0].thoroughfare + ' ' + result[0].subThoroughfare + ', '+ result[0].postalCode + ' ' + result[0].locality;

        })
        .catch((error: any) => 
        {
          console.log(error);
        }
      );
      console.log('Error getting location', error);
    });  
  }

  async addrating()
  {
      await this.getuser();
      let customObj = new ratings();
      const current = new Date();
      customObj.rating = '1';
      customObj.user = 'test';
      customObj.timestamp = current.getTime().toString();
      this.alertId = this.route.snapshot.paramMap.get('alertId');
      this.ratings.push(customObj);
      const updateRef = this.ngFirestore.collection('alert').doc(this.alertId);
      const unionRes = await updateRef.update({
        ratings: arrayUnion(Object.assign({}, customObj))
      });
  }

  async aremoverating()
  {
    await this.getuser();
    const updateRef = this.ngFirestore.collection('alert').doc(this.alertId);
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

    this.getcurrentfilelist();
    
  }

  ionViewWillLeave(): void {
    this.subscriptions.unsubscribe();
    this.alertlistserviceservice.deletefilesCollection();
  }

  savedata()
  {

    if(!this.alertname)
    {
      this.missingdata();
      return;
    }

    if(!this.alertdesc)
    {
      this.missingdata();
      return;
    }

    this.alert.name = this.alertname;
    this.alert.desc = this.alertdesc;
    this.alert.user = this.user.uid;
    this.alert.bild1 = this.bild1_upload;
    this.alert.bild2 = this.bild2_upload;
    this.alert.bild3 = this.bild3_upload;
    this.alert.bild4 = this.bild4_upload;
    this.alert.bild5 = this.bild5_upload;
    
    const current = new Date();
    this.alert.timestamp = current.getTime().toString();
    this.alert.timestampformat =  this.datePipe.transform(current, 'yyyy-MM-dd HH:mm:ss')
    this.alertlistserviceservice.update(this.alertId, Object.assign({}, this.alert));
  }

  deldata()
  {

    this.alertlistserviceservice.delete(this.alertId);
  }

  async missingdata() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Bitte Texte ausfüllen',
      //subHeader: 'Subtitle',
      //message: 'This is an alert message.',
      buttons: ['Ok']
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
    this.alertlistserviceservice.createFile(image);
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



  docomment()
  {
    var commentcoutner = 0;
    this.docommentsubscribe = this.alertlistserviceservice.getTask(this.alertId).subscribe(data => {
      var commentcoutner = +data.commentscounter;
      commentcoutner = commentcoutner + 1
      this.alertlistserviceservice.updatecommentcounter(this.alertId, commentcoutner);
      this.docommentsubscribe.unsubscribe();
    })
  }


  dorating(what)
  {
    this.doratingsubscribe = this.alertlistserviceservice.getTask(this.alertId).subscribe(data => {
      var ratingcoutner = +data.ratingcounter;
      if (what == '+')
      {
        ratingcoutner = ratingcoutner + 1
        this.alertlistserviceservice.updateratingcounter(this.alertId, ratingcoutner);
        this.doratingsubscribe.unsubscribe();
      }
      if (what == '-')
      {
        ratingcoutner = ratingcoutner - 1
        this.alertlistserviceservice.updateratingcounter(this.alertId, ratingcoutner);
        this.doratingsubscribe.unsubscribe();
      }
    })
  }

  goBack()
  {
    this.router.navigate['/alertlist'];
  }

  async addcomment(comment_text)
  {
    await this.getuser();
    let customObj = new comments();
    const current = new Date();
    customObj.comment = comment_text;
    customObj.user = this.user.uid;
    if (!this.useravatar)
    {
      this.useravatar = this.settingservice.avator_icon;
    }
    if (this.useravatar.length == 0)
    {
      this.useravatar = this.settingservice.avator_icon;
    }
    customObj.useravatar = this.useravatar;
    customObj.username = this.username;
    customObj.timestamporder = current.getTime().toString();
    customObj.timestamp =  this.datePipe.transform(current, 'yyyy-MM-dd HH:mm:ss')
    this.alertId = this.route.snapshot.paramMap.get('alertId');
    this.comments.push(customObj);
    const updateRef = this.ngFirestore.collection('alert').doc(this.alertId);
    const unionRes = await updateRef.update({
      comments: arrayUnion(Object.assign({}, customObj))
    });
  }

  chatdo()
  {
    localStorage.setItem('from', 'alert');
    localStorage.setItem('id', this.alertId);
    this.router.navigate(['/chat']);
  }

  async commentsdo() {
    const alert = await this.alertController.create({
      header: 'Melden',
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            this.comment = data.comment;
            this.addcomment(this.comment);
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'comment',
          value: this.comment,
          placeholder: 'Melden'
        }
      ]
    });
    await alert.present();
  }




}
