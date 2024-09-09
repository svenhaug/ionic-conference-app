import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from "@angular/router";
import { boerselisting, FILE } from '../models/firebase-boerse.model';


@Injectable({
  providedIn: 'root'
})
export class SettingService {

  CollectionRef: any;


  dog_icon: string = 'https://firebasestorage.googleapis.com/v0/b/doggy-a607e.appspot.com/o/perro.png?alt=media&token=b13e5f35-d531-4253-bc9d-9d59df93c1c1';
  avator_icon: string = 'https://www.gravatar.com/avatar?d=mm&s=140';
  global_player_id: string;

  constructor(
  ) { }

}
