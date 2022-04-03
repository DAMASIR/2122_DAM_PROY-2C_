import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ServicioEmpresaService } from '../services/servicio-empresa.service';
import { HttpServicioService } from '../services/http-servicio.service';
import { Empresa } from '../models/empresa';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  toggle = "Detener scroll infinito";
  cargas = 3;
  url: string;
  pagina = 1;
  empresas_por_pagina = 8;

  public checkeds = 0;
  public limit = 3;

  constructor(public servicio: ServicioEmpresaService , public httpServicio: HttpServicioService, public alertController: AlertController) {
    this.getEmpresas(false, "");
  }

  // Metodo llamado por el scroll infinito cuando se activa
  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      this.getEmpresas(true, event);
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

  // Metodo utilizado al seleccionar las empresas que se utilizaran en los graficos
  comprobar(seleccionado) {
    if (!seleccionado.isChecked){
      this.checkeds++;
      console.log(this.checkeds);
    } else {
      this.checkeds--;
      console.log(this.checkeds);
    }
  }

  // Metodo para recargar empresas en el scroll infinito
  getEmpresas(otraCarga, event) {

    this.url = '?_page=' + this.pagina + '&_limit=' + this.empresas_por_pagina;

    this.httpServicio.getEmpresasList(this.url)
      .subscribe((data: any) => {
        for (let i = 0; i < data.length; i++) {
          this.servicio.empresas.push(data[i]);
        }
        console.log(this.servicio.empresas);
        if (otraCarga)
          event.target.complete();

        this.pagina++;
      }, error => {
        console.log(error);
      })
  }

  // Metodo para manejar la eliminacion de una empresa a través de una ventana de alerta para evitar eliminaciones indeseadas
  async presentAlertConfirm(id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmar!',
      message: '¿Esta seguro que quiere eliminar la <strong>empresa</strong>?!!!',
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

            console.log('Confirmar Eliminar Empresa');
            console.log(id);
          }
        }
      ]
    });
    await alert.present();
  }

}
