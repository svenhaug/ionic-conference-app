import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { MenuController, Platform, ToastController } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Storage } from '@ionic/storage';
import { UserData } from './providers/user-data';
import { PositionServiceService } from './services/position-service.service';
import { OnesignalService } from './services/onesignal.service';
import OneSignal from 'onesignal-cordova-plugin';
import { UserService } from './services/user.service';
import { SettingService } from './services/setting.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: 'Community',
      url: '/app/tabs/tabcategorie',
      icon: 'people'
    },
    {
      title: 'Dogwalk',
      url: '/app/tabs/tabdogwalk',
      icon: 'paw'
    },
    /*
    {
      title: 'Börse',
      url: '/app/tabs/tabboerse',
      icon: 'bag'
    },
    */
    {
      title: 'Petsitting',
      url: '/app/tabs/tabpetsitting',
      icon: 'time'
    },
    {
      title: 'Alarme',
      url: '/app/tabs/tabalert',
      icon: 'alert'
    },
    {
      title: 'About',
      url: '/app/tabs/about',
      icon: 'information-circle'
    },
    {
      title: 'My Doggy',
      url: '/app/tabs/taboverview',
      icon: 'cog'
    }
    /*,
    {
      title: 'Schedule',
      url: '/app/tabs/schedule',
      icon: 'calendar'
    },
    {
      title: 'Speakers',
      url: '/app/tabs/speakers',
      icon: 'people'
    },
    {
      title: 'Map',
      url: '/app/tabs/map',
      icon: 'map'
    }
    */
  ];
  loggedIn = false;
  dark = false;
  player_id: string = "";
  userinfo: any;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private storage: Storage,
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private posservice: PositionServiceService,
    private onesignalservice: OnesignalService,
    private userservice: UserService,
    public ngFireAuth: AngularFireAuth,
    public settingservice: SettingService,
  ) {
    this.initializeApp();
  }



  async ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();
    //this.posservice.getpos();
    this.posservice.setvaribales();

    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        position: 'bottom',
        buttons: [
          {
            role: 'cancel',
            text: 'Reload'
          }
        ]
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
  }
  
 async OneSignalInit()
  {
    
    OneSignal.setLogLevel(0, 0);

    OneSignal.setAppId("c087723e-61ca-4cfa-a7c1-f752056dc14f");
    
    OneSignal.setNotificationOpenedHandler(function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    });

    OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
        console.log("User accepted notifications: " + accepted);
    });

    await window.plugins.OneSignal
      .addSubscriptionObserver(function(state){
      var datos = JSON.stringify(state);
      var valor = JSON.parse(datos); 
      const data = JSON.parse(datos)['to'];
      var playerId = valor.to.userId;
      console.log( playerId + ' *_IF_**PLAYER ID***' );
      console.log( data['userId'] + ' *data[userId] ID***' );
      this.player_id = data['userId'];
      localStorage.setItem('player_id', this.player_id);
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('hybrid')) {
        StatusBar.hide();
        SplashScreen.hide();
      }

      this.OneSignalInit();

      //this.posservice.getpos();
      this.posservice.setvaribales();

      this.storage.get('ion_did_tutorial').then(tutorial_checker => 
      {
        console.log('ion_did_tutorial ' + tutorial_checker);
        if (tutorial_checker)
        {
          this.storage.get('hasLoggedIn').then(loggedin => 
            {
              console.log('hasLoggedIn ' + loggedin);
            if (loggedin)
            {
              this.router.navigateByUrl('/app/tabs/tabcategorie');
            }
            else
            {
              this.router.navigateByUrl('/login');
            }
            }
          )
        }
        else
        {
          this.router.navigateByUrl('/tutorial');
        }
      }).catch(no_match =>
        {
          this.storage.get('hasLoggedIn').then(loggedin => 
            {
            if (loggedin)
            {
              this.router.navigateByUrl('/app/tabs/tabcategorie');
            }
            else
            {
              this.router.navigateByUrl('/login');
            }
          })
        }
      )
    });
  }

  checkLoginStatus() {
    return this.userData.isLoggedIn().then(loggedIn => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:signup', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
  }

  logout() {
    this.userData.logout().then(() => {
      //return this.router.navigateByUrl('/app/tabs/schedule');
      return this.router.navigateByUrl('/login');
    });
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl('/tutorial');
  }
}
