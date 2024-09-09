import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { BoerselistserviceService } from '../../services/boerselistservice.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Router } from "@angular/router";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { boerselisting } from '../../models/firebase-boerse.model'; 
import { DatePipe } from '@angular/common';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { FILE } from '../../models/firebase-boerse.model';
import { ConferenceData } from '../../providers/conference-data';
import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'app-boersecreate',
  templateUrl: './boersecreate.page.html',
  styleUrls: ['./boersecreate.page.scss'],
})
export class BoersecreatePage implements OnInit {

  
  selectOptions = {
    header: 'Tag(e) / Datum'
  };

  boersename: any;
  boersedesc: any;
  boerseadress: any;
  boerselongitude: any;
  boerselatitude: any;
  boersepreis: any;
  boerse: boerselisting = new boerselisting();
  user: any;
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
  boersecontact: any= "";
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

  boersekat: any; 

  kats: {name: string, icon: string}[] = [];

  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;
  
  constructor(
    private route: ActivatedRoute, 
    private boerselistservicecervice: BoerselistserviceService,
    private ngFirestore: AngularFirestore,
    private router: Router,
    public ngFireAuth: AngularFireAuth,
    public datePipe: DatePipe,
    private nativeGeocoder: NativeGeocoder,
    private geolocation: Geolocation,
    private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage,
    public alertController: AlertController,    
    public confData: ConferenceData,
    public serttingservice: SettingService
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

  async getkat()
  {
    this.kats = [];
    this.confData.getBoerseKat().subscribe((tracks: any[]) => {
      tracks.forEach(track => {
        this.kats.push({
          name: track.name,
          icon: track.icon
          //,isChecked: (excludedTrackNames.indexOf(track.name) === -1)
        });
      });
    });  

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

  ionViewWillLeave(): void {
    this.deletefilesCollection();
  }

  async ngOnInit() {

    this.createboerseForm = new FormGroup({
      boersename: new FormControl('', Validators.required),
      boersedesc: new FormControl('', Validators.required),
      boerseadress: new FormControl('', Validators.required),
      boerselongitude: new FormControl('', Validators.required),
      boerselatitude: new FormControl('', Validators.required),
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
      boersepreis: new FormControl(''),
      boersecontact: new FormControl(''),
      boersekat: new FormControl(''),
      
    });

    this.disable = false;
    this.specdatum = false;
    this.specday = true;

    await this.getuser();
    this.getkat();

  }

  async getuser()
  {
    this.user = await this.ngFireAuth.currentUser;
    
  }

  savedata()
  {
    const current = new Date();
    this.boerse.name = this.boersename;
    this.boerse.desc = this.boersedesc;
    console.log('this.user' + this.user);
    this.boerse.user = localStorage.getItem('user');//this.user.uid;
    this.boerse.timestamp = current.getTime().toString();
    this.boerse.timestampformat =  this.datePipe.transform(current, 'yyyy-MM-dd HH:mm:ss')
    this.boerse.lat = this.boerselatitude;
    this.boerse.lng = this.boerselongitude;
    this.boerse.adress = this.boerseadress;
    if (!this.bild1_upload)
    {
      this.bild1_upload = this.serttingservice.dog_icon;
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
    this.boerse.contact = this.boersecontact;
    this.boerse.mo = this.mo;
    this.boerse.di = this.di;
    this.boerse.mi = this.mi;
    this.boerse.do = this.do;
    this.boerse.fr = this.fr;
    this.boerse.sa = this.sa;
    this.boerse.so = this.so;
    this.boerse.reserviert = "0";
    this.boerse.ratingcounter = '0';
    this.boerse.commentscounter = '0';
    this.boerse.datum = this.datePipe.transform(this.datum, 'yyyy-MM-dd');
    this.boerse.uhrzeit = this.datePipe.transform(this.uhrzeit, 'HH:mm');
    //console.log('this.boerse ' + Object.assign({},this.boerse));
    this.boerselistservicecervice.create(Object.assign({}, this.boerse));
    this.boerselistservicecervice.deletefilesCollection();
    this.router.navigate(['/boerselist']);
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
    this.boerselistservicecervice.createFile(image);
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
