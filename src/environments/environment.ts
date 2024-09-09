// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAFEVpRp2m6dcytBUe9ELlcXU91H4amGqM",
    authDomain: "doggy-a607e.firebaseapp.com",
    databaseURL: "https://doggy-a607e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "doggy-a607e",
    storageBucket: "doggy-a607e.appspot.com",
    messagingSenderId: "712396398544",
    appId: "1:712396398544:web:37da45797ffc210e8423d5",
    measurementId: "G-TJN0CMF345"
  },
  appShellConfig: {
    debug: false,
    networkDelay: 500
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
