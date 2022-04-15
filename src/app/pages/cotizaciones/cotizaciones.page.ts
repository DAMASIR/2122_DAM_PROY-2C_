import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { HttpServicioService } from 'src/app/services/http-servicio.service';
import { Cotizacion } from 'src/app/models/cotizacion';
import { ServicioEmpresaService } from 'src/app/services/servicio-empresa.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.page.html',
  styleUrls: ['./cotizaciones.page.scss'],
})
export class CotizacionesPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public id: number;

  items = [];
  toggle = "Detener scroll infinito";
  cargas = 3;
  contador = 0;

  url: string;
  pagina = 1;
  cotizaciones_por_pagina = 10;

  constructor(public servicioHttp: HttpServicioService, public servicio: ServicioEmpresaService, public activatedRouter: ActivatedRoute, public alertController: AlertController) {
    this.inicializarLista();
  }

  // Metodo que lanza la recarga de datos al scroll infinito
  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      this.getCotizaciones(true, event);
      this.cargas--;
    }, 1000);
  }

  // Metodo para activar o desactivar el scroll infinito
  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    if(this.toggle == "Detener scroll infinito"){
      this.toggle = "Activar scroll infinito";
    } else {this.toggle = "Detener scroll infinito"}
  }

  // Metodo para recargar empresas en el scroll infinito
  getCotizaciones(otraCarga, event) {
      this.url = '?page=' + this.pagina + '&limit=' + this.cotizaciones_por_pagina;
      console.log(this.url);
  
      this.servicioHttp.getListaCotizacionesEmpresa(this.id, this.url)
        .subscribe((data: any) => {
          console.log(data);
          for (let i = 0; i < data.length; i++) {
            Cotizacion.convertir(data[i]);
            this.servicio.cotizacionesEmpresa.push(data[i]);
          }
          console.log(this.servicio.cotizacionesEmpresa);
          if (otraCarga === true) {
            event.target.complete();
          }
          this.pagina++;
        }, error => {
          console.log(error);
        });
    }

  // Metodo para resetear los datos del scroll infinito
  public inicializarLista() {
    this.servicio.cotizacionesEmpresa = [];
    this.cargas = 3;
    this.pagina = 1;
  }

  // Metodo para resetar el contenido de las cotizaciones
  resetearCotizaciones() {
    this.servicio.cotizacionesEmpresa = [];
  }

  // Presentacion de la ventana de alerta para confirmar la eliminacion de una cotizacion
  async presentAlertConfirm(id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmar!',
      message: '¿Esta seguro que quiere eliminar la <strong>cotizacion</strong>?!!!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Operacion cancelada');
          }
        }, {
          text: 'Eliminar',
          id: 'confirm-button',
          handler: () => {
            this.servicioHttp.deleteCotizacion(id).subscribe((data) => {
              console.log(data);
              // Recargamos la pantalla con datos actualizados desde el servidor
              this.inicializarLista();
              this.getCotizaciones(false, "");
              console.log(this.servicio.cotizacionesEmpresa);
            },
            (error) => {
              console.log(error);
            });
            console.log('Confirmar Eliminar Empresa');
            console.log(id);
          }
        }
      ]
    });
    await alert.present();
  }

  ngOnInit() {
    this.id = +this.activatedRouter.snapshot.paramMap.get('id');
    this.inicializarLista();
    this.getCotizaciones(false, "");
  }

}
