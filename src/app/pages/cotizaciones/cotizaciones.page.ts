import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { HttpServicioService } from 'src/app/services/http-servicio.service';
import { Cotizacion } from 'src/app/models/cotizacion';
import { ServicioEmpresaService } from 'src/app/services/servicio-empresa.service';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.page.html',
  styleUrls: ['./cotizaciones.page.scss'],
})
export class CotizacionesPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public id: number;

  toggle = "Detener scroll infinito";
  cargas = 2;
  // contador = 0;

  url: string;
  pagina = 1;
  cotizaciones_por_pagina = 10;

  constructor(public servicioHttp: HttpServicioService, public servicio: ServicioEmpresaService, public activatedRouter: ActivatedRoute) {
  
   }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      this.getCotizaciones(true, event);
      this.cargas--;
    }, 1000);
  }

  // Metodo para intercambiar la funcionalidad del scroll infinito entre activo e inactivo
  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    if(this.toggle == "Detener scroll infinito"){
      this.toggle = "Activar scroll infinito";
    } else {this.toggle = "Detener scroll infinito"}
  }

  // Metodo para recargar empresas en el scroll infinito
  getCotizaciones(otraCarga, event) {

      this.url = '?_page=' + this.pagina + '&_limit=' + this.cotizaciones_por_pagina;
  
      this.servicioHttp.getListaCotizacionesEmpresa(this.id, this.url)
        .subscribe((data: any) => {
          console.log(data);
          for (let i = 0; i < data.length; i++) {
            this.servicio.cotizacionesEmpresa.push(data[i]);
          }
          console.log(this.servicio.cotizacionesEmpresa);
          if (otraCarga)
            event.target.complete();
  
          this.pagina++;
        }, error => {
          console.log(error);
        })
    }

  resetearCotizaciones() {
    this.servicio.cotizacionesEmpresa = [];
  }

  ngOnInit() {
    this.id = +this.activatedRouter.snapshot.paramMap.get('id');
    this.getCotizaciones(false, "");
  }

}
