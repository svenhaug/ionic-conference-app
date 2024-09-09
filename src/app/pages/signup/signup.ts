import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { UserData } from '../../providers/user-data';
import { UserOptions } from '../../interfaces/user-options';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument,} from '@angular/fire/compat/firestore';
import { UserService } from '../../services/user.service';
import { userlisting } from '../../models/firebase-user.model';
import { AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config } from '@ionic/angular';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage {
  signup: UserOptions = { username: '', usermail: '', password: '' };
  submitted = false;
  useradd: userlisting = new userlisting();

  constructor(
    public userData: UserData,
    public router: Router,
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public userservice: UserService,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {}

  async onSignup(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      try {
        const loading = await this.loadingCtrl.create({
          message: `SignUp...`,
          duration: 1000//(Math.random() * 1000) + 500
        });
        await loading.present();
        await loading.onWillDismiss();
        const user = await this.ngFireAuth.createUserWithEmailAndPassword( this.signup.usermail, this.signup.password);
        const usercred = user.user;
        this.useradd.name = this.signup.username;
        this.useradd.email = this.signup.usermail;
        this.useradd.uid = usercred.uid;
        this.useradd.bild1 = '';
        this.userservice.create(Object.assign({}, this.useradd));
        this.storage.set('hasLoggedIn', true);
        this.router.navigateByUrl('/app/tabs/schedule');
        return user;
      } catch (e) {
        const alert = await this.alertCtrl.create({
          header: 'SignUp Fehler',
          message: 'Der User konnte nicht angelegt werden',
          buttons: [
            {
              text: 'ok',
              handler: () => {
                // they clicked the cancel button, do not remove the session
                // close the sliding item and hide the option buttons
                return;
              }
            }
          ]
        });
        // now present the alert on top of all other content
        await alert.present();
      }      
    }
  }
}
