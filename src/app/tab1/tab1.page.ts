import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FuelLog } from '../entity/FuelLogEntity';
import { Statistics } from '../entity/Statistics';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private afs: AngularFirestore) {}
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;

  doughnutChart: any;
  lineChart: any;

  fuelLogs: FuelLog[] = [];
  statistics: Statistics = new Statistics();

  ionViewDidEnter(){
    this.getFuelLogs().subscribe(records => {
      if (records && records.length > 1){
        this.fuelLogs = records.sort((a, b) => (a.date > b.date) ? 1 : -1);
        this.fuelLogs = this.fuelLogs.slice(1, this.fuelLogs.length);

        this.statistics.totalKM = this.getTotalKM().toFixed(0);
        this.statistics.avgLPerHundredKm = this.getavgLPerHundredKm().toFixed(1);
        this.statistics.lastLPerHundredKm = this.getLastLPerHundredKm().toFixed(1);
        this.statistics.bestLPerHundredKm = this.getBestLPerHundredKm().toFixed(1);
        this.statistics.totalFuelCost = this.getTotalFuelCost().toFixed(0);
        this.statistics.totalLiters = this.getTotalLiters().toFixed(0);
        this.statistics.avgCityDrive = this.getAvgCityDrive();
        this.statistics.fuelEfficiency = this.fuelLogs.sort((a, b) => (a.date > b.date) ? 1 : -1).map(a => a.litersPerHundredKm);

        this.doughnutChartMethod();
        this.lineChartMethod();

      }
    });
  }
 
  getFuelLogs(){
    return this.afs.collection('FuelLog').valueChanges().pipe() as Observable<FuelLog[]>
    }

  getTotalKM(){
    return this.fuelLogs.reduce( function(a, b){
      return a + b['distance'];
    }, 0);
  }
  getavgLPerHundredKm(){
    let totalLPerHundredKm = this.fuelLogs.reduce( function(a, b){
      return a + b['litersPerHundredKm'];
    }, 0);
    return totalLPerHundredKm/this.fuelLogs.length;
  }
  getLastLPerHundredKm(){
    return this.fuelLogs[this.fuelLogs.length-1].litersPerHundredKm;
  }
  getBestLPerHundredKm(): number{
    return this.fuelLogs.sort((a, b) => (a.litersPerHundredKm > b.litersPerHundredKm) ? 1 : -1)[0].litersPerHundredKm;
  }
  getTotalFuelCost(){
    return this.fuelLogs.reduce( function(a, b){
      return a + b['total'];
    }, 0);
  }
  getAvgCityDrive(){
    let totalCityDrive = this.fuelLogs.reduce( function(a, b){
      return a + b['cityPercentage'];
    }, 0);
    return totalCityDrive/this.fuelLogs.length;
  }
  getTotalLiters(){
    return this.fuelLogs.reduce( function(a, b){
      return a + b['liter'];
    }, 0);
  }
  doughnutChartMethod() {
    let hwDrive = 100-this.statistics.avgCityDrive;
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['City', 'Highway'],
        datasets: [{
          label: '',
          data: [this.statistics.avgCityDrive, hwDrive],
          backgroundColor: [
            '#FFCE56',
            '#FF6384'
          ],
          hoverBackgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)'
          ]
        }]
      }
    });
  }
  lineChartMethod() {
    let labels = Array(this.statistics.fuelEfficiency.length).fill('.')
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'l/100km',
            fill: true,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,           
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.statistics.fuelEfficiency,
            spanGaps: false,
          }
        ]
      }
    });
  }
}
