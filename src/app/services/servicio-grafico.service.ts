import { Injectable } from '@angular/core';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { DataGrafico } from '../models/data-grafico';

@Injectable({
  providedIn: 'root'
})
export class ServicioGraficoService {

  constructor() {
    this.DataGraficos = [];
   }

  public DataGraficos: DataGrafico[];

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'Series A',
        backgroundColor: 'rgba(148,159,177,0.3)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
      {
        data: [ 28, 48, 40, 19, 86, 27, 90 ],
        label: 'Series B',
        backgroundColor: 'rgba(77,83,96,0.3)',
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)',
        fill: 'origin',
      },
      {
        data: [ 180, 480, 770, 90, 1000, 270, 400 ],
        label: 'Series C',
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
    ],
    labels: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July' ]
  };

  public lineChartOptions:any = {
    responsive: true,
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      y: {
        ticks: {
          color: 'black'
        }
      },
      x: {
        ticks: {
          color: 'black'
        }
      }
    }
  };

  public lineChartLegend:boolean = true;
  public lineChartType: ChartType = 'line';

  public generaGrafico() {
    let rango = this.DataGraficos[0].data.length;
    let indice = 0;
    for(let i = 0; i < this.lineChartData.datasets.length; i++) {
      this.lineChartData.datasets[i].data = this.DataGraficos[i].data;
      this.lineChartData.datasets[i].label = this.DataGraficos[i].label;
      if(rango > this.DataGraficos[i].data.length) {
        rango = this.DataGraficos[i].data.length;
        indice = i;
      }
    }
    this.lineChartData.labels = this.DataGraficos[indice].fechas;
  }
}
