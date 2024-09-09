import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { PetsittinglistserviceService } from '../../services/petsittinglistservice.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Router } from "@angular/router";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { petsittinglisting } from '../../models/firebase-petsitting.model'; 
import { DatePipe } from '@angular/common';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { FILE } from '../../models/firebase-petsitting.model';
import { ConferenceData } from '../../providers/conference-data';

@Component({
  selector: 'app-petsittingcreate',
  templateUrl: './petsittingcreate.page.html',
  styleUrls: ['./petsittingcreate.page.scss'],
})
export class PetsittingcreatePage implements OnInit {


  selectOptions = {
    header: 'Tag(e) / Datum'
  };

  petsittingname: any;
  petsittingdesc: any;
  petsittingadress: any;
  petsittinglongitude: any;
  petsittinglatitude: any;
  petsittingcontact: any;
  petsittingkat: any;
  petsitting: petsittinglisting = new petsittinglisting();
  user: any;
  createCommunityForm: FormGroup;
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

  kats: {name: string, icon: string}[] = [];

  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;

  constructor(
    private route: ActivatedRoute, 
    private petsittinglistserviceservice: PetsittinglistserviceService,
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

  ) { this.isImgUploading = false;
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

    this.createCommunityForm = new FormGroup({
      petsittingname: new FormControl('', Validators.required),
      petsittingdesc: new FormControl('', Validators.required),
      petsittingadress: new FormControl('', Validators.required),
      petsittinglongitude: new FormControl('', Validators.required),
      petsittinglatitude: new FormControl('', Validators.required),
      petsittingcontact: new FormControl('', Validators.required),
      //petsittingkat: new FormControl('', Validators.required),
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

  /*
  async getkat()
  {
    this.kats = [];
    this.confData.getPetsittingKats().subscribe((tracks: any[]) => {
      tracks.forEach(track => {
        this.kats.push({
          name: track.name,
          icon: track.icon
          //,isChecked: (excludedTrackNames.indexOf(track.name) === -1)
        });
      });
    });  
  }
  */
   
  savedata()
  {
    const current = new Date();
    this.petsitting.name = this.petsittingname;
    this.petsitting.desc = this.petsittingdesc;
    console.log('this.user' + this.user);
    this.petsitting.user = localStorage.getItem('user');//this.user.uid;
    this.petsitting.timestamp = current.getTime().toString();
    this.petsitting.timestampformat =  this.datePipe.transform(current, 'yyyy-MM-dd HH:mm:ss')
    this.petsitting.lat = this.petsittinglatitude;
    this.petsitting.lng = this.petsittinglongitude;
    this.petsitting.adress = this.petsittingadress;
    this.petsitting.contact = this.petsittingcontact;
    this.petsitting.bild1 = this.bild1_upload;
    this.petsitting.bild2 = this.bild2_upload;
    this.petsitting.bild3 = this.bild3_upload;
    this.petsitting.bild4 = this.bild4_upload;
    this.petsitting.bild5 = this.bild5_upload;
    this.petsitting.mo = this.mo;
    this.petsitting.di = this.di;
    this.petsitting.mi = this.mi;
    this.petsitting.do = this.do;
    this.petsitting.fr = this.fr;
    this.petsitting.sa = this.sa;
    this.petsitting.so = this.so;
    this.petsitting.ratingcounter = '0';
    this.petsitting.commentscounter = '0';
    this.petsitting.datum = this.datePipe.transform(this.datum, 'yyyy-MM-dd');
    this.petsitting.uhrzeit = this.datePipe.transform(this.uhrzeit, 'HH:mm');
    console.log('this.community ' + Object.assign({},this.petsitting));
    this.petsittinglistserviceservice.create(Object.assign({}, this.petsitting));
    this.deletefilesCollection();
    this.router.navigate(['/app/tabs/tabpetsitting']);
  }

  checkadress()
  {

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.forwardGeocode(this.petsittingadress, options)
      .then((result: NativeGeocoderResult[]) => 
        {
          console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude);
          this.petsittinglatitude = result[0].latitude;
          this.petsittinglongitude = result[0].longitude;
        }
      )
      .catch((error: any) => 
      
        {
          console.log(error);
          this.petsittinglatitude = null;
          this.petsittinglongitude = null;
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
      this.petsittinglatitude = resp.coords.latitude;
      this.petsittinglongitude = resp.coords.longitude;
      this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options).then((result: NativeGeocoderResult[]) => 
        {
          console.log('______Adresse________');
          console.log(JSON.stringify(result[0]));
          this.petsittingadress = result[0].thoroughfare + ' ' + result[0].subThoroughfare + ', '+ result[0].postalCode + ' ' + result[0].locality;
        })
        .catch((error: any) => 
        {
          console.log(error);
        }
      );
      
     }).catch((error) => {

       this.petsittinglatitude = 47.16102;
       this.petsittinglongitude = 8.44443;
 
       this.nativeGeocoder.reverseGeocode(this.petsittinglatitude, this.petsittinglongitude , options).then((result: NativeGeocoderResult[]) => 
        {
          console.log('______Adresse________');
          console.log(JSON.stringify(result[0]));
          this.petsittingadress = result[0].thoroughfare + ' ' + result[0].subThoroughfare + ', '+ result[0].postalCode + ' ' + result[0].locality;

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
    this.petsittinglistserviceservice.createFile(image);
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
