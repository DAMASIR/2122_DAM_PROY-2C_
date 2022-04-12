import { Component, ViewChild, OnInit } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ServicioEmpresaService } from '../services/servicio-empresa.service';
import { HttpServicioService } from '../services/http-servicio.service';
import { ServicioGraficoService } from '../services/servicio-grafico.service';
import { DataGrafico } from '../models/data-grafico';
import { Cotizacion } from '../models/cotizacion';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  toggle = "Detener scroll infinito";
  cargas = 3;

  url: string;
  pagina = 1;
  empresas_por_pagina = 8;

  public checkeds = 0;
  public limit = 3;

  public params = '?';
  public params2 = '';
  public nombreBusqueda = '';

  public nombreSeleccionada: string;
  public fechasSeleccionada: string[];
  public valoresSeleccionada: number[];
  public grafico: DataGrafico;


  constructor(public servicio: ServicioEmpresaService , public httpServicio: HttpServicioService, public alertController: AlertController, public graficoServicio: ServicioGraficoService) {
    this.inicializarLista();
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
      this.nombreSeleccionada = seleccionado.nombre;
      this.obtenerCotizaciones(seleccionado.id, seleccionado.nombre);
    } else {
      this.checkeds--;
      console.log(this.checkeds);
      for(let i = 0; i < this.graficoServicio.DataGraficos.length; i++) {
        if(this.graficoServicio.DataGraficos[i].id == seleccionado.id) {
          this.graficoServicio.DataGraficos.splice(i, 1);
        }
      }
    }
  }

  // Metodo para recargar empresas en el scroll infinito
  getEmpresas(otraCarga, event) {
    this.url = this.params + this.nombreBusqueda + this.params2 + '_page=' + this.pagina + '&_limit=' + this.empresas_por_pagina;
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
      });
  }
  
  // Metodo para inicializar la lista y resetear el scroll infinito
  public inicializarLista() {
    this.servicio.empresas = [];
    this.cargas = 3;
    this.pagina = 1;
  }

    // Metodo utilizado por el buscador para encotrar resultados en el servidor
    public searching(event) {
      console.log('Buscando...');
      console.log(event.detail.value);
      this.inicializarLista();
      this.nombreBusqueda = event.detail.value;
      if(event.detail.value === '') {
        this.params = '?';
        this.params2 = '';
      } else {
        this.params = '?nombre_like=';
        this.params2 = '&';
      }
      this.url = this.params + this.nombreBusqueda + this.params2 + '_page=' + this.pagina + '&_limit=' + this.empresas_por_pagina;
      this.getEmpresas(false, "");
    }

  // Metodo para obtener las cotizaciones de la empresa seleccionada para graficos
  public obtenerCotizaciones(id, nombre) {
    this.httpServicio.getListaCotizacionesEmpresa(id, '').subscribe((data: Cotizacion[]) => {
      for (let i = 0; i < data.length; i++) {
        this.fechasSeleccionada.push(data[i].fecha);
        this.valoresSeleccionada.push(data[i].valor);
      }
      console.log(this.fechasSeleccionada);
      console.log(this.valoresSeleccionada);
      this.grafico = new DataGrafico(nombre, this.valoresSeleccionada, this.fechasSeleccionada, id);
      this.graficoServicio.DataGraficos.push(this.grafico);
      console.log(this.graficoServicio.DataGraficos);
      this.fechasSeleccionada = [];
      this.valoresSeleccionada = [];
    });
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
            this.httpServicio.deleteEmpresa(id).subscribe((data) => {
              console.log(data);
              // Recargamos la pantalla con datos actualizados desde el servidor
              this.inicializarLista();
              this.getEmpresas(false, "");
              console.log(this.servicio.empresas);
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
    this.inicializarLista();
    this.fechasSeleccionada = [];
    this.valoresSeleccionada = [];
  }
}
