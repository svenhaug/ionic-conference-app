import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from "@angular/router";
import { boerselisting, FILE } from '../models/firebase-boerse.model';


@Injectable({
  providedIn: 'root'
})
export class BoerselistserviceService {

  CollectionRef: any;

  constructor(
    private ngFirestore: AngularFirestore,
    private router: Router
  ) { }

  createFile(File: FILE) {
    return this.ngFirestore.collection('filesCollection').add(File);
  }

  create(todo: boerselisting) {
    return this.ngFirestore.collection('boerse').add(todo);
  }

  getTasks() {
    //return this.ngFirestore.collection('community').snapshotChanges();
    this.CollectionRef = this.ngFirestore.collection<boerselisting>('boerse', ref => ref.orderBy('timestamp', 'desc'));
    return this.CollectionRef.snapshotChanges();
  }
  
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

  meinding(id, todo: boerselisting)
  {
    this.ngFirestore.collection('boerse').doc(id).update(todo)
      .then(() => {
        this.router.navigate(['/app/tabs/tabboerse']);
      }).catch(error => console.log(error));
  }

  getTask(id) {
    return this.ngFirestore.collection<boerselisting>('boerse').doc(id).valueChanges();
  }

  update(id, todo: boerselisting) {
    this.ngFirestore.collection('boerse').doc(id).update(todo)
      .then(() => {
        this.router.navigate(['/app/tabs/tabboerse']);
      }).catch(error => console.log(error));
  }

  delete(id: string) {
    this.ngFirestore.collection('boerse').doc(id).delete()
      .then(() =>
      {
        this.router.navigate(['/app/tabs/tabboerse']);
      }).catch(error => console.log(error));
  }
}
