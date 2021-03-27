import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FuelLog } from '../entity/FuelLogEntity';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private afs: AngularFirestore, private alertController: AlertController) {}
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

  async removeLogAlert(timeStamp: number){
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'FuelLog will be deleted! This cannot be undone!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, 
        {
          text: 'Okay',
          handler: () => {
              this.removeFuelLog(timeStamp);
          }
        }
      ]
    });

    await alert.present();
  }

  removeFuelLog(timeStamp: number){
  this.afs.collection("FuelLog").doc(timeStamp.toString()).delete().then(() => {
    console.log(timeStamp)
    console.log(timeStamp.toString())

    console.log("Document successfully deleted!");
  }).catch((error) => {
    console.error("Error removing document: ", error);
  });
  }
}
