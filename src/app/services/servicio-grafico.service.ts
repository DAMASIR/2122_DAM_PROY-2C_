import { Injectable } from '@angular/core';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { DataGrafico } from '../models/data-grafico';
import { HttpServicioService } from './http-servicio.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioGraficoService {

  public DataGraficos: DataGrafico[];
  public checkeds = 0;
  public grafico: DataGrafico;
  
  public pagina = 2;
  public paginarDatos = true;
  public fechasSeleccionada: string[];
  public valoresSeleccionada: number[];

  constructor(public httpServicio: HttpServicioService) {
    this.DataGraficos = [];
    this.fechasSeleccionada = [];
    this.valoresSeleccionada = [];
   }

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'Series A',
        backgroundColor: 'rgba(48,159,177,0.4)',
        borderColor: 'rgba(48,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
      {
        data: [ 28, 48, 40, 19, 86, 27, 90 ],
        label: 'Series B',
        backgroundColor: 'rgba(205, 81, 0, 0.4)',
        borderColor: 'rgba(90, 80, 0)',
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
    for(let i = 0; i < this.lineChartData.datasets.length; i++) {
      this.lineChartData.datasets[i].data = this.DataGraficos[i].data;
      this.lineChartData.datasets[i].label = this.DataGraficos[i].label;
    }
    this.lineChartData.labels = this.DataGraficos[1].fechas;
  }

}
