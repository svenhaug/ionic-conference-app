import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from '../../providers/user-data';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { FILE } from '../../models/firebase-alert.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { UserService } from '../../services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { userlisting } from '../../models/firebase-user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage implements AfterViewInit {

  alertname: any;
  alertdesc: any;
  alertadress: any;
  alertlongitude: any;
  alertlatitude: any;
  user: any;
  uid: any;
  useremail: any;
  username: string;
  usertel: string;
  userpw: string;
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
  userId: any;
  //userdata: Array<String[]>;
  userdata: any;
  usermodel: userlisting = new userlisting();
  showdata: any[];

  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;

  constructor(
    public alertCtrl: AlertController,
    public router: Router,
    public userData: UserData,
    private angularFireStorage: AngularFireStorage,
    public alertController: AlertController,
    private angularFirestore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    private userservice: UserService
  ) { }


  ngAfterViewInit() {
    this.getUsername();
  }


  ionViewDidEnter()
  {
    this.getdata();
  }

  getdata()
  {
    this.userservice.getUserdata(localStorage.getItem('user')).subscribe( userinfo => {
      this.userdata = userinfo;
      this.username = this.userdata[0].name;
      this.useremail = this.userdata[0].email;
      this.usertel = this.userdata[0].tel;
      this.uid = this.userdata[0].uid;
      this.bild1_upload = this.userdata[0].bild1;
      this.userId = this.userdata[0].id;      
    });
  }


  updatePicture() {
    console.log('Clicked to update picture');
  }


  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  async changeUsername() {
    const alert = await this.alertCtrl.create({
      header: 'Username ändern',
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            this.userData.setUsername(data.username);
            this.username = data.username;
            this.savedata();
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'username',
          value: this.username,
          placeholder: 'username'
        }
      ]
    });
    await alert.present();
  }

  getUsername() {
    this.userData.getUsername().then((username) => {
      //this.username = username;
    });
  }

  updatepw()
  {

  }

  async changePassword() {
    const alert = await this.alertCtrl.create({
      header: 'Passwort ändern',
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            this.userData.setUsername(data.userpw);
            this.userpw = data.userpw;
            this.updatepw();
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'userpw',
          value: this.userpw,
          placeholder: 'pw'
        }
      ]
    });
    await alert.present();
  }

  async changeTel() {
    const alert = await this.alertCtrl.create({
      header: 'Telfonnr. ändern',
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            this.userData.setUsername(data.usertel);
            this.usertel = data.usertel;
            this.savedata();
          }
        }
      ],
      inputs: [
        {
          type: 'tel',
          name: 'usertel',
          value: this.usertel,
          placeholder: 'Telnr'
        }
      ]
    });
    await alert.present();
  }


  logout() {
    this.userData.logout();
    this.router.navigateByUrl('/login');
  }

  support() {
    this.router.navigateByUrl('/support');
  }


  fileUpload(event: FileList) {
      
    const file = event.item(0)

    if(this.filecounter >= 1)
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
    this.getUsername();

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

          //this.userservice.updateuserpicture(this.userId, this.fileUploadedPath);
          //this.getcurrentfilelist();
          
        },error => {
          console.log(error);
        })

      }
      )
    )
    .subscribe();
  }


  ionViewWillLeave(): void {
    this.userservice.deletefilesCollection();
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
    this.userservice.createFile(image);   
    console.log('image.filepath ' + image.filepath);
    console.log('image.user ' + image.user);
    this.userservice.updateuserpicture(image.user, image.filepath);
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


  savedata()
  {
    this.usermodel.name = this.username;
    this.usermodel.email = this.useremail;
    this.usermodel.tel = this.usertel;
    this.usermodel.uid = this.uid;
    this.usermodel.bild1 = this.bild1_upload;
    this.userservice.updateuid(this.usermodel.uid, Object.assign({}, this.usermodel));
    this.deletefilesCollection();
  }


  getcurrentfilelist()
  {

    this.ngFirestoreCollection = this.angularFirestore.collection<FILE>('filesCollection', ref => ref.where('user', '==' , localStorage.getItem('user')).orderBy('timestamp', 'desc'));
    this.files = this.ngFirestoreCollection.valueChanges();

    this.bild1_upload = '';
    this.files.subscribe(filelist => 
      {
        this.filecounter = 0;
        this.filelisting = filelist;
        this.filelisting.forEach(filecheck => {
          console.log(filecheck);
          this.filecounter++;
        });
        console.log('this.filecounter ' + this.filecounter);
        for (let index = 0; index < this.filecounter; index++) 
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
        this.savedata();
        console.log('this.bild1_upload ' + this.bild1_upload);
      }
    )

  }

}
