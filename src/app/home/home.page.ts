import { Component, ViewChild } from '@angular/core';

import { ChartDataSets, ChartOptions, ChartPoint, Point } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts'; // ng2-charts is an Angular wrapper around Chart.js library.
import { Subscription } from 'rxjs';

import { DataPoint } from '../model/DataPoint';
import { LinearSpace } from '../model/LinearSpace';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private xAxisMin: number = 0;
  private xAxisMax: number = 10;
  private yAxisMin: number = -5;
  private yAxisMax: number = 5;
  private iNew = 0;
  private iOld = 1;
  private lastTime = 0;
  private time: LinearSpace;
  private updateTime = 0.25;
  private transitionTime = 0.5;


  private interval;  
  //private samplingPeriod: number = 0.2;
  private samplingFreq: number = 1000;
  
  
  private dataPointSubscription$: Subscription;
  private lineWitdh = 2;
  private chartData: ChartDataSets[] = [{ data: [], label: "buffer1", fill: false ,borderWidth: this.lineWitdh},{ data: [], label: "buffer2", fill: false,borderWidth: this.lineWitdh},{ data: [], label: "point", fill: false,pointRadius: 5}];
  private chartLabels = [];
  private chartType = "line"
  private showLegend = false;
  private chartOptions: ChartOptions = {
 
    animation: {
      duration: 0
    },
    elements: {
      point: {
        radius: 0  
      }
    },
    responsive: true,
    scales: {
      xAxes: [{
        type: 'linear',
        ticks: { min: this.xAxisMin, max: this.xAxisMax, stepSize: 1}
      }],
      gridLines: {
        display: true,
        color: 'rgba(255,0,0,0.3)'
      },
      
      
    }
  }
  
  private chartColors: Color[] = [
    {
      borderColor: '#FFFFFF',
      backgroundColor: '#ff00ff'
    },
    {
      borderColor: '#FF0000',
      backgroundColor: '#ff00ff'
    }
  ];
  

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  constructor() {
    this.time = new LinearSpace(this.xAxisMin, 1 / this.samplingFreq, this.xAxisMax*this.samplingFreq);
  }


  ngOnDestroy() {
    this.dataPointSubscription$.unsubscribe();
  }

  start() {
    this.interval = setInterval(() => {
      for (let i = 0; i < (this.samplingFreq*this.updateTime); i++) {
        let t = this.time.getNext();
        let value = Math.sin(2 * Math.PI * 2 * t);
        let point = new DataPoint(t, value);
        this.addNewPoint(point);
      }
      this.chart.update();
         
    },1000*this.updateTime);
  }
  stop() {
    clearInterval(this.interval);
  }


  private swapIndex() {
    let aux = this.iNew;
    this.iNew = this.iOld;
    this.iOld = aux;
  }

  private addNewPoint(point: DataPoint) {
    let p: ChartPoint = {x: point.timestamp, y: point.value};
    this.chartData[2].data = [p];
    if (point.timestamp >= this.lastTime) {
      this.lastTime = point.timestamp;
      (this.chartData[this.iNew].data as  ChartPoint[]).push(p);
      this.chartData[this.iOld].data.shift();
    } else {
      this.chartData[this.iOld].data = [p];
      for (let i = 0; i < (this.transitionTime * this.samplingFreq); i++)
        this.chartData[this.iNew].data.shift();
      this.lastTime = 0; 
      this.swapIndex();      
    }   
  }
}
