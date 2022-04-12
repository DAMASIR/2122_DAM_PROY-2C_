import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ServicioGraficoService } from '../../services/servicio-grafico.service';
import { BaseChartDirective } from 'ng2-charts';
import { Empresa } from '../../models/empresa';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
})
export class GraficosPage implements OnInit {

  constructor(public servicio: ServicioGraficoService) { }

  @ViewChild("baseChart") public chart: BaseChartDirective;

  public cambio = false;
  public tituloCambiar = 'Radar';

  public cambiar() {
    if(!this.cambio) {
      this.servicio.lineChartType = 'radar';
      this.tituloCambiar = 'Linea';
      this.cambio = true;
    } else {
      this.servicio.lineChartType = 'line';
      this.tituloCambiar = 'Radar';
      this.cambio = false;
    }
  }

  public chartClicked(e:any):void {
    console.log(e);
  }
  
  public chartHovered(e:any):void {
    console.log(e);
  }

  ngOnInit() {
  }

}
