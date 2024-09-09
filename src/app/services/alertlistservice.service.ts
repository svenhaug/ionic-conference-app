import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from "@angular/router";
import { alertlisting, FILE } from '../models/firebase-alert.model';

@Injectable({
  providedIn: 'root'
})
export class AlertlistserviceService {

  CollectionRef: any;
  alert: any;
  fcounter: any;
  fcounternumber: number;

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

  getTaskComments(id) {
    this.CollectionRef = this.ngFirestore.collection<alertlisting>('alert').doc(id);
    return this.CollectionRef.valueChanges('comments', ref => ref.orderBy('timestamporder', 'desc'));
  }

  updateratingcounter(id, coutner)
  {
    
    this.ngFirestore.collection('alert').doc(id).update({ratingcounter: coutner})
    .then(() => {
      this.router.navigate(['/app/tabs/tabalert']);
    }).catch(error => console.log(error));

  }

  updatecommentcounter(id, coutner)
  {
    
    this.ngFirestore.collection('alert').doc(id).update({commentscounter: coutner})
    .then(() => {
      this.router.navigate(['/app/tabs/tabalert']);
    }).catch(error => console.log(error));

  }

  createFile(File: FILE) {
    return this.ngFirestore.collection('filesCollection').add(File);
  }

  create(todo: alertlisting) {
    return this.ngFirestore.collection('alert').add(todo);
  }

  getTasks() {
    //return this.ngFirestore.collection('alert').snapshotChanges();
    this.CollectionRef = this.ngFirestore.collection<alertlisting>('alert', ref => ref.orderBy('timestamp', 'desc'));
    return this.CollectionRef.snapshotChanges();

  }
  
  getTask(id) {
    return this.ngFirestore.collection<alertlisting>('alert').doc(id).valueChanges();
  }

  update(id, todo: alertlisting) {
    this.ngFirestore.collection('alert').doc(id).update(todo)
      .then(() => {
        this.router.navigate(['/app/tabs/tabalert']);
      }).catch(error => console.log(error));
  }

  delete(id: string) {
    this.ngFirestore.collection('alert').doc(id).delete()
      .then(() =>
      {
        this.router.navigate(['/app/tabs/tabalert']);
      }).catch(error => console.log(error));
  }
}
