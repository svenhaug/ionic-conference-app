import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { DogwalklistserviceService } from '../../services/dogwalklistservice.service';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { dogwalklisting, ratings, comments } from '../../models/firebase-dogwalk.model'; 
import { DatePipe } from '@angular/common';
import { doc, updateDoc, arrayUnion, arrayRemove, FieldValue } from "firebase/firestore";
import { ModalController, AlertController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Observable } from 'rxjs';
import { FILE } from '../../models/firebase-boerse.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { finalize, tap } from 'rxjs/operators';
import { SettingService } from '../../../app/services/setting.service';
import { UserService } from '../../services/user.service';
import { Router } from "@angular/router";
declare var google;

@Component({
  selector: 'app-dogwalkdetail',
  templateUrl: './dogwalkdetail.page.html',
  styleUrls: ['./dogwalkdetail.page.scss'],
})
export class DogwalkdetailPage implements OnInit {

  @ViewChild('map') public mapElement: ElementRef;
  
  map: any;
  posting: any;
  isFavorite = false;
  userdata: any;
  defaultHref = '';
  categorieId: any;
  useravatar: any = '';
  username: any;
  subscriptions: Subscription;
  doratingsubscribe: Subscription;
  docommentsubscribe: Subscription;
  usersubscribe: Subscription;
  comments: Array<comments> = [];
  user: any;
  canedit: any = 0;
  dogwalkname: any;
  dogwalk: dogwalklisting = new dogwalklisting();
  ratings: Array<ratings> = [];
  ratings_update: Array<ratings> = [];
  lat: any;
  lng: any;
  latLng:any;
  directionsDisplay = new google.maps.DirectionsRenderer;
  postingdatum: any;
  dogwalkadress: any;
  dogwalklatitude: any;
  dogwalklongitude: any;
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

  bild1_upload: any;
  bild2_upload: any;
  bild3_upload: any;
  bild4_upload: any;
  bild5_upload: any;
  disableupload: any = false;
  showImages: Array<any> = [];
  comment: any;
  commentsdata: any;
  contact: any;

  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;

  constructor(
    private route: ActivatedRoute,
    private dogwalklistserviceservice: DogwalklistserviceService,
    public ngFireAuth: AngularFireAuth,
    public datePipe: DatePipe,
    private ngFirestore: AngularFirestore,
    public platform: Platform,
    private iab: InAppBrowser,
    private nativeGeocoder: NativeGeocoder,
    public alertController: AlertController,
    private geolocation: Geolocation,
    private angularFireStorage: AngularFireStorage,
    private angularFirestore: AngularFirestore,
    private settingservice: SettingService,
    private userservice: UserService, 
    private router: Router
  ) { }

  ngOnInit() 
  {
    this.getdata();
  }

  checkalldays(event)
  {
    var daycounter = 0;
    if (this.posting.mo == true)
    {
      daycounter++;
    }
    if (this.posting.di == true)
    {
      daycounter++;
    }
    if (this.posting.mi == true)
    {
      daycounter++;
    }
    if (this.posting.do == true)
    {
      daycounter++;
    }
    if (this.posting.fr == true)
    {
      daycounter++;
    }
    if (this.posting.sa == true)
    {
      daycounter++;
    }
    if (this.posting.so == true)
    {
      daycounter++;
    }
    if (daycounter > 1)
    {
      this.posting.datum = "";
    }
  }

  goBack()
  {
    this.router.navigate['/dogwalklist'];
  }

  checkday()
  {
    console.log(this.posting.datum);
    var t = new Date(this.posting.datum);
    console.log(t.getDay()) 
    var weekday = t.getDay()
    this.posting.mo = false;
    this.posting.di = false;
    this.posting.mi = false;
    this.posting.do = false;
    this.posting.fr = false;
    this.posting.sa = false;
    this.posting.so = false;
    if (weekday == 1)
    {
      this.posting.mo = true;
    }
    if (weekday == 2)
    {
      this.posting.di = true;
    }
    if (weekday == 3)
    {
      this.posting.mi = true;
    }
    if (weekday == 4)
    {
      this.posting.do = true;
    }
    if (weekday == 5)
    {
      this.posting.fr = true;
    }
    if (weekday == 6)
    {
      this.posting.sa = true;
    }
    if (weekday == 7)
    {
      this.posting.so = true;
    }
  }

  checklocaladress()
  {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };


    this.geolocation.getCurrentPosition().then((resp) => {
      this.dogwalklatitude = resp.coords.latitude;
      this.dogwalklongitude = resp.coords.longitude;
      this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options).then((result: NativeGeocoderResult[]) => 
        {
          console.log('______Adresse________');
          console.log(JSON.stringify(result[0]));
          this.dogwalkadress = result[0].thoroughfare + ' ' + result[0].subThoroughfare + ', '+ result[0].postalCode + ' ' + result[0].locality;
        })
        .catch((error: any) => 
        {
          console.log(error);
        }
      );
      
     }).catch((error) => {

       this.dogwalklatitude = 47.16102;
       this.dogwalklongitude = 8.44443;
 
       this.nativeGeocoder.reverseGeocode(this.dogwalklatitude, this.dogwalklongitude , options).then((result: NativeGeocoderResult[]) => 
        {
          console.log('______Adresse________');
          console.log(JSON.stringify(result[0]));
          this.dogwalkadress = result[0].thoroughfare + ' ' + result[0].subThoroughfare + ', '+ result[0].postalCode + ' ' + result[0].locality;

        })
        .catch((error: any) => 
        {
          console.log(error);
        }
      );
      console.log('Error getting location', error);
    });  
  }

  checkadress()
  {

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.forwardGeocode(this.dogwalkadress, options)
      .then((result: NativeGeocoderResult[]) => 
        {
          console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude);
          this.dogwalklatitude = result[0].latitude;
          this.dogwalklongitude = result[0].longitude;
        }
      )
      .catch((error: any) => 
      
        {
          console.log(error);
          this.dogwalklatitude = null;
          this.dogwalklongitude = null;
        }
      );
  }


  getdata()
  {
    this.ratings_update = [];
    const current = new Date();
    this.categorieId = this.route.snapshot.paramMap.get('dogwalkId');
    this.subscriptions = this.dogwalklistserviceservice.getTask(this.categorieId).subscribe(data => {
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
      this.postingdatum = this.posting.datum;
      this.dogwalklatitude = this.posting.lat;
      this.dogwalklongitude = this.posting.lng;
      this.dogwalkadress = this.posting.adress;
      this.contact = this.posting.contact;
      this.initMap(this.posting.lat, this.posting.lng);
      if (this.posting.user)
      {
        if (this.posting.user == this.user.uid)
        {
          this.canedit = 1;
        }  
      }
      this.showImages = [];
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
    this.dogwalklistserviceservice.getTaskComments(this.categorieId).subscribe(commentsdata => {
      this.commentsdata = commentsdata.comments.sort(function(a, b){return b.timestamporder - a.timestamporder});;
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
    console.log('coord');
    console.log(lat);
    console.log(lng);
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

  async addrating()
  {
      await this.getuser();
      let customObj = new ratings();
      const current = new Date();
      customObj.rating = '1';
      customObj.user = 'test';
      customObj.timestamp = current.getTime().toString();
      this.categorieId = this.route.snapshot.paramMap.get('dogwalkId');
      this.ratings.push(customObj);
      const updateRef = this.ngFirestore.collection('community').doc(this.categorieId);
      const unionRes = await updateRef.update({
        ratings: arrayUnion(Object.assign({}, customObj))
      });
  }

  async aremoverating()
  {
    await this.getuser();
    const updateRef = this.ngFirestore.collection('community').doc(this.categorieId);
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

  async ionViewWillEnter()
  {
    await this.getuser();
    await this.getdata();

    this.getcurrentfilelist();
  }

  ionViewWillLeave(): void {
    this.subscriptions.unsubscribe();
    this.getcurrentfilelist();
  }

  ionViewDidLeave()
  {
    this.dogwalklistserviceservice.deletefilesCollection();
  }  

  savedata()
  {
    this.dogwalk.name = this.posting.name;
    this.dogwalk.user = this.user.uid;
    this.dogwalk.mo = this.posting.mo;
    this.dogwalk.di = this.posting.di;
    this.dogwalk.mi = this.posting.mi;
    this.dogwalk.do = this.posting.do;
    this.dogwalk.fr = this.posting.fr;
    this.dogwalk.sa = this.posting.sa;
    this.dogwalk.so = this.posting.so;
    this.dogwalk.bild1 = this.bild1_upload;
    this.dogwalk.bild2 = this.bild2_upload;
    this.dogwalk.bild3 = this.bild3_upload;
    this.dogwalk.bild4 = this.bild4_upload;
    this.dogwalk.bild5 = this.bild5_upload;
    this.dogwalk.contact = this.contact;
    this.dogwalk.datum = this.datePipe.transform(this.posting.datum, 'yyyy-MM-dd');
    //this.dogwalk.uhrzeit = this.datePipe.transform(this.posting.uhrzeit, 'HH:mm');
    this.dogwalk.uhrzeit = this.posting.uhrzeit;
    const current = new Date();
    this.dogwalk.timestamp = current.getTime().toString();
    this.dogwalk.timestampformat =  this.datePipe.transform(current, 'yyyy-MM-dd HH:mm:ss')
    this.dogwalklistserviceservice.update(this.categorieId, Object.assign({}, this.dogwalk));
  }

  deldata()
  {
    this.dogwalklistserviceservice.delete(this.categorieId);
  }


  createFile(image: FILE)
  {
    this.dogwalklistserviceservice.createFile(image);
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

  GoNavigation() 
  { 
    let direction = this.posting.lat+","+this.posting.lng;
    if(this.platform.is('ios')){
      this.iab.create( "maps://?q="+direction, "_system");
    }else{
      this.iab.create( "https://www.google.com/maps/search/"+direction, "_system");
    }
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

  dorating(what)
  {
    this.doratingsubscribe = this.dogwalklistserviceservice.getTask(this.categorieId).subscribe(data => {
      var ratingcoutner = +data.ratingcounter;
      if (what == '+')
      {
        ratingcoutner = ratingcoutner + 1
        this.dogwalklistserviceservice.updateratingcounter(this.categorieId, ratingcoutner);
        this.doratingsubscribe.unsubscribe();
      }
      if (what == '-')
      {
        ratingcoutner = ratingcoutner - 1
        this.dogwalklistserviceservice.updateratingcounter(this.categorieId, ratingcoutner);
        this.doratingsubscribe.unsubscribe();
      }
    })
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
      customObj.useravatar = this.useravatar;
      customObj.username = this.username;
      customObj.timestamporder = current.getTime().toString();
      customObj.timestamp =  this.datePipe.transform(current, 'yyyy-MM-dd HH:mm:ss')
      this.categorieId = this.route.snapshot.paramMap.get('dogwalkId');
      this.comments.push(customObj);
      const updateRef = this.ngFirestore.collection('dogwalk').doc(this.categorieId);
      const unionRes = await updateRef.update({
        comments: arrayUnion(Object.assign({}, customObj))
      });
  }

  chatdo()
  {
    localStorage.setItem('from', 'dogwalk');
    localStorage.setItem('id', this.categorieId);
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
