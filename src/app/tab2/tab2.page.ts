import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FuelLog } from '../entity/FuelLogEntity';
import { map, tap} from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private alertController: AlertController, private afs: AngularFirestore, private router: Router) {}

  fuelLog: FuelLog = new FuelLog();
  ionViewDidEnter(){
    this.getFuelLogs().subscribe(records => {
      if (records && records.length > 0){
        records = records.sort((a, b) => (a.date < b.date) ? 1 : -1);
        this.fuelLog.lastOdometer = records[0].odometer;
      }
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
    let totalDistance = (this.fuelLog.odometer && this.fuelLog.lastOdometer) ? Number(this.fuelLog.odometer - this.fuelLog.lastOdometer) : 0;
    let lperkm = this.fuelLog.liter ? Number(this.fuelLog.liter / totalDistance * 100) : 0;
    let totalCost = (this.fuelLog.liter && this.fuelLog.costPerLiters) ? Number(this.fuelLog.liter * this.fuelLog.costPerLiters) : 0
    let stamp = Date.now().toString();
    this.afs.collection('FuelLog').doc(stamp).set({
        cityPercentage: this.fuelLog.cityPercentage ? Number(this.fuelLog.cityPercentage.toFixed(2)) : 0,
        lastOdometer: this.fuelLog.lastOdometer ? Number(this.fuelLog.lastOdometer) : 0,
        date: stamp,
        liter: this.fuelLog.liter ? Number(this.fuelLog.liter) : 0,
        odometer: this.fuelLog.odometer ? Number(this.fuelLog.odometer.toFixed(2)) : 0,
        total: Number(totalCost.toFixed(2)),
        distance: Number(totalDistance.toFixed(2)),
        litersPerHundredKm: Number(lperkm.toFixed(2))
      });
    this.fuelLog = new FuelLog();
    this.router.navigateByUrl('/tabs/tab1');
  }
}
