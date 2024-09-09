import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from "@angular/router";
import { petsittinglisting, FILE } from '../models/firebase-petsitting.model';


@Injectable({
  providedIn: 'root'
})
export class PetsittinglistserviceService {

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
    this.ngFirestore.collection('petsitting').doc(id).update({ratingcounter: coutner})
    .then(() => {
      this.router.navigate(['/app/tabs/tabpetsitting']);
    }).catch(error => console.log(error));
  }


  createFile(File: FILE) {
    return this.ngFirestore.collection('filesCollection').add(File);
  }

  create(todo: petsittinglisting) {
    return this.ngFirestore.collection('petsitting').add(todo);
  }

  getTasks() {
    //return this.ngFirestore.collection('community').snapshotChanges();
    this.CollectionRef = this.ngFirestore.collection<petsittinglisting>('petsitting', ref => ref.orderBy('timestamp', 'desc'));
    return this.CollectionRef.snapshotChanges();
  }

  getTaskComments(id) {
    this.CollectionRef = this.ngFirestore.collection<petsittinglisting>('petsitting').doc(id);
    return this.CollectionRef.valueChanges('comments', ref => ref.orderBy('timestamporder', 'desc'));
  }
  
  getTask(id) {
    return this.ngFirestore.collection<petsittinglisting>('petsitting').doc(id).valueChanges();
  }

  update(id, todo: petsittinglisting) {
    this.ngFirestore.collection('petsitting').doc(id).update(todo)
      .then(() => {
        this.router.navigate(['/app/tabs/tabpetsitting']);
      }).catch(error => console.log(error));
  }

  delete(id: string) {
    this.ngFirestore.collection('petsitting').doc(id).delete()
      .then(() =>
      {
        this.router.navigate(['/app/tabs/tabpetsitting']);
      }).catch(error => console.log(error));
  }
}
