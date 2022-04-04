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

  // items = [];
  toggle = "Detener scroll infinito";
  cargas = 2;
  contador = 0;

  url: string;
  pagina = 1;
  cotizaciones_por_pagina = 10;

  // cotix: Cotizacion[];

  constructor(public servicioHttp: HttpServicioService, public servicio: ServicioEmpresaService, public activatedRouter: ActivatedRoute) {
  
   }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      this.getCotizaciones(true, event);
      this.cargas--;
    }, 1000);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    if(this.toggle == "Detener scroll infinito"){
      this.toggle = "Activar scroll infinito";
    } else {this.toggle = "Detener scroll infinito"}
  }

  // addMoreItems(contador: number){
  //   for(let i = contador; i < contador + 10; i++){
  //     this.items.push(this.servicio.cotizacionesEmpresa[i]);
  //     // this.items.push({nombre: 'Empresa ' + i, isChecked: false});
  //   }
  //   this.contador += 10;
  // }

  // Metodo para recargar empresas en el scroll infinito
  getCotizaciones(otraCarga, event) {

      this.url = '?_page=' + this.pagina + '&_limit=' + this.cotizaciones_por_pagina;
  
      this.servicioHttp.getListaCotizacionesEmpresa(this.id, this.url)
        .subscribe((data: any) => {
          console.log(data);
          for (let i = 0; i < data.length; i++) {
            this.servicio.cotizacionesEmpresa.push(data[i]);
            // this.items.push(data[i]);
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

  // probar(id){
  //   let unaCoti = new Cotizacion(1001, 1, "01/04/22", 80);
  //   let otraCoti = new Cotizacion(1002, 1, "02/04/22", 85);
  //   let anotherCoti = new Cotizacion(1003, 1, "03/04/22", 99);
  //   this.cotix = [unaCoti, otraCoti, anotherCoti];
  //   this.servicioHttp.createCotizacion(unaCoti).subscribe((data) =>{
  //     console.log(data);
  //     },
  //   (error) => {
  //       console.log(error);
  //   });
  //   // this.servicioHttp.updateCotizaciones(id, this.cotix).subscribe((data) =>{
  //   //   console.log(data);
  //   // },
  //   // (error) => {
  //   //   console.log(error);
  //   // });
  //   console.log("cotizando");
  // }

  ngOnInit() {
    this.id = +this.activatedRouter.snapshot.paramMap.get('id');
    // this.addMoreItems(this.contador);
    // this.id = Number(this.activatedRouter.snapshot.paramMap.get('id'));
    console.log(this.id);
    console.log(this.id);
    // console.log(this.items)
    this.getCotizaciones(false, "");
  }

}
