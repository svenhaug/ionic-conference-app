import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { AlertlistserviceService } from '../../services/alertlistservice.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Router } from "@angular/router";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { alertlisting } from '../../models/firebase-alert.model'; 
import { DatePipe } from '@angular/common';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { FILE } from '../../models/firebase-alert.model';

@Component({
  selector: 'app-alertcreate',
  templateUrl: './alertcreate.page.html',
  styleUrls: ['./alertcreate.page.scss'],
})
export class AlertcreatePage implements OnInit {

  selectOptions = {
    header: 'Tag(e) / Datum'
  };

  alertname: any;
  alertdesc: any;
  alertadress: any;
  alertlongitude: any;
  alertlatitude: any;
  alert: alertlisting = new alertlisting();
  user: any;
  createAlertForm: FormGroup;
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
  
  ngFireUploadTask: AngularFireUploadTask;
  progressNum: Observable<number>;
  progressSnapshot: Observable<any>;
  fileUploadedPath: Observable<string>;
  files: Observable<FILE[]>;

  FileName: string;
  FileSize: number = 1;
  filelisting: any;

  isImgUploading: boolean;
  isImgUploaded: boolean;
  filecounter: number = 0;

  bild1_upload: any;
  bild2_upload: any;
  bild3_upload: any;
  bild4_upload: any;
  bild5_upload: any;
  disableupload: any = false;

  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;
  
  constructor(
    private route: ActivatedRoute, 
    private alertlistservicecervice: AlertlistserviceService,
    private ngFirestore: AngularFirestore,
    private router: Router,
    public ngFireAuth: AngularFireAuth,
    public datePipe: DatePipe,
    private nativeGeocoder: NativeGeocoder,
    private geolocation: Geolocation,
    private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage,
    public alertController: AlertController
  ) { 

    this.isImgUploading = false;
    this.isImgUploaded = false;
    
    this.ngFirestoreCollection = angularFirestore.collection<FILE>('filesCollection', ref => ref.where('user', '==' , localStorage.getItem('user')).orderBy('timestamp', 'desc'));
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
      }
    )
  }

  ionViewWillLeave(): void {
    this.deletefilesCollection();
  }

  zeitanzeigechange()
  {
    console.log(this.zeitanzeige);
    if (this.zeitanzeige == "day")
    {
      this.specdatum = false;
      this.specday = true;
    }
    else
    {
      this.specdatum = true;
      this.specday = false;
    }
    
  }


  async ngOnInit() {

    this.createAlertForm = new FormGroup({
      alertname: new FormControl('', Validators.required),
      alertdesc: new FormControl('', Validators.required),
      alertadress: new FormControl('', Validators.required),
      alertlongitude: new FormControl('', Validators.required),
      alertlatitude: new FormControl('', Validators.required),
      mo: new FormControl(''),
      di: new FormControl(''),
      mi: new FormControl(''),
      do: new FormControl(''),
      fr: new FormControl(''),
      sa: new FormControl(''),
      so: new FormControl(''),
      datum: new FormControl(''),
      uhrzeit: new FormControl(''),
      zeitanzeige: new FormControl(''),
    });

    this.disable = false;
    this.specdatum = false;
    this.specday = true;

    await this.getuser();

  }

  async getuser()
  {
    this.user = await this.ngFireAuth.currentUser;
    
  }

  savedata()
  {
    const current = new Date();
    this.alert.name = this.alertname;
    this.alert.desc = this.alertdesc;
    console.log('this.user' + this.user);
    this.alert.user = localStorage.getItem('user');//this.user.uid;
    this.alert.timestamp = current.getTime().toString();
    this.alert.timestampformat =  this.datePipe.transform(current, 'yyyy-MM-dd HH:mm:ss')
    this.alert.lat = this.alertlatitude;
    this.alert.lng = this.alertlongitude;
    this.alert.adress = this.alertadress;
    this.alert.bild1 = this.bild1_upload;
    this.alert.bild2 = this.bild2_upload;
    this.alert.bild3 = this.bild3_upload;
    this.alert.bild4 = this.bild4_upload;
    this.alert.bild5 = this.bild5_upload;
    this.alert.mo = this.mo;
    this.alert.di = this.di;
    this.alert.mi = this.mi;
    this.alert.do = this.do;
    this.alert.fr = this.fr;
    this.alert.sa = this.sa;
    this.alert.so = this.so;
    this.alert.ratingcounter = '0';
    this.alert.commentscounter = '0';
    this.alert.datum = this.datePipe.transform(this.datum, 'yyyy-MM-dd');
    this.alert.uhrzeit = this.datePipe.transform(this.uhrzeit, 'HH:mm');
    console.log('this.alert ' + Object.assign({},this.alert));
    this.alertlistservicecervice.create(Object.assign({}, this.alert));
    this.deletefilesCollection();
    this.router.navigate(['/app/tabs/tabalert']);
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


  fileUpload(event: FileList) {
      
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
        },error => {
          console.log(error);
        })

      }
      )
    )
    .subscribe();

    /*
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(
      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();
        
        this.fileUploadedPath.subscribe(resp=>{
          this.fileStorage({
            name: file.name,
            filepath: resp,
            size: this.FileSize,
            user: localStorage.getItem('user')
          });
          this.isImgUploading = false;
          this.isImgUploaded = true;
        },error => {
          console.log(error);
        })
      }),
      tap(snap => {
          this.FileSize = snap.totalBytes;
      })
    )
    */
  }

  deletefilesCollection()
  {
    this.angularFirestore.collection<FILE>('filesCollection', ref => ref.where('user', '==' , localStorage.getItem('user'))).get().subscribe((querySnapshot) => 
    {
      querySnapshot.forEach((doc) => 
      {
        doc.ref.delete().then(() => {
          console.log('deleted')

        }).catch(function (error) {
          console.log('FEHLER')
        })

      })

    });
  }



  createFile(image: FILE)
  {
    this.alertlistservicecervice.createFile(image);
  }


  fileStorage(image: FILE) {
    const ImgId = this.angularFirestore.createId();
    this.ngFirestoreCollection.doc(ImgId).set(image).then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    });
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


  delsingelfile(filepath)
  {
    this.angularFirestore.collection<FILE>('filesCollection', ref => ref.where('filepath', '==' , filepath)).get().subscribe((querySnapshot) => 
    {
      querySnapshot.forEach((doc) => 
      {
        doc.ref.delete().then(() => {
          console.log('deleted')

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


}
