import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from "@angular/router";
import { dogwalklisting, FILE } from '../models/firebase-dogwalk.model';


@Injectable({
  providedIn: 'root'
})
export class DogwalklistserviceService {

  CollectionRef: any;

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

  updateratingcounter(id, coutner)
  {
    this.ngFirestore.collection('dogwalk').doc(id).update({ratingcounter: coutner})
    .then(() => {
      this.router.navigate(['/app/tabs/tabdogwalk']);
    }).catch(error => console.log(error));
  }

  createFile(File: FILE) {
    return this.ngFirestore.collection('filesCollection').add(File);
  }

  create(todo: dogwalklisting) {
    return this.ngFirestore.collection('dogwalk').add(todo);
  }

  getTasks() {
    //return this.ngFirestore.collection('community').snapshotChanges();
    this.CollectionRef = this.ngFirestore.collection<dogwalklisting>('dogwalk', ref => ref.orderBy('timestamp', 'desc'));
    return this.CollectionRef.snapshotChanges();
  }

  getTaskComments(id) {
    this.CollectionRef = this.ngFirestore.collection<dogwalklisting>('dogwalk').doc(id);
    return this.CollectionRef.valueChanges('comments', ref => ref.orderBy('timestamporder', 'desc'));
  }
  
  getTask(id) {
    return this.ngFirestore.collection<dogwalklisting>('dogwalk').doc(id).valueChanges();
  }

  update(id, todo: dogwalklisting) {
    this.ngFirestore.collection('dogwalk').doc(id).update(todo)
      .then(() => {
        this.router.navigate(['/app/tabs/tabdogwalk']);
      }).catch(error => console.log(error));
  }

  delete(id: string) {
    this.ngFirestore.collection('dogwalk').doc(id).delete()
      .then(() =>
      {
        this.router.navigate(['/app/tabs/tabdogwalk']);
      }).catch(error => console.log(error));
  }
}
