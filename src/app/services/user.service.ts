import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from "@angular/router";
import { userlisting, FILE } from '../models/firebase-user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  CollectionRef: any;
  jobsCollection : AngularFirestoreCollection<userlisting>;
  data: userlisting = new userlisting();

  constructor(
    private ngFirestore: AngularFirestore,
    private router: Router
  ) { }

  deletefilesCollection()
  {
    this.ngFirestore.collection<FILE>('filesCollection', ref => ref.where('user', '==' , localStorage.getItem('user'))).get().subscribe((querySnapshot) => 
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

  createFile(File: FILE) {
    return this.ngFirestore.collection('filesCollection').add(File);
  }

  create(todo: userlisting) {
    return this.ngFirestore.collection('users').add(todo);
  }

  getUsers() {
    return this.ngFirestore.collection('users').snapshotChanges();
  }

  getUser(id) {
    return this.ngFirestore.collection<userlisting>('users').doc(id).valueChanges();
  }

  getUserBild(id) {
    return this.ngFirestore.collection<userlisting>('users', ref =>ref.where('uid', '==' , id)).valueChanges();
  }

  getUserdata(id) {
    return this.ngFirestore.collection<userlisting>('users', ref =>ref.where('uid', '==' , id)).valueChanges();
  }

  async getUserdataid(uid) {
    console.log('uid: ' + uid);
    this.jobsCollection = this.ngFirestore.collection('users', ref => {
      return ref.where('uid', '==',uid);
    });

    this.jobsCollection.snapshotChanges().forEach(changes=>{
      return changes.map(a=>{
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data}
      })
    })

  }

  update_player_id(id, playerid) {
    if (id)
    {
      if (playerid)
      {
        this.ngFirestore.collection<userlisting>('users', ref =>ref.where('uid', '==' , id)).get().forEach(response => {
          response.docs.forEach((doc) => {
              this.ngFirestore.collection('users').doc(doc.id).update({'player_id': playerid});
          })
        })    
      }
    }
  }

  getUserbyuid(uid) {
    console.log('uid: ' + uid);
    this.jobsCollection = this.ngFirestore.collection('users', ref => {
      return ref.where('uid', '==',uid);
    });

    this.jobsCollection.snapshotChanges().forEach(changes=>{
      return changes.map(a=>{
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data}
      })
    })

  }

  update(id, todo: userlisting) {
    this.ngFirestore.collection('users').doc(id).update(todo)
      .then(() => {
        //this.router.navigate(['/categorieslist']);
      }).catch(error => console.log(error));
  }

  updateuid(uid, todo: userlisting) {
    this.ngFirestore.collection<userlisting>('users', ref =>ref.where('uid', '==' , uid)).get().forEach(response => {
      response.docs.forEach((doc) => {
          this.ngFirestore.collection('users').doc(doc.id).update(todo);
      })
    })
  }

  updateuserpicture(id, avatar) {
    if (id)
    {
      this.ngFirestore.collection<userlisting>('users', ref =>ref.where('uid', '==' , id)).get().forEach(response => {
        response.docs.forEach((doc) => {
            this.ngFirestore.collection('users').doc(doc.id).update({'bild1': avatar});
        })
      })    
    }
  }

  delete(uid: string) {
    this.ngFirestore.collection('users', ref =>ref.where('uid', '==' , uid)).doc().delete()
      .then(() =>
      {
        //this.router.navigate(['/categorieslist']);
      }).catch(error => console.log(error));
  }
}
