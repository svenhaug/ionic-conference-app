import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from "@angular/router";
import { communitylisting, communitylistingfilter, FILE, comments } from '../models/firebase-community.model';
import { UserService } from './user.service'
import { userlisting } from '../models/firebase-user.model';
import { Observable, combineLatest, of } from 'rxjs'
import { map, switchMap, first } from 'rxjs/operators'
import { uniq, flatten } from 'lodash'
import { where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CommunitylistserviceService {

  CollectionRef: any;
  CollectionRefFiltered: any;
  CollectionRefComments: Array<comments> = [];
  CollectionRefFilteredArray: Array<communitylistingfilter> = [];
  CollectionRefUsers: any;
  community: any;
  fcounter: any;
  fcounternumber: number;
  joined: any;
  userreturnarray: any = [];
  showdata: any[];

  insert_fun: boolean = false;
  insert_find_friends: boolean = false;
  insert_geschichten: boolean = false;
  insert_pics: boolean = false;

  insert_desk_lat_lng: boolean = false;
  new_lng_from: any;
  new_lng_to: any;
  new_lat_from: any;
  new_lat_to: any;
  includeTracks: any = [];

  orderby: AngularFirestoreCollection<communitylisting>;

  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;

  constructor(
    private ngFirestore: AngularFirestore,
    public db: AngularFirestore, 
    private router: Router,
    private userservice: UserService,
  ) { }

  deletefilesCollection()
  {
    this.ngFirestore.collection<FILE>('filesCollection', ref => ref.where('user', '==' , localStorage.getItem('user'))).get().subscribe((querySnapshot) => 
    {
      querySnapshot.forEach((doc) => 
      {
        doc.ref.delete().then(() => {
          //console.log('deleted')

        }).catch(function (error) {
          //console.log('FEHLER')
        })
      })
    });
  }

  updateratingcounter(id, coutner)
  {
    this.ngFirestore.collection('community').doc(id).update({ratingcounter: coutner})
    .then(() => {
      this.router.navigate(['/app/tabs/tabcategorie']);
    }).catch(error => console.log(error));
  }

  updatecommentcounter(id, coutner)
  {
    this.ngFirestore.collection('community').doc(id).update({commentscounter: coutner})
    .then(() => {
      this.router.navigate(['/app/tabs/tabcategorie']);
    }).catch(error => console.log(error));
  }

  createFile(File: FILE) {
    return this.ngFirestore.collection('filesCollection').add(File);
  }

  create(todo: communitylisting) {
    return this.ngFirestore.collection('community').add(todo);
  }

  getTasks() {
    //return this.ngFirestore.collection('alert').snapshotChanges();
    this.CollectionRef = this.ngFirestore.collection<communitylisting>('community', ref => ref.orderBy('timestamp', 'desc'));
    return this.CollectionRef.snapshotChanges();

  }

  getTasksFiltered(lat_from, lat_to, lng_from, lng_to, what) {
    this.CollectionRef = this.ngFirestore.collection<communitylisting>('community', ref => ref.orderBy('timestamp', 'desc'));

    this.new_lat_from = lat_from;
    this.new_lat_to = lat_to;
    this.new_lng_from = lng_from; 
    this.new_lng_to = lng_to; 

    this.includeTracks = what;

    console.log('lat_from');
    console.log(lat_from);
    console.log('lat_to');
    console.log(lat_to);
    console.log('lng_from');
    console.log(lng_from);
    console.log('lng_to');
    console.log(lng_to);
    console.log('what');
    console.log(what);

    return this.CollectionRef.snapshotChanges().forEach(element => {
      element.map(t => 
        {

          let data;
          let id;

          console.log('t');
          console.log(t);

          this.showdata.push(t.payload.doc.data());
          console.log('payload Data: ' +  JSON.stringify(t.payload.doc.data()));
          data = t.payload.doc.data();
          id = t.payload.doc.id; 

          return { id, ...data };
        }

      )
    });

    //return this.CollectionRef.snapshotChanges();
    /*
    return this.CollectionRef.snapshotChanges().forEach(t => {
        
          console.log('t-data');
          console.log(t.payload);
  
          this.insert_desk_lat_lng = false;
          this.insert_find_friends = false;
          this.insert_fun = false;
          this.insert_geschichten = false;
          this.insert_pics = false;
  
          let data;
          let id;
      
          if (+t.payload.doc.data().lng.toString() <= +this.new_lng_from)  
          {
            if (+t.payload.doc.data().lng.toString() >= +this.new_lng_to)
            { 
              if (+t.payload.doc.data().lat.toString() <= +this.new_lat_from)             
              {
                if (+t.payload.doc.data().lat.toString() >= +this.new_lat_to)             
                {
                  this.insert_desk_lat_lng = true;
                }
              }                    
            }       
          } 
  
          if (this.includeTracks.indexOf("Fun") > -1)
          {
            if (t.payload.doc.data().kat.toString() == 'Fun')
            {
              this.insert_fun = true;
            }
            else
            {
              this.insert_fun = false;
            }
          }
  
          if (this.includeTracks.indexOf("Freunde finden") > -1)
          {
            if (t.payload.doc.data().kat.toString() == 'Freunde finden')
            {
              this.insert_find_friends = true;
            }
            else
            {
              this.insert_find_friends = false;
            }
          }
  
          if (this.includeTracks.indexOf("Geschichten") > -1)
          {
            if (t.payload.doc.data().kat.toString() == 'Geschichten')
            {
              this.insert_geschichten = true;
            }
            else
            {
              this.insert_geschichten = false;
            }
          }
  
          if (this.includeTracks.indexOf("Pics") > -1)
          {
            if (t.payload.doc.data().kat.toString() == 'Pics')
            {
              this.insert_pics = true;
            }
            else
            {
              this.insert_pics = false;
            }
          }
  
          console.log(this.includeTracks.indexOf("Fun"));
          console.log(this.includeTracks.indexOf("Freunde finden"));
          console.log(this.includeTracks.indexOf("Geschichten"));
          console.log(this.includeTracks.indexOf("Pics"));
          console.log(t.payload.doc.data().kat.toString());
  
          console.log(this.insert_geschichten)
          console.log(this.insert_find_friends)
          console.log(this.insert_fun)
          console.log(this.insert_pics)
  
          console.log(this.insert_desk_lat_lng)
          console.log(this.includeTracks)
          console.log('t-data');
          console.log(t);
  
          if(
            (this.insert_desk_lat_lng == true)
            && 
            ( this.insert_find_friends === true ||
              this.insert_fun === true ||
              this.insert_geschichten  === true ||
              this.insert_pics === true
            )
          )
          {
            if (JSON.stringify(this.showdata).indexOf(JSON.stringify(t.payload.doc.id)) == -1)
            {
              this.showdata.push(t.payload.doc.data());
              console.log('payload Data: ' +  JSON.stringify(t.payload.doc.data()));
              data = t.payload.doc.data();
              id = t.payload.doc.id; 
            }
            return { id, ...data };
          }
        })
      */      
  }

  getTasksComments(id) {
    const visitArray = this.ngFirestore.collection('community').doc(id).collection('comments').snapshotChanges();
     visitArray.subscribe(payload => {
      const returner =  payload.length;
      return returner;
    });
    
  }

  getTask(id) {
    return this.ngFirestore.collection<communitylisting>('community').doc(id).valueChanges();
  }

  getTaskComments(id) {
    this.CollectionRef = this.ngFirestore.collection<communitylisting>('community').doc(id);
    console.log('_______________');
    this.CollectionRefComments = this.CollectionRef.valueChanges('comments', ref => ref.orderBy('timestamporder', 'desc'))
    console.log(this.ngFirestore.collection<communitylisting>('community').doc(id));
    return this.CollectionRef.valueChanges('comments', ref => ref.orderBy('timestamporder', 'desc'));
  }

  async getTaskCommentswithUserData(id)
  {
    this.userreturnarray = [];
    const visitArray = this.ngFirestore.collection('community').doc(id).valueChanges();
    /*
    await visitArray.forEach(element => 
      {

        console.log(element)


        element['comments'].forEach(commentsarray =>
        
          {
            //const userarray = this.ngFirestore.collection('users').doc(commentsarray.user).valueChanges();
            const userarray = this.userservice.getUserdata(commentsarray.user);
            userarray.forEach(user => 
              {
                this.userreturnarray.push(
                  {
                    comment: commentsarray.comment, 
                    timestamp: commentsarray.timestamp, 
                    avatar: user[0].bild1,
                    user: user[0].uid, 
                    username: user[0].name, 
                  }
                ); 
                console.log('userreturnarray');
                console.log(this.userreturnarray)   
              }
            )
          } 
        )


        return this.userreturnarray

      }
    )
    */

  }

  update(id, todo: communitylisting) {
    this.ngFirestore.collection('community').doc(id).update(todo)
      .then(() => {
        this.router.navigate(['/app/tabs/tabcategorie']);
      }).catch(error => console.log(error));
  }

  delete(id: string) {
    this.ngFirestore.collection('community').doc(id).delete()
      .then(() =>
      {
        this.router.navigate(['/app/tabs/tabcategorie']);
      }).catch(error => console.log(error));
  }
}
