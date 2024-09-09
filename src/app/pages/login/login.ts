import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';
import { AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config } from '@ionic/angular';
import { UserOptionsLogin } from '../../interfaces/user-options';
import { Validators } from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument,} from '@angular/fire/compat/firestore';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})

export class LoginPage {
  login: UserOptionsLogin = { username: '', password: '' };
  submitted = false;

  userDatas: any;

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  constructor(
    public router: Router,
    public menu: MenuController, 
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public storage: Storage,
    private userData: UserData,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) { 


    this.ngFireAuth.authState.subscribe((user) => {
      if (user) {
        this.userDatas = user;
        localStorage.setItem('user', user.uid);
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });

  }

  async onLogin(form: NgForm) {
    this.submitted = true;
    try {
      const loading = await this.loadingCtrl.create({
        message: `login...`,
        duration: 1000//(Math.random() * 1000) + 500
      });
      await loading.present();
      await loading.onWillDismiss();
      const user = await this.ngFireAuth.signInWithEmailAndPassword( this.login.username, this.login.password);
      this.storage.set('hasLoggedIn', true);
      this.userData.login(this.login.username);
      localStorage.setItem('user', user.user.uid);
      this.storage.set('user', user.user.uid);
      this.router.navigateByUrl('/app/tabs/tabcategorie');
      return user;
    } catch (e) {
      const alert = await this.alertCtrl.create({
        header: 'Login Fehler',
        message: 'User oder PW falsch',
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

  onSignup() {
    this.router.navigateByUrl('/signup');
  }


}
