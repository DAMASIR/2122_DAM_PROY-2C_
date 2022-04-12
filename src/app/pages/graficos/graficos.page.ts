import { Component, Input, OnInit } from '@angular/core';
import { ServicioGraficoService } from '../../services/servicio-grafico.service';
import { Empresa } from '../../models/empresa';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
})
export class GraficosPage implements OnInit {

  constructor(public servicio: ServicioGraficoService) { }

  public chartClicked(e:any):void {
    console.log(e);
  }
  
  public chartHovered(e:any):void {
    console.log(e);
  }

  ngOnInit() {
  }

}
