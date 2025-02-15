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
  contador = 0;

  url: string;
  pagina = 1;
  cotizaciones_por_pagina = 10;

  public ultima = false;

  constructor(public servicioHttp: HttpServicioService, public servicio: ServicioEmpresaService, public activatedRouter: ActivatedRoute, public alertController: AlertController) {
    this.inicializarLista();
  }

  // Metodo que lanza la recarga de datos al scroll infinito
  loadData(event) {
    setTimeout(() => {
      this.getCotizaciones(true, event);
    }, 1000);
  }

  // Metodo para activar o desactivar el scroll infinito
  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    if(this.toggle == "Detener scroll infinito"){
      this.toggle = "Activar scroll infinito";
    } else {this.toggle = "Detener scroll infinito"}
  }

  // Metodo para recargar cotizaciones en el scroll infinito
  getCotizaciones(otraCarga, event) {
      this.url = '?page=' + this.pagina + '&limit=' + this.cotizaciones_por_pagina;
  
      this.servicioHttp.getListaCotizacionesEmpresa(this.id, this.url)
        .subscribe((data: any) => {
          for (let i = 0; i < data.length; i++) {
            Cotizacion.convertir(data[i]);
            this.servicio.cotizacionesEmpresa.push(data[i]);
          }
          if(data.length < 10) {
            this.ultima = true;
          }
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
    this.pagina = 1;
    this.ultima = false;
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
          cssClass: 'eliminar',
          id: 'confirm-button',
          handler: () => {
            this.servicioHttp.deleteCotizacion(id).subscribe((data) => {
              // Recargamos la pantalla con datos actualizados desde el servidor
              this.inicializarLista();
              this.getCotizaciones(false, "");
            },
            (error) => {
              console.log(error);
            });
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
