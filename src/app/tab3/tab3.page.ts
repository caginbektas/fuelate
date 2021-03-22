import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FuelLog } from '../entity/FuelLogEntity';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private afs: AngularFirestore) {}
  fuelLogs: FuelLog[] = [];

  getFuelLogs(){
    return this.afs.collection('FuelLog').valueChanges().pipe() as Observable<FuelLog[]>
  }

  ionViewDidEnter(){
    this.getFuelLogs().subscribe(records => {
      if (records && records.length > 0){
        this.fuelLogs = records.sort((a, b) => (a.date < b.date) ? 1 : -1);
      }
    });
  }
}
