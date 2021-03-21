import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FuelLog } from '../entity/FuelLogEntity';
import { map, tap} from 'rxjs/operators';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private alertController: AlertController, private afs: AngularFirestore) {}

  fuelLog: FuelLog = new FuelLog();
  ionViewDidEnter(){
    this.getFuelLogs().subscribe(records => {
      if (records && records.length > 0)
        this.fuelLog.lastOdometer = records[0].odometer;
    });
  }
 
  getFuelLogs(){
    return this.afs.collection('FuelLog').valueChanges().pipe() as Observable<FuelLog[]>
    }
  
  async saveAlert(){
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'FuelLog will be added!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, 
        {
          text: 'Okay',
          handler: () => {
              this.saveFuelLog();
          }
        }
      ]
    });

    await alert.present();
  }

  async saveFuelLog(){
    debugger;
    this.afs.collection('FuelLog').add({
        cityPercentage: this.fuelLog.cityPercentage ? this.fuelLog.cityPercentage : 0,
        costPerLiters: this.fuelLog.costPerLiters,
        lastOdometer: this.fuelLog.lastOdometer ? this.fuelLog.lastOdometer : 0,
        date: Date.now(),
        liter: this.fuelLog.liter,
        odometer: this.fuelLog.odometer,
        total: this.fuelLog.liter*this.fuelLog.costPerLiters
      });
    this.fuelLog = new FuelLog();
  }

}
