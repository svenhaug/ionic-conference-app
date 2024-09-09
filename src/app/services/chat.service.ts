import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from "@angular/router";
import { chatlisting, FILE } from '../models/firebase-chat.model';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  CollectionRef: any;
  jobsCollection : AngularFirestoreCollection<chatlisting>;
  data: chatlisting = new chatlisting();

  constructor(
    private ngFirestore: AngularFirestore,
    private router: Router
  ) { }

  deletefilesCollection()
  {
    this.ngFirestore.collection<FILE>('filesCollection', ref => ref.where('chat', '==' , localStorage.getItem('chat'))).get().subscribe((querySnapshot) => 
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

  create(todo: chatlisting) {
    return this.ngFirestore.collection('chats').add(todo);
  }

  getChats() {
    return this.ngFirestore.collection('chats').snapshotChanges();
  }

  getChat(id) {
    return this.ngFirestore.collection<chatlisting>('chats').doc(id).valueChanges();
  }

  getChatdata(id) {
    return this.ngFirestore.collection<chatlisting>('chats', ref =>ref.where('from_id', '==' , id).orderBy('timestamp', 'asc')).valueChanges();
  }

  async getChatdataid(uid) {
    console.log('uid: ' + uid);
    this.jobsCollection = this.ngFirestore.collection('chats', ref => {
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


  getChatbyuid(uid) {
    console.log('uid: ' + uid);
    this.jobsCollection = this.ngFirestore.collection('chats', ref => {
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


  update(id, todo: chatlisting) {
    this.ngFirestore.collection('chats').doc(id).update(todo)
      .then(() => {
        //this.router.navigate(['/categorieslist']);
      }).catch(error => console.log(error));
  }

  updateuid(uid, todo: chatlisting) {
 
    console.log('todo: ' + todo);
    console.log('uid: ' + uid);

    this.ngFirestore.collection<chatlisting>('chats', ref =>ref.where('uid', '==' , uid)).get().forEach(response => {
      response.docs.forEach((doc) => {
          this.ngFirestore.collection('chats').doc(doc.id).update(todo);
      })
    })
  }

  delete(uid: string) {
    this.ngFirestore.collection('chats', ref =>ref.where('uid', '==' , uid)).doc().delete()
      .then(() =>
      {
        //this.router.navigate(['/categorieslist']);
      }).catch(error => console.log(error));
  }
}
